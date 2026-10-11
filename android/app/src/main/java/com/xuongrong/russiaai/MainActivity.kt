package com.xuongrong.russiaai

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.os.Bundle
import android.os.Build
import android.provider.MediaStore
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Base64
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.WebResourceRequest
import android.app.DownloadManager
import android.content.BroadcastReceiver
import android.content.IntentFilter
import android.net.Uri
import android.os.Environment
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import java.io.ByteArrayOutputStream
import java.util.Locale

/**
 * Native Text-to-Speech bridge for WebView.
 * Provides reliable TTS via Android system engine.
 */
class TtsBridge(private val context: Context) {
    private var tts: TextToSpeech? = null
    private var isReady = false
    private val pendingQueue = mutableListOf<Pair<String, String>>()

    @JavascriptInterface
    fun isAvailable(): Boolean = true

    @JavascriptInterface
    fun speak(text: String, langTag: String): Boolean {
        if (text.isBlank()) return false
        if (tts == null) {
            initTts()
        }
        if (isReady) {
            doSpeak(text, langTag)
        } else {
            pendingQueue.add(Pair(text, langTag))
        }
        return true
    }

    @JavascriptInterface
    fun stop() {
        try { tts?.stop() } catch (_: Exception) {}
    }

    private fun initTts() {
        try {
            tts = TextToSpeech(context) { status ->
                if (status == TextToSpeech.SUCCESS) {
                    isReady = true
                    // Flush pending queue
                    val queued = pendingQueue.toList()
                    pendingQueue.clear()
                    for ((t, l) in queued) doSpeak(t, l)
                }
            }
        } catch (_: Exception) {}
    }

    private fun doSpeak(text: String, langTag: String) {
        try {
            val tts = this.tts ?: return
            val locale = when {
                langTag.startsWith("ru", ignoreCase = true) -> Locale("ru", "RU")
                langTag.startsWith("vi", ignoreCase = true) -> Locale("vi", "VN")
                langTag.startsWith("en", ignoreCase = true) -> Locale.US
                else -> Locale.getDefault()
            }
            // Try requested locale, fall back to default if not available
            val result = tts.setLanguage(locale)
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                tts.language = Locale.getDefault()
            }
            tts.setSpeechRate(0.95f)
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "v2_utterance_${System.currentTimeMillis()}")
        } catch (_: Exception) {}
    }

    fun shutdown() {
        try {
            tts?.stop()
            tts?.shutdown()
        } catch (_: Exception) {}
        tts = null
        isReady = false
    }
}

/**
 * Native Camera bridge for WebView.
 * Launches system camera and returns photo as base64 to JS.
 */
class CameraBridge(private val activity: MainActivity) {
    companion object {
        const val REQUEST_CAPTURE = 2001
    }

    @JavascriptInterface
    fun isAvailable(): Boolean = true

    @JavascriptInterface
    fun capturePhoto() {
        activity.runOnUiThread {
            try {
                val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
                if (intent.resolveActivity(activity.packageManager) != null) {
                    activity.startActivityForResult(intent, REQUEST_CAPTURE)
                } else {
                    activity.sendPhotoError("Không tìm thấy ứng dụng camera")
                }
            } catch (e: Exception) {
                activity.sendPhotoError(e.message ?: "Lỗi mở camera")
            }
        }
    }
}

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var ttsBridge: TtsBridge
    private lateinit var cameraBridge: CameraBridge
    private lateinit var updaterBridge: UpdaterBridge
    private val PERMISSION_REQUEST_CODE = 1001

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        setContentView(webView)

        checkPermissions()

        // Native bridges
        ttsBridge = TtsBridge(this)
        cameraBridge = CameraBridge(this)
        webView.addJavascriptInterface(ttsBridge, "AndroidTTS")
        webView.addJavascriptInterface(cameraBridge, "AndroidCamera")
        updaterBridge = UpdaterBridge(this)
        webView.addJavascriptInterface(updaterBridge, "AndroidUpdater")

        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        // Required for ES modules (type="module") and local assets on file://
        settings.allowFileAccessFromFileURLs = true
        settings.allowUniversalAccessFromFileURLs = true
        settings.databaseEnabled = true
        settings.mediaPlaybackRequiresUserGesture = false
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                // Mở ứng dụng điện thoại khi bấm số khẩn cấp (SOS)
                if (url.startsWith("tel:")) {
                    try {
                        val intent = Intent(Intent.ACTION_DIAL, Uri.parse(url))
                        startActivity(intent)
                    } catch (e: Exception) {
                        Toast.makeText(this@MainActivity, "Không mở được ứng dụng điện thoại", Toast.LENGTH_SHORT).show()
                    }
                    return true
                }
                return false
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest) {
                // Grant camera and microphone permissions to WebView
                runOnUiThread {
                    request.grant(request.resources)
                }
            }
        }

        // Load offline packaged application or local asset
        webView.loadUrl("file:///android_asset/public/index.html")
    }

    @Deprecated("Deprecated in Java")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == CameraBridge.REQUEST_CAPTURE) {
            if (resultCode == Activity.RESULT_OK) {
                try {
                    val bitmap = data?.extras?.get("data") as? Bitmap
                    if (bitmap != null) {
                        val stream = ByteArrayOutputStream()
                        bitmap.compress(Bitmap.CompressFormat.JPEG, 85, stream)
                        val base64 = Base64.encodeToString(stream.toByteArray(), Base64.NO_WRAP)
                        sendPhotoResult(base64)
                    } else {
                        sendPhotoError("Không nhận được ảnh từ camera")
                    }
                } catch (e: Exception) {
                    sendPhotoError(e.message ?: "Lỗi xử lý ảnh")
                }
            } else {
                sendPhotoError("Đã hủy chụp ảnh")
            }
        }
    }

    fun sendPhotoResult(base64Jpeg: String) {
        runOnUiThread {
            // Escape for JS string
            val safe = base64Jpeg.replace("\\", "\\\\").replace("'", "\\'")
            webView.evaluateJavascript("window.__onNativePhotoCaptured && window.__onNativePhotoCaptured('$safe')", null)
        }
    }

    fun sendPhotoError(message: String) {
        runOnUiThread {
            val safe = message.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ")
            webView.evaluateJavascript("window.__onNativePhotoError && window.__onNativePhotoError('$safe')", null)
        }
    }

    private fun checkPermissions() {
        val permissions = arrayOf(
            Manifest.permission.CAMERA,
            Manifest.permission.RECORD_AUDIO
        )

        val neededPermissions = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }

        if (neededPermissions.isNotEmpty()) {
            ActivityCompat.requestPermissions(this, neededPermissions.toTypedArray(), PERMISSION_REQUEST_CODE)
        }
    }

    /** Chạy JS trong WebView từ native bridge khác */
    fun evaluateJs(script: String) {
        runOnUiThread {
            try {
                webView.evaluateJavascript(script, null)
            } catch (_: Exception) {}
        }
    }

    override fun onDestroy() {
        ttsBridge.shutdown()
        if (::updaterBridge.isInitialized) updaterBridge.onDestroy()
        super.onDestroy()
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

}

/**
 * Native bridge để tải và cài đặt APK cập nhật — AN TOÀN.
 * Dùng DownloadManager của hệ thống (không cần FileProvider nên không gây crash khởi động).
 * JS gọi: AndroidUpdater.downloadAndInstall(apkUrl)
 * Kết quả trả về qua: window.__onUpdateDownloaded() hoặc window.__onUpdateError(msg)
 */
class UpdaterBridge(private val activity: MainActivity) {

    private var downloadId: Long = -1L
    private var receiver: BroadcastReceiver? = null

    @JavascriptInterface
    fun downloadAndInstall(apkUrl: String) {
        activity.runOnUiThread {
            try {
                // Hủy receiver cũ nếu có
                receiver?.let {
                    try { activity.unregisterReceiver(it) } catch (_: Exception) {}
                }

                val request = DownloadManager.Request(Uri.parse(apkUrl)).apply {
                    setTitle("Nước Nga Trong Tầm Tay")
                    setDescription("Đang tải bản cập nhật...")
                    setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                    setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "russia-ai-update.apk")
                    setMimeType("application/vnd.android.package-archive")
                    setAllowedOverMetered(true)
                }

                val dm = activity.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
                downloadId = dm.enqueue(request)

                // Lắng nghe khi tải xong
                receiver = object : BroadcastReceiver() {
                    override fun onReceive(context: Context?, intent: Intent?) {
                        val id = intent?.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1) ?: -1
                        if (id == downloadId) {
                            try { activity.unregisterReceiver(this) } catch (_: Exception) {}
                            receiver = null
                            openDownloadedApk(dm)
                        }
                    }
                }
                val filter = IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    activity.registerReceiver(receiver, filter, Context.RECEIVER_NOT_EXPORTED)
                } else {
                    @Suppress("UnspecifiedRegisterReceiverFlag")
                    activity.registerReceiver(receiver, filter)
                }

            } catch (e: Exception) {
                postError("Không bắt đầu được quá trình tải: ${e.message}")
            }
        }
    }

    private fun openDownloadedApk(dm: DownloadManager) {
        try {
            val uri = dm.getUriForDownloadedFile(downloadId)
            if (uri == null) {
                postError("Tải xong nhưng không tìm thấy file.")
                return
            }
            // Mở màn hình cài đặt hệ thống — người dùng bấm "Cài đặt" để cho phép
            val intent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(uri, "application/vnd.android.package-archive")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION
            }
            activity.startActivity(intent)
            activity.evaluateJs("window.__onUpdateDownloaded && window.__onUpdateDownloaded()")
        } catch (e: Exception) {
            postError("Không mở được file cài đặt: ${e.message}")
        }
    }

    /** Mở URL bằng trình duyệt ngoài */
    @JavascriptInterface
    fun openInBrowser(url: String) {
        activity.runOnUiThread {
            try {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                activity.startActivity(intent)
            } catch (e: Exception) {
                postError("Không mở được trình duyệt: ${e.message}")
            }
        }
    }

    @JavascriptInterface
    fun isAvailable(): Boolean = true

    private fun postError(msg: String) {
        val escaped = msg.replace("'", "\\'")
        activity.evaluateJs("window.__onUpdateError && window.__onUpdateError('$escaped')")
    }

    fun onDestroy() {
        receiver?.let {
            try { activity.unregisterReceiver(it) } catch (_: Exception) {}
        }
        receiver = null
    }
}

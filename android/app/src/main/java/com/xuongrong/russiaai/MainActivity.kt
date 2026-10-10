package com.xuongrong.russiaai

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.os.Bundle
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

        webView.webViewClient = object : WebViewClient() {}

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

    override fun onDestroy() {
        ttsBridge.shutdown()
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

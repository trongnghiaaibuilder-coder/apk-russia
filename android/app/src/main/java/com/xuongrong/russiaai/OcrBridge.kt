package com.xuongrong.russiaai

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.util.Base64
import android.webkit.JavascriptInterface
import com.googlecode.tesseract.android.TessBaseAPI

/**
 * OCR native dùng Tesseract (tess-two) — nhanh và ổn định hơn Tesseract.js trong WebView.
 * Có tiền xử lý ảnh: resize, chuyển xám, tăng tương phản.
 */
class OcrBridge(private val activity: MainActivity) {
    private var tessApi: TessBaseAPI? = null
    private var initialized = false

    private fun ensureInit(): Boolean {
        if (initialized) return tessApi != null
        initialized = true
        return try {
            val tessDir = java.io.File(activity.filesDir, "tessdata")
            if (!tessDir.exists()) tessDir.mkdirs()
            // Copy rus.traineddata từ assets nếu chưa có
            val trainedData = java.io.File(tessDir, "rus.traineddata")
            if (!trainedData.exists()) {
                activity.assets.open("tessdata/rus.traineddata").use { input ->
                    trainedData.outputStream().use { output ->
                        input.copyTo(output)
                    }
                }
            }
            val api = TessBaseAPI()
            if (api.init(activity.filesDir.absolutePath, "rus")) {
                api.pageSegMode = TessBaseAPI.PageSegMode.PSM_AUTO
                tessApi = api
                true
            } else {
                false
            }
        } catch (_: Exception) {
            false
        }
    }

    @JavascriptInterface
    fun isAvailable(): Boolean {
        return try {
            ensureInit()
        } catch (_: Exception) {
            false
        }
    }

    /**
     * Nhận diện chữ từ ảnh base64 JPEG.
     * Trả kết quả qua window.__ocrNativeCallback(callbackId, jsonString).
     * JSON: {success, lines: [{text, x0,y0,x1,y1}], error}
     */
    @JavascriptInterface
    fun recognizeText(base64Image: String, callbackId: String) {
        Thread {
            val result = try {
                if (!ensureInit() || tessApi == null) {
                    "{\"success\":false,\"error\":\"Không khởi tạo được OCR\"}"
                } else {
                    val imageBytes = Base64.decode(base64Image, Base64.DEFAULT)
                    val rawBitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
                        ?: throw Exception("Không đọc được ảnh")
                    val bitmap = preprocessImage(rawBitmap)
                    val api = tessApi!!
                    val lines = mutableListOf<String>()
                    synchronized(api) {
                        api.setImage(bitmap)
                        val ut = api.resultIterator
                        if (ut != null) {
                            ut.begin()
                            try {
                                do {
                                    val text = ut.getUTF8Text(TessBaseAPI.PageIteratorLevel.RIL_TEXTLINE)?.trim()
                                    if (!text.isNullOrEmpty()) {
                                        val rect = ut.getBoundingRect(TessBaseAPI.PageIteratorLevel.RIL_TEXTLINE)
                                        if (rect != null) {
                                            val escaped = text.replace("\\", "\\\\").replace("\"", "\\\"")
                                            lines.add("{\"text\":\"$escaped\",\"x0\":${rect.left},\"y0\":${rect.top},\"x1\":${rect.right},\"y1\":${rect.bottom}}")
                                        }
                                    }
                                } while (ut.next(TessBaseAPI.PageIteratorLevel.RIL_TEXTLINE))
                            } finally {
                                ut.delete()
                            }
                        }
                        api.clear()
                    }
                    if (!bitmap.isRecycled) bitmap.recycle()
                    if (lines.isEmpty()) {
                        "{\"success\":false,\"error\":\"Không đọc được chữ trong ảnh\"}"
                    } else {
                        "{\"success\":true,\"lines\":[${lines.joinToString(",")}]}"
                    }
                }
            } catch (e: Exception) {
                val msg = (e.message ?: "Lỗi OCR").replace("\"", "")
                "{\"success\":false,\"error\":\"$msg\"}"
            }
            val safeResult = result.replace("\\", "\\\\").replace("'", "\\'")
            activity.runOnUiThread {
                try {
                    activity.webView.evaluateJavascript(
                        "window.__ocrNativeCallback('$callbackId','$safeResult')",
                        null
                    )
                } catch (_: Exception) {
                }
            }
        }.start()
    }

    /** Tiền xử lý: resize nếu quá lớn, chuyển xám, tăng tương phản */
    private fun preprocessImage(src: Bitmap): Bitmap {
        var bitmap = src
        val maxDim = 1600
        val w = src.width
        val h = src.height
        if (maxOf(w, h) > maxDim) {
            val scale = maxDim.toFloat() / maxOf(w, h)
            val scaled = Bitmap.createScaledBitmap(src, (w * scale).toInt(), (h * scale).toInt(), true)
            if (scaled != src) src.recycle()
            bitmap = scaled
        }
        val width = bitmap.width
        val height = bitmap.height
        val result = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val pixels = IntArray(width * height)
        bitmap.getPixels(pixels, 0, width, 0, 0, width, height)
        for (i in pixels.indices) {
            val p = pixels[i]
            var gray = (0.299 * Color.red(p) + 0.587 * Color.green(p) + 0.114 * Color.blue(p)).toInt()
            gray = ((gray - 128) * 1.4 + 128).toInt().coerceIn(0, 255)
            pixels[i] = Color.rgb(gray, gray, gray)
        }
        result.setPixels(pixels, 0, width, 0, 0, width, height)
        if (result != bitmap && !bitmap.isRecycled) bitmap.recycle()
        return result
    }
}

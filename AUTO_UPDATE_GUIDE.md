# Hướng dẫn bật Tự động cập nhật app

App đã có sẵn hệ thống tự động cập nhật. Để dùng, bạn chỉ cần host 2 thứ:

## 1. File `version.json`

Upload file `version.json` (có sẵn trong source) lên nơi public, ví dụ:
- GitHub: `https://raw.githubusercontent.com/<user>/<repo>/main/version.json`
- Hoặc bất kỳ hosting nào trả về JSON

Nội dung mẫu:
```json
{
  "versionCode": 12,
  "versionName": "2.10.0",
  "apkUrl": "https://github.com/<user>/<repo>/releases/download/v2.10.0/app.apk",
  "releaseNotes": "Mô tả những gì mới trong bản này",
  "mandatory": false
}
```

- `versionCode`: số nguyên, **phải tăng** mỗi bản mới (app so sánh số này)
- `versionName`: tên hiển thị (vd: "2.10.0")
- `apkUrl`: link trực tiếp tải file APK
- `releaseNotes`: mô tả ngắn hiện cho người dùng
- `mandatory`: `true` = bắt buộc cập nhật (không có nút "Để sau")

## 2. File APK

Upload APK lên GitHub Releases (hoặc hosting khác) và lấy link trực tiếp.

## 3. Cấu hình URL trong app (nếu không dùng URL mặc định)

Mở console hoặc thêm code tạm:
```js
// Chạy 1 lần trong WebView console
localStorage.setItem('app_update_url', 'https://link-cua-ban/version.json');
```

Hoặc sửa `DEFAULT_UPDATE_URL` trong `src/services/updateService.ts` rồi build lại.

## Cách app hoạt động

1. **Tự động**: mỗi khi mở app (tối đa 1 lần/ngày), app kiểm tra version.json sau 3 giây
2. **Thủ công**: vào Cài đặt → "Cập nhật ứng dụng" → "Kiểm tra"
3. Nếu có bản mới: hiện banner đầu màn hình với nút "Cập nhật" / "Để sau"
4. Bấm "Cập nhật": app tải APK qua native bridge → mở màn hình cài đặt hệ thống
5. Người dùng bấm "Cài đặt" trên màn hình hệ thống để hoàn tất

## Lưu ý kỹ thuật

- Cần quyền `REQUEST_INSTALL_PACKAGES` (đã thêm trong AndroidManifest)
- Android 8+: người dùng cần cho phép "Cài đặt ứng dụng không xác định" cho app này (chỉ hỏi 1 lần đầu)
- FileProvider đã cấu hình để chia sẻ file APK cho trình cài đặt hệ thống
- APK cập nhật **phải ký cùng key** với bản đang cài (debug key hiện tại) thì mới cài đè được

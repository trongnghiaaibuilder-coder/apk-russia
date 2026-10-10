IMPORTANT — APK STATUS

The file artifacts/builds/russia-ai-support-v1.0.0.apk in the original archive is NOT a genuine installable Android APK.
Inspection found that it is a ZIP containing source/configuration and web assets, but no compiled classes.dex, resources.arsc, or APK signing metadata. Do not install or distribute it as an APK.

Use the GitHub Actions workflow at .github/workflows/build-android-apk.yml to compile the Android project on a cloud runner. A successful workflow should produce a genuine debug APK as a downloadable workflow artifact. The workflow's PASS status is not guaranteed until it actually runs successfully.

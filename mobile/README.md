# 1234WebTool Mobile (Hybrid Android & iOS)

This folder contains the **Hybrid Mobile App** for 1234WebTool powered by **[Capacitor](https://capacitorjs.com/)**. It wraps the existing Next.js web application into native Android and iOS containers, allowing you to build an APK for Android or an iOS app for Apple devices.

---

## 📱 Quick Start

### 1. Sync Web Assets to Mobile
Whenever you make changes to the web app in `src/`, build and sync the assets to the mobile projects:
```bash
# From repository root:
npm run mobile:sync

# Or from within this directory:
npm run sync-web
```

---

## 🤖 Android: Building and Running the APK

### Prerequisites for Local Android Build
1. **Java JDK 21 or 17**:
   Installed via Homebrew: `/opt/homebrew/opt/openjdk@21`
   Add to your environment:
   ```bash
   export JAVA_HOME="/opt/homebrew/opt/openjdk@21"
   export PATH="$JAVA_HOME/bin:$PATH"
   ```
2. **Android SDK**:
   - **Option A (Recommended: Android Studio)**:
     Download and install [Android Studio](https://developer.android.com/studio).
     Open Android Studio and configure the SDK from SDK Manager (`Android 14 / API 34` or higher).
     Then you can open the project directly:
     ```bash
     npm run mobile:open
     # Or inside mobile/ folder:
     npx cap open android
     ```
     Click **Run** (Green Play button) or go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - **Option B (Command Line)**:
     If you have Android command line tools and `ANDROID_HOME` configured:
     ```bash
     npm run mobile:apk
     # Or inside mobile/android:
     ./gradlew assembleDebug
     ```
     The generated APK will be at:
     ```
     mobile/android/app/build/outputs/apk/debug/app-debug.apk
     ```

### 🚀 Option C (Zero-Setup Cloud Build via GitHub Actions)
You don't even need to install the multi-gigabyte Android SDK locally!
A GitHub Actions workflow is preconfigured in `.github/workflows/build-apk.yml`:
1. Push your changes to GitHub (`git push`).
2. Go to your repository on GitHub -> **Actions** tab -> **Build Android APK**.
3. You can also trigger it manually using **Run workflow**.
4. Once completed, download the `1234webtool-debug-apk` artifact directly to your phone or computer.

### How to Install the APK onto your Android Phone
1. **Direct Download**:
   Send the `.apk` file to your phone (via USB transfer, Google Drive, WhatsApp, or direct browser download).
   Tap the APK on your phone to install (allow "Install from unknown sources" if prompted).
2. **Via ADB (USB Debugging)**:
   - On your phone: enable Developer Options and USB Debugging.
   - Connect via USB and run:
     ```bash
     adb install mobile/android/app/build/outputs/apk/debug/app-debug.apk
     ```

---

## 🍏 iOS: Building with Xcode

To run or build for iOS on macOS:
1. Ensure Xcode and CocoaPods are installed:
   ```bash
   brew install cocoapods
   ```
2. Add the iOS platform (if not already initialized):
   ```bash
   cd mobile
   npx cap add ios
   ```
3. Open the project in Xcode:
   ```bash
   npx cap open ios
   ```
4. Select your iOS simulator or connected iPhone and click **Run**.

---

## 📁 Directory Structure
```
mobile/
├── android/            # Native Android Studio / Gradle project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml  # Permissions & App config
│   │   │   └── assets/public/       # Synced web assets
│   │   └── build.gradle
│   └── gradlew         # Gradle build wrapper
├── dist/               # Exported static web assets from Next.js
├── scripts/
│   └── sync-assets.sh  # Automated build & sync script
├── capacitor.config.ts # Capacitor configuration
└── package.json        # Dependencies & scripts
```

# About Rich Chinese Bible

Rich Chinese Bible is a Moble app created by React Native. <br/>
Google Play link: https://play.google.com/store/apps/details?id=com.chinesebible

## Environment setting

**iOS**

https://facebook.github.io/react-native/docs/getting-started.html (Choose Building Projects with Native Code)

**Android**

https://guides.codepath.com/android/Installing-Android-SDK-Tools <br/>
https://www.decoide.org/react-native/docs/android-setup.html


## Clone project
```
$ git clone https://github.com/DennisLyn/rich-chinese-bible.git
```

## Build project
```
$ npm install
```

## Run on simulator/emulator

**iOS**
```
$react-native run-iso
```

**Android**

1. start AVD ( start android studio > tools > AVD manager > start any one)
2. Go to project folder and run $ react-native run-android

## Run on devices

**iOS**
```
$react-native run-ios --configuration Release --device "Dennis's iphone 5" (Need valid Apple developer account)
```
**Android**

Connect phone by USB, then run
```
$react-native run-android
```

## Generate APK for Android

References

https://developer.android.com/studio/publish/app-signing <br/>
https://developer.android.com/studio/publish/app-signing#gradle-sign (#config gradle to sign APK.)

1. Put .keystore file to ./android/app/ (same folder as build.gradle)
2. Go to ./android and run $./gradlew assembleRelease
3. Go to the path to get release app: android/app/build/outputs/apk/release/app-release.apk
4. Install APK on phone to see if it works well.

## Trouble Shoot

**If getting issue regarding icons. Do the following.**

1. $rm ./node_modules/react-native/local-cli/core/__fixtures__/files/package.json
2. $npm install
3. $react-native run-ios

**If getting iOS error regarding RNSplashScreen. (This is a defect for the library itself)**

Change 'SplashScreen show' to 'RNSplashScreen show' in the RNSplashScreen.m (Libraries/SplashScreen.xcodeproj)

## Tips

1. Debug port: http://localhost:8081
2. For iOS: Command + D, open debug window in Simulator. Command + R, reload/refresh app in Simulator.
3. For Android: $adb shell input keyevent 82, to open debug window in Emulator.

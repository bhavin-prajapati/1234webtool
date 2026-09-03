#!/bin/bash
set -e

echo "=== Android Environment Setup Helper ==="

# Check Java
if [ -d "/opt/homebrew/opt/openjdk@21" ]; then
  echo "✔ Found OpenJDK 21 at /opt/homebrew/opt/openjdk@21"
  export JAVA_HOME="/opt/homebrew/opt/openjdk@21"
elif [ -n "$JAVA_HOME" ]; then
  echo "✔ Found JAVA_HOME=$JAVA_HOME"
else
  echo "⚠ JAVA_HOME not set. If needed, install via: brew install openjdk@21"
fi

# Check Android SDK
DEFAULT_SDK_DIR="$HOME/Library/Android/sdk"
if [ -d "$DEFAULT_SDK_DIR" ]; then
  echo "✔ Found Android SDK at $DEFAULT_SDK_DIR"
  echo "sdk.dir=$DEFAULT_SDK_DIR" > "$(dirname "$0")/../android/local.properties"
  echo "✔ Created mobile/android/local.properties pointing to SDK"
elif [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ]; then
  echo "✔ Found ANDROID_HOME=$ANDROID_HOME"
  echo "sdk.dir=$ANDROID_HOME" > "$(dirname "$0")/../android/local.properties"
  echo "✔ Created mobile/android/local.properties pointing to SDK"
else
  echo "⚠ Android SDK directory not found."
  echo "  Recommended: Install Android Studio from https://developer.android.com/studio"
  echo "  Once Android Studio is installed, it will place the SDK at $DEFAULT_SDK_DIR"
  echo "  Or run: brew install --cask android-studio"
fi

echo "=== Setup check finished ==="

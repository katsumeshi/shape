package com.yukimatsushita.shape;


import com.chirag.RNMail.RNMail;
import com.facebook.react.ReactApplication;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.horcrux.svg.SvgPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;

import androidx.multidex.MultiDexApplication;

import co.apptailor.googlesignin.RNGoogleSigninPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.links.RNFirebaseLinksPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.FacebookSdk;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import com.yukimatsushita.shape.config.ConfigPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages =  Arrays.<ReactPackage>asList(
              new RNFirebasePackage(),
              new RNFirebaseFirestorePackage(),
              new RNFirebaseCrashlyticsPackage(),
              new RNFirebaseAuthPackage(),
              new RNFirebaseLinksPackage(),
              new RNDeviceInfo(),
              new ConfigPackage(),
              new AsyncStoragePackage(),
              new FBSDKPackage(),
              new RNGestureHandlerPackage(),
              new RNGoogleSigninPackage(),
              new RNMail(),
              new SvgPackage(),
              new VectorIconsPackage(),
              new MainReactPackage(),
              new RNNotificationsPackage(MainApplication.this)
      );
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.sdkInitialize(getApplicationContext());
    SoLoader.init(this, /* native exopackage */ false);
  }
}

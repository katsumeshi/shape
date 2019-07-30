package com.yukimatsushita.shape;


import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.chirag.RNMail.RNMail;
import com.horcrux.svg.SvgPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

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
import com.yukimatsushita.shape.BuildConfig;
import com.yukimatsushita.shape.config.ConfigtPackage;

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
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:
      packages.add(new FBSDKPackage());
      packages.add(new RNFirebasePackage());
      packages.add(new RNGestureHandlerPackage());
      packages.add(new RNDeviceInfo());
      packages.add(new RNGoogleSigninPackage());
      packages.add(new RNFirebaseAuthPackage());
      packages.add(new RNFirebaseFirestorePackage());
      packages.add(new RNFirebaseLinksPackage());
      packages.add(new RNFirebaseCrashlyticsPackage());
      packages.add(new SvgPackage());
      packages.add(new RNMail());
      packages.add(new ConfigtPackage());

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

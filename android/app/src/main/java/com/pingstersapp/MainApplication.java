package com.pingstersapp;

import android.app.Application;
import com.facebook.react.ReactApplication;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.imagepicker.ImagePickerPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.slowpath.hockeyapp.RNHockeyAppPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.pingstersapp.LocationService.YettaLocationPackage;
import com.pingstersapp.VinylMap.VinylMapPackage;
import com.pingstersapp.fcm.YettaFcmPackage;
import com.pingstersapp.UDID.YettaUDIDPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new RNHockeyAppPackage(MainApplication.this),
            new MainReactPackage(),
            new ReactNativeConfigPackage(),
            new ImagePickerPackage(),
            new LottiePackage(),
            new LinearGradientPackage(),
            new BlurViewPackage(),
            new BackgroundTimerPackage(),
            new YettaFcmPackage(),
            new YettaLocationPackage(),
            new VinylMapPackage(),
            new YettaUDIDPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}

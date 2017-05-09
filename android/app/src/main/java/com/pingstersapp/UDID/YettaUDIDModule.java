package com.pingstersapp.UDID;

import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.firebase.iid.FirebaseInstanceId;

import javax.annotation.Nullable;

import static android.content.ContentValues.TAG;

/**
 * Created by jeyoungchan on 5/8/17.
 */

public class YettaUDIDModule extends ReactContextBaseJavaModule {
    public YettaUDIDModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "YettaUDIDManager";
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void getUDID(Callback errorCallback, Callback successCallback) {
        try {
            String UDID = Settings.Secure.getString(
                    getReactApplicationContext().getContentResolver(),
                    Settings.Secure.ANDROID_ID);
            Log.d(TAG, "Android UDID: " + UDID);
            successCallback.invoke(UDID);
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }
}

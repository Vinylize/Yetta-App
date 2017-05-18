package com.pingstersapp.LocationService;

/**
 * Created by jeyoungchan on 3/23/17.
 */

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.Location;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.location.LocationResult;

import javax.annotation.Nullable;

public class YettaLocationModule extends ReactContextBaseJavaModule {
    public YettaLocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        registerBackgroundLocationUpdateBroadcastReceiver(reactContext);
        registerForegroundLocationUpdateBroadcastReceiver(reactContext);
    }

    @Override
    public String getName() {
        return "YettaLocationAndroid";
    }

    // send events to JS
    private void sendEvent(String eventName, @Nullable WritableMap params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    private void registerBackgroundLocationUpdateBroadcastReceiver(ReactApplicationContext reactContext) {
        IntentFilter intentFilter = new IntentFilter("com.pingstersapp.LocationService" +
                ".ReceiveLocationUpdateBackground");

        reactContext.registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (getReactApplicationContext().hasActiveCatalystInstance()) {
                    WritableMap params = Arguments.createMap();
                    LocationResult result = intent.getParcelableExtra("locations");
                    if (result != null) {
                        String latitude = Double.toString(result.getLastLocation().getLatitude());
                        String longitude = Double.toString(result.getLastLocation().getLongitude());
                        params.putString("latitude", latitude);
                        params.putString("longitude", longitude);
                    }
                    sendEvent("didUpdateToLocationAndroidBackground", params);
                }
            }
        }, intentFilter);
    }

    private void registerForegroundLocationUpdateBroadcastReceiver(ReactApplicationContext reactContext) {
        IntentFilter intentFilter = new IntentFilter("com.pingstersapp.LocationService" +
                ".ReceiveLocationUpdateForeground");

        reactContext.registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (getReactApplicationContext().hasActiveCatalystInstance()) {
                    WritableMap params = Arguments.createMap();
                    Location location = intent.getParcelableExtra("locations");

                    String latitude = Double.toString(location.getLatitude());
                    String longitude = Double.toString(location.getLongitude());

                    params.putString("latitude", latitude);
                    params.putString("longitude", longitude);

                    sendEvent("didUpdateToLocationAndroidForeground", params);
                }
            }
        }, intentFilter);
    }

    @ReactMethod
    public void startLocationService() {
        Intent i = new Intent("com.pingstersapp.LocationService.ReceiveStartLocationUpdates");
        getReactApplicationContext().sendOrderedBroadcast(i, null);
    }

    @ReactMethod
    public void stopLocationService() {
        Intent i = new Intent("com.pingstersapp.LocationService.ReceiveStopLocationUpdates");
        getReactApplicationContext().sendOrderedBroadcast(i, null);
    }

    @ReactMethod
    public void startBackgroundLocationService() {
        Intent i = new Intent("com.pingstersapp.LocationService.ReceiveStartBackgroundLocationUpdates");
        getReactApplicationContext().sendOrderedBroadcast(i, null);
    }

    @ReactMethod
    public void stopBackgroundLocationService() {
        Intent i = new Intent("com.pingstersapp.LocationService.ReceiveStopBackgroundLocationUpdates");
        getReactApplicationContext().sendOrderedBroadcast(i, null);
    }
}

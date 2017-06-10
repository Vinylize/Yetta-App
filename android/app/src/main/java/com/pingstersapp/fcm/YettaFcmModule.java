package com.pingstersapp.fcm;

/**
 * Created by jeyoungchan on 3/15/17.
 */

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;
import java.util.Set;

import javax.annotation.Nullable;

import static android.content.ContentValues.TAG;

public class YettaFcmModule extends ReactContextBaseJavaModule {
    public YettaFcmModule(ReactApplicationContext reactContext) {
        super(reactContext);
        registerMessageHandlerOnForeground();
        registerMessageHandlerOnBackgrounded();
    }

    @Override
    public String getName() {
        return "YettaFCMManager";
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

    private void registerMessageHandlerOnForeground() {
        IntentFilter intentFilter = new IntentFilter("com.pingstersapp.fcm.ReceiveNotification");

        getReactApplicationContext().registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (getReactApplicationContext().hasActiveCatalystInstance()) {
                    RemoteMessage message = intent.getParcelableExtra("message");
                    WritableMap params = Arguments.createMap();
                    WritableMap fcmData = Arguments.createMap();

                    if (message.getNotification() != null) {
                        RemoteMessage.Notification notification = message.getNotification();
                        fcmData.putString("title", notification.getTitle());
                        fcmData.putString("body", notification.getBody());
                        fcmData.putString("color", notification.getColor());
                        fcmData.putString("icon", notification.getIcon());
                        fcmData.putString("tag", notification.getTag());
                        fcmData.putString("action", notification.getClickAction());
                    }
                    params.putMap("fcm", fcmData);

                    if(message.getData() != null){
                        Map<String, String> data = message.getData();
                        Set<String> keysIterator = data.keySet();
                        for(String key: keysIterator){
                            params.putString(key, data.get(key));
                        }
                    }
                    sendEvent("FCMNotificationReceived", params);
                }
            }
        }, intentFilter);
    }

    private void registerMessageHandlerOnBackgrounded() {
        IntentFilter intentFilter = new IntentFilter("com.pingstersapp.fcm.ReceiveNotificationBackground");

        getReactApplicationContext().registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (getReactApplicationContext().hasActiveCatalystInstance()) {
                    WritableMap params = Arguments.createMap();
                    Intent message = intent.getParcelableExtra("message");
                    if (message.getExtras() != null) {
                        for (String key : message.getExtras().keySet()) {
                            Object value = message.getExtras().get(key);
                            Log.d(TAG, "background fcm module Key: " + key + " Value: " + value);
                            if (value != null)
                                params.putString(key, value.toString());
                        }
                    }
                    sendEvent("FCMNotificationReceived", params);
                }
            }
        }, intentFilter);
    }

    @ReactMethod
    public void getInitialNotification(Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            Log.d(TAG, "activity is null");
            promise.resolve(null);
            return;
        }
        promise.resolve(parseIntent(getCurrentActivity().getIntent()));
    }

    private WritableMap parseIntent(Intent intent){
        WritableMap params;
        Bundle extras = intent.getExtras();
        if (extras != null) {
            try {
                params = Arguments.fromBundle(extras);
            } catch (Exception e){
                Log.e(TAG, e.getMessage());
                params = Arguments.createMap();
            }
        } else {
            params = Arguments.createMap();
        }
        WritableMap fcm = Arguments.createMap();
        fcm.putString("action", intent.getAction());
        params.putMap("fcm", fcm);

        params.putInt("opened_from_tray", 1);
        return params;
    }

    @ReactMethod
    public void getToken(Callback errorCallback, Callback successCallback) {
        try {
            String FCMToken = FirebaseInstanceId.getInstance().getToken();
            Log.d(TAG, "fcm token: " + FCMToken);
            successCallback.invoke(FCMToken);
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }
}

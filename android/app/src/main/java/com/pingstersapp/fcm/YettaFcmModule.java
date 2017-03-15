package com.pingstersapp.fcm;

/**
 * Created by jeyoungchan on 3/15/17.
 */

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;
import java.util.Set;

import javax.annotation.Nullable;

public class YettaFcmModule extends ReactContextBaseJavaModule {
    public YettaFcmModule(ReactApplicationContext reactContext) {
        super(reactContext);
        registerMessageHandler();
    }

    @Override
    public String getName() {
        return "YettaFcm";
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

    private void registerMessageHandler() {
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
}

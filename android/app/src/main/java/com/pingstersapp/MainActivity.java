package com.pingstersapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nullable;

import static android.content.ContentValues.TAG;

public class MainActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // If a notification message is tapped, any data accompanying the notification
        // message is available in the intent extras. In this sample the launcher
        // intent is fired when the notification is tapped, so any accompanying data would
        // be handled here. If you want a different intent fired, set the click_action
        // field of the notification message to the desired intent. The launcher intent
        // is used when no click_action is specified.
        //
        // Handle possible data accompanying notification message.
        // [START handle_data_extras]
        WritableMap params = Arguments.createMap();
        if (getIntent().getExtras() != null) {
            for (String key : getIntent().getExtras().keySet()) {
                String value = getIntent().getExtras().get(key).toString();
                Log.d(TAG, "on create Key: " + key + " Value: " + value);
                params.putString(key, value);
            }
        }
        // [END handle_data_extras]

        final Intent message = getIntent();

        IntentFilter intentFilter = new IntentFilter("com.pingstersapp.fcm.ReceiveNotificationKilled");
        registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                Intent i = new Intent("com.pingstersapp.fcm.ReceiveNotificationBackgroundedOrKilled");
                i.putExtra("message", message);
                sendOrderedBroadcast(i, null);
            }
        }, intentFilter);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "pingstersApp";
    }

    @Override
    public void onNewIntent (Intent intent) {
        super.onNewIntent(intent);

        if (getIntent().getExtras() != null) {
            for (String key : getIntent().getExtras().keySet()) {
                String value = getIntent().getExtras().get(key).toString();
                Log.d(TAG, "background Key: " + key + " Value: " + value);
            }
        }
        Intent i = new Intent("com.pingstersapp.fcm.ReceiveNotificationBackgroundedOrKilled");
        i.putExtra("message", getIntent()); // todo: change getIntent() to appropriate
        sendOrderedBroadcast(i, null);
        setIntent(intent);
    }
}

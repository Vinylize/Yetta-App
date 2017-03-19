package com.pingstersapp.fcm;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import static android.content.ContentValues.TAG;

/**
 * Created by jeyoungchan on 3/19/17.
 */

public class YettaSystemBootEventReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Intent message = intent.getParcelableExtra("message");
        Intent i = new Intent("com.pingstersapp.fcm.ReceiveNotificationBackgroundedOrKilled");
        i.putExtra("message", message);
        context.sendOrderedBroadcast(i, null);
    }
}

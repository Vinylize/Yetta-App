package com.pingstersapp.VinylMap;

/**
 * Created by jeyoungchan on 2/10/17.
 */
import android.os.Bundle;
import android.os.Looper;
import android.support.v4.app.FragmentActivity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.content.res.ColorStateList;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Point;
import android.graphics.PorterDuff;
import android.os.Build;
import android.os.Handler;
import android.support.v4.view.GestureDetectorCompat;
import android.support.v4.view.MotionEventCompat;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.ScaleGestureDetector;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.devsupport.DoubleTapReloadRecognizer;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.GoogleMapOptions;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.RunnableFuture;

public class VinylMapModule extends MapView implements OnMapReadyCallback {
    public static GoogleMap mMap;
    private final VinylMapManager manager;
    private static ThemedReactContext context;
    private static Handler mainHandler;

    public VinylMapModule(ThemedReactContext reactContext, Context appContext, VinylMapManager manager,
                      GoogleMapOptions googleMapOptions) {
        super(appContext, googleMapOptions);

        this.manager = manager;
        this.context = reactContext;

        super.onCreate(null);
        super.onResume();
        super.getMapAsync(this);
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        this.mMap = googleMap;
        // Add a marker in Sydney, Australia, and move the camera.
        LatLng sydney = new LatLng(-34, 151);
        this.mMap.addMarker(new MarkerOptions().position(sydney).title("Marker in Sydney"));
        this.mMap.moveCamera(CameraUpdateFactory.newLatLng(sydney));
    }

    public void animateToLocationHelper(String latitude, String longitude) {
        this.mMap.animateCamera(CameraUpdateFactory.newLatLng(
                new LatLng(Double.parseDouble(latitude), Double.parseDouble(longitude))
        ));
    }

    public void animateToLocation(final String latitude, final String longitude) {
        if (mMap != null) {
            // todo: this may have performance issues
            Handler uiHandler = new Handler(Looper.getMainLooper());
            Runnable runnable = new Runnable() {
                @Override
                public void run() {
                    animateToLocationHelper(latitude, longitude);
                }
            };
            uiHandler.post(runnable);
        }
    }
}
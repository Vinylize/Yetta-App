package com.pingstersapp.VinylMap;

/**
 * Created by jeyoungchan on 2/10/17.
 */

import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.os.Looper;
import android.content.Context;
import android.graphics.Bitmap;
import android.os.Handler;

import com.facebook.react.bridge.Arguments;
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
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.pingstersapp.R;
import com.pingstersapp.VinylMap.latlnginterpolation.LatLngInterpolator;
import com.pingstersapp.VinylMap.latlnginterpolation.MarkerAnimation;

import java.util.HashMap;
import java.util.Map;

public class VinylMapModule extends MapView implements OnMapReadyCallback {
    public static GoogleMap mMap;
    private final VinylMapManager manager;
    private final ThemedReactContext context;
    private Marker marker; // todo: remove this
    private final Map<Marker, String> markerMap = new HashMap<>();

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

        marker = this.mMap.addMarker(new MarkerOptions()
                .position(sydney)
                .title("Marker in Sydney")
                .icon(BitmapDescriptorFactory.fromBitmap(getMarkerBitmap())));

        this.mMap.moveCamera(CameraUpdateFactory.newLatLng(sydney));

        this.mMap.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
            @Override
            public boolean onMarkerClick(Marker marker) {
                WritableMap event = Arguments.createMap();
                // String _marker_id = markerMap.get(marker);
                event.putString("id", "marker clicked!");
                manager.sendEvent(context, "onMarkerPress", event);
                return false;
            }
        });
    }

    private Bitmap getMarkerBitmap() {
        Bitmap markerBitmap = Bitmap.createBitmap(100, 100, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(markerBitmap);
        // todo: resolve the issue: getDrawable is deprecated
        Drawable shape = getResources().getDrawable(R.drawable.shape_marker);
        shape.setBounds(0, 0, markerBitmap.getWidth(), markerBitmap.getHeight());
        shape.draw(canvas);
        return markerBitmap;
    }

    public void animateToLocationHelper(final String latitude, final String longitude) {
        this.mMap.animateCamera(CameraUpdateFactory.newLatLng(
            new LatLng(Double.parseDouble(latitude), Double.parseDouble(longitude))
        ));
    }

    public void updateMarkerHelper(final String latitude, final String longitude) {
        if (marker != null) {
            LatLng tmp = new LatLng(Double.parseDouble(latitude), Double.parseDouble(longitude));
            LatLngInterpolator latLngInterpolator = new LatLngInterpolator.Linear();
            MarkerAnimation.animateMarkerToGB(marker, tmp, latLngInterpolator);
        }
    }

    public void animateToLocation(final String latitude, final String longitude) {
        if (mMap != null) {
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

    public void updateMarker(final String latitude, final String longitude) {
        if (mMap != null) {
            Handler uiHandler = new Handler(Looper.getMainLooper());
            Runnable runnable = new Runnable() {
                @Override
                public void run() {
                    updateMarkerHelper(latitude, longitude);
                }
            };
            uiHandler.post(runnable);
        }
    }
}

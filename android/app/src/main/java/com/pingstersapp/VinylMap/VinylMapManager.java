package com.pingstersapp.VinylMap;

/**
 * Created by jeyoungchan on 2/11/17.
 */

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.google.android.gms.maps.GoogleMapOptions;
import com.google.android.gms.maps.MapsInitializer;

import javax.annotation.Nullable;

public class VinylMapManager extends ViewGroupManager<VinylMapModule> {

    private static final String REACT_CLASS = "VinylMapManager";

    private ReactContext reactContext;

    private final ReactApplicationContext appContext;

    public static VinylMapModule _vinylMapModule;

    protected GoogleMapOptions googleMapOtions;

    public VinylMapManager(ReactApplicationContext context) {
        this.appContext = context;
        this.googleMapOtions = new GoogleMapOptions();
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected VinylMapModule createViewInstance(ThemedReactContext context) {
        reactContext = context;

        try {
            MapsInitializer.initialize(this.appContext);
        } catch (RuntimeException e) {
            e.printStackTrace();
            emitMapError("Map initialize error", "map_init_error");
        }
        this._vinylMapModule = new VinylMapModule(context, this.appContext.getCurrentActivity(), this, this.googleMapOtions);
        return this._vinylMapModule;
    }

    private void emitMapError(String message, String type) {
        WritableMap error = Arguments.createMap();
        error.putString("message", message);
        error.putString("type", type);

        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onError", error);
    }

    @ReactMethod
    public void animateToLocation(final String latitude, final String longitude) {
        if (this._vinylMapModule != null) {
            this._vinylMapModule.animateToLocation(latitude, longitude);
        }
    }

    @ReactMethod
    public void animateToLocationWithZoom(final String latitude, final String longitude, final float zoom) {
        if (this._vinylMapModule != null) {
            this._vinylMapModule.animateTolocationWithZoom(latitude, longitude, zoom);
        }
    }

    @ReactMethod
    public void updateMarker(final String latitude, final String longitude) {
        if (this._vinylMapModule != null) {
            this._vinylMapModule.updateMarker(latitude, longitude);
        }
    }

    @ReactMethod
    public void fitToCoordinates(ReadableArray coordinatesArray, ReadableMap edgePadding, boolean animated) {
        if (this._vinylMapModule != null) {
            this._vinylMapModule.fitToCoordinates(coordinatesArray, edgePadding, animated);
        }
    }

        public void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}

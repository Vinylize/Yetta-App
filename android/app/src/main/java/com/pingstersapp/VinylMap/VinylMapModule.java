package com.pingstersapp.VinylMap;

/**
 * Created by jeyoungchan on 2/10/17.
 */

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class VinylMapModule extends ReactContextBaseJavaModule {
    public VinylMapModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "VinylMap";
    }
}

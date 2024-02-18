package com.eseba;

import android.content.Intent;
import android.os.Parcelable;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class CCAvenueBridgeModule extends ReactContextBaseJavaModule {

    private static  ReactApplicationContext reactApplicationContext;
    public CCAvenueBridgeModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        reactApplicationContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "CCAvenueBridgeModule";
    }

    @ReactMethod
    public void openWebView(String paymentURL, Callback cb) {
        try {
            Intent intent = new Intent(reactApplicationContext, CCAvenueWebview.class);
            intent.putExtra("PAYMENT_URL", paymentURL);
            getCurrentActivity().startActivityForResult(intent, 1);
        } catch (Exception e) {
            cb.invoke(e, null);
        }
    }

    public static void sendEvent(   String eventName,
                          @Nullable WritableMap params) {
        reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }





}



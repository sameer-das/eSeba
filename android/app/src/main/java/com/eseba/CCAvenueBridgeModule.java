package com.eseba;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.os.Bundle;
import android.os.Parcelable;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.facebook.common.activitylistener.ActivityListener;
import com.facebook.common.activitylistener.BaseActivityListener;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import android.util.Log;
public class CCAvenueBridgeModule extends ReactContextBaseJavaModule {

    private static  ReactApplicationContext reactApplicationContext;
    private static final int REQUEST_CODE_FOR_DEVICE_INFO = 10001;
    private static final int REQUEST_CODE_FOR_CAPTURE = 10002;
    private Promise resultPromise;

    public CCAvenueBridgeModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        reactApplicationContext = reactContext;
        reactApplicationContext.addActivityEventListener(activityListener);
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



    @ReactMethod
    public void getDeviceInfo(Promise promise) {
        Log.d("Morpho", "In getDeviceInfo");
        resultPromise = promise;
        Activity activity = getCurrentActivity();
        try {
            Intent intent = new Intent("in.gov.uidai.rdservice.fp.INFO");
            intent.setPackage("com.scl.rdservice");
            activity.startActivityForResult(intent, REQUEST_CODE_FOR_DEVICE_INFO);
        } catch (ActivityNotFoundException ex) {
            Log.d("Morpho", "Exception found in getDeviceInfo");
            Log.d("Morpho", ex.getMessage());
            resultPromise.reject("INTENT_NOT_FOUND", ex.getMessage());
        }
    };



    @ReactMethod
    public void capture(String PID_OPTIONS, Promise promise) {
        Log.d("Morpho", "PID_OPTIONS -> " + PID_OPTIONS);
        resultPromise = promise;
        Activity activity = getCurrentActivity();
        try{
            Intent intent = new Intent("in.gov.uidai.rdservice.fp.CAPTURE");
            intent.setPackage("com.scl.rdservice");
            intent.putExtra("PID_OPTIONS", PID_OPTIONS);
            activity.startActivityForResult(intent, REQUEST_CODE_FOR_CAPTURE);
        } catch (ActivityNotFoundException ex) {
            Log.d("Morpho", "Exception found in capture");
            Log.d("Morpho", ex.getMessage());
            resultPromise.reject("INTENT_NOT_FOUND", ex.getMessage());
        }
    };



    // Listening for result from NewActivity
    private final ActivityEventListener activityListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, @Nullable Intent data) {
            Log.d("Morpho", "In onActivityResult");
            Log.d("Morpho", "Request Code -> " + String.valueOf(requestCode));

            //    FOR DEVICE INFO
            if(requestCode == REQUEST_CODE_FOR_DEVICE_INFO) {
                if (resultPromise != null) {
                    if(resultCode == Activity.RESULT_OK) {
                        Bundle b = data.getExtras();
                        if (b != null) {
                            // you will get finger print device Info
                            String deviceInfo = b.getString("DEVICE_INFO", "");
                            // you will get RD service Info
                            String rdServiceInfo = b.getString("RD_SERVICE_INFO", "");
                            // you will get value in this variable when your finger print device not connected
                            String dnc = b.getString("DNC", "");
                            // you will get value in this variable when your finger print device not registered.
                            String dnr = b.getString("DNR", "");

                            Log.d("Morpho", "deviceInfo -> " + deviceInfo);
                            Log.d("Morpho", "rdServiceInfo -> " + rdServiceInfo);
                            Log.d("Morpho", "dnc -> " + dnc);
                            Log.d("Morpho", "dnr -> " + dnr);

                            if(!dnc.isEmpty()){
                                Log.d("Morpho", "DNC is not empty -> " + dnc);
                                resultPromise.reject("DNC", "Device not connected.");
                            } else if(!dnr.isEmpty()) {
                                Log.d("Morpho", "DNR is not empty -> " + dnr);
                                resultPromise.reject("DNR", "Device not registered.");
                            } else {
                                Log.d("Morpho", "ELSE Condition");
                                resultPromise.resolve(deviceInfo);
                            }

                        } else {
                            resultPromise.reject("ERROR", "Bundle Null");
                        }
                    }
                } else {
                    resultPromise.reject("ERROR", "No result returned from native app.");
                }
            }



            //    FOR CAPTURE
            if(requestCode == REQUEST_CODE_FOR_CAPTURE) {
                if (resultPromise != null) {
                    if(resultCode == Activity.RESULT_OK) {
                        Bundle b = data.getExtras();
                        if (b != null) {
                            // in this varaible you will get Pid data
                            String pidData = b.getString("PID_DATA", "");
                            // you will get value in this variable when your finger print device not connected
                            String dnc = b.getString("DNC", "");
                            // you will get value in this variable when your finger print device not registered.
                            String dnr = b.getString("DNR", "");
                            Log.d("Morpho", "pidData -> " + pidData);
                            Log.d("Morpho", "dnc -> " + dnc);
                            Log.d("Morpho", "dnr -> " + dnr);

                            if(!dnc.isEmpty()){
                                Log.d("Morpho", "DNC is not empty -> " + dnc);
                                resultPromise.reject("DNC", "Device not connected.");
                            } else if(!dnr.isEmpty()) {
                                Log.d("Morpho", "DNR is not empty -> " + dnr);
                                resultPromise.reject("DNR", "Device not registered.");
                            } else {
                                Log.d("Morpho", "ELSE Condition");
                                resultPromise.resolve(pidData);
                            }

                        } else {
                            resultPromise.reject("ERROR", "Bundle Null");
                        }
                    }
                } else {
                    resultPromise.reject("ERROR", "No result returned from native app.");
                }
            }
        }
    };
}



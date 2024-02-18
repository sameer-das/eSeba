package com.eseba;

import android.content.Context;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

@SuppressWarnings("unused")
class MyJavaScriptInterface{
    CCAvenueWebview mContext;
 /** Instantiate the interface and set the context. */
 MyJavaScriptInterface(CCAvenueWebview c) {
  mContext = c;
 }

 @JavascriptInterface
  public void processHTML(String message){
    // process the html as needed by the app
     WritableMap params = Arguments.createMap();
     params.putString("eventProperty", "move_to_top");
     CCAvenueBridgeModule.sendEvent("EventReminder", params );
     mContext.Finish();
  }
}
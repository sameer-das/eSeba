package com.eseba;

import androidx.appcompat.app.AppCompatActivity;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class CCAvenueWebview extends AppCompatActivity {
    WebView webview;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
//        System.out.println("---> inside CCAvenueWebview onCreate");
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ccavenue_webview);

        Intent intent = getIntent();
        String payURL  = intent.getStringExtra("PAYMENT_URL");

        webview = (WebView) findViewById(R.id.webview);
        webview.getSettings().setJavaScriptEnabled(true);
        webview.loadUrl(payURL);
        webview.addJavascriptInterface(new MyJavaScriptInterface(this), "Android");
        webview.setWebViewClient(new WebViewClient(){
            @Override
            public void onPageFinished(WebView view, String url) {
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {

//
                Log.e("--> description " , description);
                Log.e("--> errorCode " , String.valueOf(errorCode));
                Log.e("--> failingUrl " , failingUrl);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                try {
                    Intent intent;
                    if (url.contains("upi://pay?pa")) {
                        intent = new Intent(Intent.ACTION_VIEW);
                        intent.setData(Uri.parse(url));
                        startActivity(intent);
                        return true;
                    }
                } catch (ActivityNotFoundException e) {
                    view.stopLoading();
                    Toast.makeText(getApplicationContext(), "UPI supported applications not found", Toast.LENGTH_LONG).show();
                    view.loadUrl("javascript:(function() { document.getElementsByClassName(\"intent-off\")[0].click();})()");
                }
                return super.shouldOverrideUrlLoading(view, url);
            }
        });
    }

    protected void Finish() {
        finish();
    }

}


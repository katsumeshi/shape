package com.yukimatsushita.shape.config

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import android.widget.Toast
import com.yukimatsushita.shape.BuildConfig


/**
 * Created by katsumeshi on 7/26/19.
 */
class ConfigModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        private val DEBUG_KEY = "DEBUG"
    }

    override fun getName(): String {
        return "Config"
    }

    override fun getConstants(): MutableMap<String, Any> {
        val constants = mutableMapOf<String, Any>()
        constants[DEBUG_KEY] = BuildConfig.DEBUG
        return constants
    }
}
package com.yukimatsushita.shape.config

/**
 * Created by katsumeshi on 7/26/19.
 */

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.toast.ToastModule
import com.facebook.react.uimanager.ViewManager
import com.google.android.gms.common.util.CollectionUtils.listOf

import java.util.ArrayList
import java.util.Collections

class ConfigPackage : ReactPackage {

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return listOf()
    }

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val modules = ArrayList<NativeModule>()

        modules.add(ConfigModule(reactContext))

        return modules
    }

}
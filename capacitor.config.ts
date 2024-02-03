import {CapacitorConfig} from '@capacitor/cli';


const config: CapacitorConfig = {
    appId: 'dev.misha98857.react',
    appName: 'Справочник фронтендера',
    bundledWebRuntime: false,
    webDir: 'www',
    cordova: {},
    plugins: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SplashScreen: {
            launchShowDuration: 3000,
            launchAutoHide: false,
            backgroundColor: '#ffffffff',
            androidSplashResourceName: 'splash',
            androidScaleType: 'CENTER_CROP',
            showSpinner: false,
            splashFullScreen: false,
            splashImmersive: false,
        }
    }
};


export default config;

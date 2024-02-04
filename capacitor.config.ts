import { CapacitorConfig } from '@capacitor/cli';


const config: CapacitorConfig = {
  appId: 'dev.misha98857.react',
  appName: 'React handbook',
  webDir: 'www',
  cordova: {},
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: false,
      backgroundColor: '#ffffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: false,
      splashImmersive: false,
    },
  },
};


export default config;

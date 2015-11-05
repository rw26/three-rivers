// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'net.lrw.threerivers',
  name: 'Three Rivers App 3',
  description: 'Get River Guage Display',
  author: 'randy Wright',
  email: 'rw26@lrw.net',
  website: 'http://lrw.net'
});

// Set up resources such as icons and launch screens.
App.icons({
  'iphone': 'icons/lrw-icon.png',
  'iphone_2x': 'icons/lrw-icon.png',
  'android_ldpi' : 'icons/lrw-icon.png',
  'android_mdpi' : 'icons/lrw-icon.png',
  'android_hdpi' : 'icons/lrw-icon.png',
  'android_xhdpi' : 'icons/lrw-icon.png'
  // ... more screen sizes and platforms ...
});

App.launchScreens({
//  'iphone': 'splash/Default~iphone.png',
//  'iphone_2x': 'splash/Default@2x~iphone.png',
//pgh-320x426.jpg  pgh-320x470.jpg  pgh-426x320.jpg  pgh-470x320.jpg  pgh-480x640.jpg  pgh-640x480.jpg  pgh-720x960.jpg  pgh-960x720.jpg
  'android_ldpi_portrait' : 'splash/pgh-320x426.jpg',
  'android_ldpi_landscape' : 'splash/pgh-426x320.jpg',
  'android_mdpi_portrait' : 'splash/pgh-320x470.jpg',
  'android_mdpi_landscape' : 'splash/pgh-470x320.jpg',
  'android_hdpi_portrait' : 'splash/pgh-480x640.jpg',
  'android_hdpi_landscape' : 'splash/pgh-640x480.jpg',
  'android_xhdpi_portrait' : 'splash/pgh-720x960.jpg',
  'android_xhdpi_landscape' : 'splash/pgh-960x720.jpg'
  // ... more screen sizes and platforms ...
});

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);

// Pass preferences for a particular PhoneGap/Cordova plugin
//App.configurePlugin('com.phonegap.plugins.facebookconnect', {
//  APP_ID: '1234567890',
//  API_KEY: 'supersecretapikey'
//});

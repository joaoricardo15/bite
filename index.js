/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

import PushNotification, {Importance} from 'react-native-push-notification';
import '@react-native-firebase/messaging';

PushNotification.createChannel(
  {
    channelId: 'default-channel-id', // (required)
    channelName: 'Default channel', // (required)
    channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

PushNotification.configure({
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    // console.log('### NOTIFICATION ###', notification);

    const {
      id,
      finish,
      data: {title, subText, message, bigText, imageUrl, largeIconUrl},
    } = notification;

    PushNotification.localNotification({
      /* General properties */
      // id?: string | number | undefined;
      title,
      message,
      picture: imageUrl,
      userInfo: {},
      playSound: true,
      soundName: 'default',
      // number?: string | number | undefined;
      // repeatType?: 'week' | 'day' | 'hour' | 'minute' | 'time' | undefined;
      // repeatTime?: number | undefined;

      // /* Android Only Properties */
      // ticker?: string | undefined;
      showWhen: false, //?: boolean | undefined;
      // autoCancel?: boolean | undefined;
      largeIcon: '', //?: string | undefined;
      largeIconUrl: imageUrl || largeIconUrl, //string | undefined;
      smallIcon: 'ic_push',
      bigText,
      subText,
      bigPictureUrl: imageUrl,
      // bigLargeIcon?: string | undefined;
      // bigLargeIconUrl?: string | undefined;
      // color: 'red', // (optional) default: system default
      vibrate: true,
      // vibration?: number | undefined;
      // tag?: string | undefined;
      // group?: string | undefined;
      // groupSummary?: boolean | undefined;
      ongoing: false,
      priority: 'max', // 'max' | 'high' | 'low' | 'min' | 'default' | undefined;
      visibility: 'private', // 'private' | 'public' | 'secret' | undefined;
      importance: 'high', // 'default' | 'max' | 'high' | 'low' | 'min' | 'none' | 'unspecified' | undefined;
      ignoreInForeground: false,
      // shortcutId?: string | undefined;
      channelId: 'default-channel-id',
      onlyAlertOnce: false,
      allowWhileIdle: true,
      // timeoutAfter?: number | null | undefined;
      messageId: id, //?: string | undefined;
      when: Date.now(),
      usesChronometer: false,
      // actions?: string[] | undefined;
      invokeApp: false,

      /* iOS only properties */
      category: '',
      // subtitle: '', // (optional) smaller title below notification title
    });

    finish && finish();
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log('### ACTION ###');
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
});

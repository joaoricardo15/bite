/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

import PushNotification, {Importance} from 'react-native-push-notification';
import '@react-native-firebase/messaging';
import Axios from 'axios';

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

const pushDefaultConfig = {
  playSound: true,
  soundName: 'default',
  showWhen: false,
  largeIcon: '',
  smallIcon: 'ic_push',
  vibrate: true,
  priority: 'max', // 'max' | 'high' | 'low' | 'min' | 'default' | undefined;
  visibility: 'public', // 'private' | 'public' | 'secret' | undefined;
  importance: 'high', // 'default' | 'max' | 'high' | 'low' | 'min' | 'none' | 'unspecified' | undefined;
  ignoreInForeground: false,
  channelId: 'default-channel-id',
  onlyAlertOnce: false,
  allowWhileIdle: true,
  autoCancel: false,
  invokeApp: false,
  ongoing: true,
  // userInfo: {},
  // number?: string | number | undefined;
  // repeatType?: 'week' | 'day' | 'hour' | 'minute' | 'time' | undefined;
  // repeatTime?: number | undefined;

  // /* Android Only Properties */
  // ticker?: string | undefined;
  // bigPictureUrl: imageUrl,
  // bigLargeIcon?: string | undefined;
  // bigLargeIconUrl?: string | undefined;
  // color: 'red', // (optional) default: system default
  // vibration?: number | undefined;
  // tag?: string | undefined;
  // group?: string | undefined;
  // groupSummary?: boolean | undefined;
  // shortcutId?: string | undefined;
  // timeoutAfter?: number | null | undefined;
  // messageId: id,

  /* iOS only properties */
  // category: '',
  // subtitle: '', // (optional) smaller title below notification title
};

PushNotification.configure({
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    const {
      finish,
      data: {
        id,
        title,
        subText,
        message,
        bigText,
        imageUrl,
        largeIconUrl,
        actions,
      },
    } = notification;

    const instractActions = actionsString => {
      return !actionsString
        ? undefined
        : actionsString.split('::').map(action => action);
    };

    PushNotification.localNotification({
      /* General properties */
      ...pushDefaultConfig,
      id,
      title,
      message,
      picture: imageUrl,
      largeIconUrl,
      bigText,
      subText,
      actions: instractActions(actions),
    });

    finish && finish();
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log('### ACTION ### ', notification);

    const {action, id, subText} = notification;

    if (action === 'Hoje não') {
      PushNotification.localNotification({
        id,
        subText,
        ...pushDefaultConfig,
        timeoutAfter: 500,
        title: '😓 Fica pra próxima',
        message: 'Amanhã tem denovo!',
      });
    } else if (action === 'Começar') {
      const startPicture =
        'https://www.skinnyrunner.com/wp-content/uploads/2018/08/How-To-Start-Running.jpg';

      PushNotification.localNotification({
        id,
        subText,
        ...pushDefaultConfig,
        title: 'Bora!',
        message: 'Senti firmeza.',
        when: Date.now(),
        usesChronometer: true,
        picture: startPicture,
        bigPictureUrl: startPicture,
        actions: ['Terminar'],
      });
    } else if (action === 'Terminar') {
      const finishPicture =
        'https://www.billboard.com/wp-content/uploads/media/victory-2017-billboard-1548.jpg';

      PushNotification.localNotification({
        id,
        subText,
        ...pushDefaultConfig,
        timeoutAfter: 500,
        title: 'Boooooooa 👏👏👏👏👏👏👏',
        message: 'Parabêns, teu esforço vai valer a pela!',
        picture: finishPicture,
        bigPictureUrl: finishPicture,
      });
    }

    Axios.post(
      'https://uwakrljbi2.execute-api.eu-central-1.amazonaws.com/dev/user/activity',
      notification,
    );
  },

  onRegistrationError: function (error) {
    console.log('### ERROR ###', error);
  },

  onRemoteFetch: function (error) {
    console.log('### ERROR ###', error);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
});

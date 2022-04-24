/**
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform,
} from 'react-native';

import Axios from 'axios';
import firebase from '@react-native-firebase/app';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import userStore from './src/services/userStore';

import Auth0 from 'react-native-auth0';
const auth0 = new Auth0({
  domain: 'dev-yc4pbydg.us.auth0.com',
  clientId: '7epbPhQU87v8oAtyVQarMOSQcsoRD4Et',
});

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle]}>{title}</Text>
      <Text style={[styles.sectionDescription]}>{children}</Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [notification, setNotification] = useState<any>(null);
  const getToken = () => {
    firebase
      .messaging()
      .getToken()
      .then(token => {
        console.log('TOKEN --> ', token);
        userStore.getUser().then(user => {
          console.log('USER --> ', user);
          const {sub: userId} = user;
          Axios.post(
            `https://uwakrljbi2.execute-api.eu-central-1.amazonaws.com/dev/user/${userId}/token`,
            {user, token},
          );
        });
      })
      .catch(e => console.log('# ERROR #', e));
  };
  const registerForRemoteMessages = () => {
    firebase
      .messaging()
      .registerDeviceForRemoteMessages()
      .then(() => {
        requestPermissions();
      });
  };

  const requestPermissions = () => {
    firebase
      .messaging()
      .requestPermission()
      .then((status: FirebaseMessagingTypes.AuthorizationStatus) => {
        if (status === FirebaseMessagingTypes.AuthorizationStatus.AUTHORIZED) {
          onMessage();
        }
      });
  };

  const onMessage = () => {
    firebase.messaging().onMessage(response => {
      console.log('ON_MESSAGE --> ', response);
      setNotification(response.data);
    });
    firebase.messaging().setBackgroundMessageHandler(async response => {
      console.log('ON_BACKGROUND_MESSAGE -->', response);
      setNotification(response.data);
    });
    firebase.messaging().onNotificationOpenedApp(response => {
      console.log('ON_NOTIFICATION_OPEN -->', response);
      setNotification(response.data);
    });
    firebase
      .messaging()
      .getInitialNotification()
      .then(async response => {
        console.log('INITIAL_NOTIFICATIONS -->', response);
        response?.data && setNotification(response.data);
      });
  };

  const pushSetup = () => {
    getToken();
    if (Platform.OS === 'ios') {
      registerForRemoteMessages();
    } else {
      onMessage();
    }
  };

  useEffect(() => {
    userStore
      .getToken()
      .then(token => {
        console.log('### INITIAL_ACCESS_TOKEN ###', token);
        if (!token) {
          auth0.webAuth
            .authorize({scope: 'openid profile email'})
            .then((credentials: {accessToken: string}) => {
              console.log('### ACCESS_TOKEN ###', credentials.accessToken);
              userStore.setToken(credentials.accessToken);
              auth0.auth
                .userInfo({token: credentials.accessToken})
                .then((data: any) => {
                  console.log('### USER_INFO ###', data);
                  userStore.setUser(data);
                  pushSetup();
                })
                .catch((e: any) => console.log('# ERROR #', e));
            })
            .catch((e: any) => console.log('# ERROR #', e));
        }
        pushSetup();
      })
      .catch(e => console.log('# ERROR #', e));
  }, []);

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          {!notification ? (
            <Section title="Enjoy your bite!" />
          ) : (
            <View>
              {notification.imageUrl && (
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: notification.imageUrl,
                    }}
                  />
                </View>
              )}
              <Section title={notification.title}>
                <Text style={styles.message}>{notification.message}</Text>
              </Section>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  title: {
    textAlign: 'center',
    padding: '10px',
  },
  imageContainer: {
    flexDirection: 'row',
  },
  image: {
    resizeMode: 'contain',
    flex: 1,
    aspectRatio: 1, // Your aspect ratio
  },
  message: {},
});

export default App;

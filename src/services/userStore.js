import AsyncStorage from '@react-native-async-storage/async-storage';

const setToken = async value => {
  try {
    await AsyncStorage.setItem('@token', value);
  } catch (e) {
    throw e;
  }
};

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('@token');
    return token;
  } catch (e) {
    throw e;
  }
};

const setUser = async value => {
  try {
    const user = JSON.stringify(value);
    await AsyncStorage.setItem('@user', user);
  } catch (e) {
    throw e;
  }
};

const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem('@user');
    return JSON.parse(user);
  } catch (e) {
    throw e;
  }
};

export default {
  setToken,
  setUser,
  getToken,
  getUser,
};

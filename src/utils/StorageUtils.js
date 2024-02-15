/** async storage */
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// get data
export const getDeviceData = async (key) => {
    try {
        const storageData = await AsyncStorage.getItem(key);
        return storageData != null ? JSON.parse(storageData) : {};
    } catch (err) {
        console.log(`Device Data Load Error :: ${err}`);
    }
};

getDeviceData.propTypes = {
    key: PropTypes.any.isRequired,
};

// set data
export const setDeviceData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (err) {
        console.log(`Device Data Save Error :: ${err}`);
    }
};

setDeviceData.propTypes = {
    key: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

// change data
export const changeDeviceData = async (key, changeObj) => {
    if (changeObj && Object.keys(changeObj).length > 0) {
        const data = await getDeviceData(key);
        Object.keys(changeObj).map((change) => {
            data[change] = changeObj[change];
        });

        await setDeviceData(key, JSON.stringify(data));
    }
};

changeDeviceData.propTypes = {
    key: PropTypes.string.isRequired,
    changeObj: PropTypes.object.isRequired,
};

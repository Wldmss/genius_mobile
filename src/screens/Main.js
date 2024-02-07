import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Authentication from 'expo-local-authentication';
import LoginLayout from '@components/LoginLayout';
import store from '@store/store';
import { dispatchMultiple } from '@utils/Utils';

const Main = ({ navigation }) => {
    const [tab, setTab] = useState(null);

    const storeStorageData = async () => {
        try {
            const genius = { pin: '123456', bio: true, users: { username: 91352089, password: 'a91352089!' } };
            await AsyncStorage.setItem('genius', JSON.stringify(genius));
            // await AsyncStorage.removeItem('genius');
        } catch (err) {
            console.log(err);
        }
    };

    // async store data
    const getStorageData = async () => {
        const storageData = await AsyncStorage.getItem('genius');
        const data = JSON.parse(storageData);
        console.log(data);
        const keys = data != null ? Object.keys(data) : {};

        let bio = { isRegistered: false, modFlag: false };
        let pin = { isRegistered: false, value: '', modFlag: false };
        let users = null;
        let tabValue = 'LDAP';

        if (keys.length > 0) {
            const hasBio = keys.length > 0 && data['bio'] ? true : false;
            bio.isRegistered = hasBio;
            bio.modFlag = false;

            const pinValue = keys.length > 0 && data['pin'] ? data['pin'] : null;
            const hasPin = pinValue != null;
            pin.isRegistered = hasPin;
            pin.value = pinValue;
            pin.modFlag = false;

            users = keys.length > 0 && data['users'] ? data['users'] : null;

            tabValue = hasBio ? 'BIO' : hasPin ? 'PIN' : 'LDAP';
        }

        setStoreData({
            SET_PIN: pin,
            SET_BIO: bio,
            SET_USERS: users,
            SET_TAB: tabValue,
        });

        setTab(tabValue);
    };

    // bio check
    const checkBioSupported = async () => {
        let bioSupported = false;

        // 단말 생체인증 지원 여부 확인
        const isSupported = await Authentication.hasHardwareAsync();

        if (isSupported) {
            const biometryType = await Authentication.supportedAuthenticationTypesAsync();
            bioSupported = biometryType.includes(1) || biometryType.includes(2);
        } else {
            bioSupported = false;
        }

        // 단말 생체인증 등록 여부 확인
        const biometricRecords = bioSupported && (await Authentication.isEnrolledAsync());

        setStoreData({
            SET_BIO_SUPPORTED: bioSupported,
            SET_BIO_RECORDS: biometricRecords,
        });
    };

    // store 값 저장
    const setStoreData = (data) => {
        store.dispatch(dispatchMultiple(data));
    };

    useEffect(() => {
        // storeStorageData();
        checkBioSupported().then(() => {
            getStorageData();
        });
    }, []);

    useEffect(() => {
        if (tab != null) navigation.navigate(tab);
    }, [tab]);

    return <LoginLayout element={<Text style={styles.container}>Loading..</Text>} />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        textAlign: `center`,
    },
});

Main.propTypes = {
    navigation: PropTypes.any.isRequired,
};

export default Main;

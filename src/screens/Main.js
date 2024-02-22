import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, BackHandler, StyleSheet, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Authentication from 'expo-local-authentication';
import LoginLayout from 'components/LoginLayout';
import store from 'store/store';
import { dispatchMultiple, dispatchOne } from 'utils/DispatchUtils';
import * as StorageUtils from 'utils/StorageUtils';
import * as NavigateUtils from 'utils/NavigateUtils';
import { useSelector } from 'react-redux';
import { AES } from 'crypto-js';

/** genius main */
const Main = ({ navigation, route }) => {
    const [tab, setTab] = useState(null);
    const [isLink, setIsLink] = useState(null);
    const [doneBio, setDoneBio] = useState(false);
    const token = useSelector((state) => state.loginReducer.token);

    const storeStorageData = async () => {
        try {
            // const genius = { pin: '123456', bio: false, users: 91352089 };
            // await SecureStore.setItemAsync('genius', JSON.stringify(genius));
            await SecureStore.deleteItemAsync('genius');
            await SecureStore.deleteItemAsync('bio');
            await SecureStore.deleteItemAsync('pin');
            await SecureStore.deleteItemAsync('users');

            // const crypto = AES.encrypt('123343', 'genius').toString();
            // console.log(crypto);
            // await SecureStore.setItemAsync('genius_pin', crypto);
        } catch (err) {
            console.log(err);
        }
    };

    // async store data
    const getStorageData = async () => {
        let bioData = await StorageUtils.getDeviceData('bio');
        let pinData = await StorageUtils.getDeviceData('pin');
        let users = await StorageUtils.getDeviceData('users');

        let bio = { isRegistered: false, modFlag: false };
        let pin = { isRegistered: false, value: '', modFlag: true };

        const hasBio = bioData != null && bioData == 'true';
        bio.isRegistered = hasBio;
        bio.modFlag = false;

        const hasPin = pinData != null;
        pin.isRegistered = hasPin;
        pin.value = pinData;
        pin.modFlag = !hasPin;

        const tabValue = users == null ? 'PIN' : hasBio ? 'BIO' : hasPin ? 'PIN' : 'LDAP';

        const exitFlag = isLink && !hasBio && !hasPin;
        if (exitFlag) closeGenius();

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
        let bioValue = {
            SET_BIO_SUPPORTED: false,
            SET_BIO_RECORDS: false,
        };

        // 단말 생체인증 지원 여부 확인
        const isSupported = await Authentication.hasHardwareAsync();

        if (isSupported) {
            const biometryType = await Authentication.supportedAuthenticationTypesAsync();
            bioValue.SET_BIO_SUPPORTED = biometryType.includes(1) || biometryType.includes(2);
        }

        // 단말 생체인증 등록 여부 확인
        bioValue.SET_BIO_RECORDS = bioValue.SET_BIO_SUPPORTED && (await Authentication.isEnrolledAsync());

        setStoreData(bioValue);
        setDoneBio(true);
    };

    // store 값 저장
    const setStoreData = (data) => {
        store.dispatch(dispatchMultiple(data));
    };

    // 앱 종료
    const closeGenius = () => {
        Alert.alert('GENIUS 종료', '로그인이 되어있지 않습니다.', [
            {
                text: '닫기',
                onPress: () => {
                    BackHandler.exitApp();
                },
            },
        ]);
    };

    useEffect(() => {
        const params = route && route.params ? route.params : {};
        const link = params && Object.keys(params).length > 0 && Object.keys(params).includes('link') && params['link'] == 'true';

        store.dispatch(dispatchOne('SET_LINK', link));
        store.dispatch(dispatchOne('SET_TOKEN', link ? {} : null));

        setIsLink(link);
    }, [route]);

    useEffect(() => {
        if (isLink != null && token == null) {
            setTab(null);
            // storeStorageData();

            if (doneBio) {
                getStorageData();
            } else {
                checkBioSupported().then(() => {
                    getStorageData();
                });
            }
        }
    }, [isLink, token]);

    useEffect(() => {
        if (tab != null) store.dispatch(NavigateUtils.navigateDispatch(tab, navigation));
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
    route: PropTypes.object,
};

export default Main;

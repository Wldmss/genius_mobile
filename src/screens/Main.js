import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, BackHandler, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Authentication from 'expo-local-authentication';
import LoginLayout from 'components/LoginLayout';
import store from 'store/store';
import { dispatchMultiple, dispatchOne } from 'utils/Utils';
import * as StorageUtils from 'utils/StorageUtils';
import * as NavigateUtils from 'utils/NavigateUtils';

/** genius main */
const Main = ({ navigation, route }) => {
    const [tab, setTab] = useState(null);
    const [isLink, setIsLink] = useState(null);

    const storeStorageData = async () => {
        try {
            // const genius = { pin: '123456', bio: false, users: { username: 91352089, password: 'a91352089!' } };
            // await AsyncStorage.setItem('genius', JSON.stringify(genius));
            await AsyncStorage.removeItem('genius');
        } catch (err) {
            console.log(err);
        }
    };

    // async store data
    const getStorageData = async () => {
        const data = await StorageUtils.getDeviceData('genius');
        console.log(data);
        const keys = data != null ? Object.keys(data) : {};

        let bio = { isRegistered: false, modFlag: false };
        let pin = { isRegistered: false, value: '', modFlag: false };
        let users = null;
        let tabValue = 'LDAP';
        let exitFlag = isLink;

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

            if (isLink) exitFlag = !hasBio && !hasPin;
        }

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
        setIsLink(link);
    }, [route]);

    useEffect(() => {
        if (isLink != null) {
            // storeStorageData();
            checkBioSupported().then(() => {
                getStorageData();
            });
        }
    }, [isLink]);

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

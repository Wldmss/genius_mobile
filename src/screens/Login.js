import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import BioLogin from '@components/BioLogin';
import PinLogin from '@components/PinLogin';
import LDAPLogin from '@components/LDAPLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OtherLogin from '@components/OtherLogin';
import store from '@store/store';
import { dispatchMultiple } from '@utils/Utils';

const top_logo = require('/assets/login_top_title.svg');
const genius_logo = require('/assets/genius_logo.png');
const genius_background = require('/assets/genius_login_full_mobile.png');

const Login = ({ navigation }) => {
    const countFail = useRef(0); // 로그인 실패 횟수 count
    const [hasLDAP, setHasLDAP] = useState(false);
    const [pin, setPin] = useState({ isRegistered: false, value: '', modFlag: false });
    const [bio, setBio] = useState({ isRegistered: false, modFlag: false });
    const [tab, setTab] = useState('');

    const sendLogin = (result) => {
        console.log(result);
        if (result) {
            if (tab == 'ldap' && !pin.isRegistered) {
                setTab('pin');
                setPin({ ...pin, modFlag: true });
            } else {
                navigation.navigate('Main');
            }
        } else {
            countFail.current = countFail.current + 1;
        }
    };

    const storeStorageData = async () => {
        try {
            const users = { pin: '123456', bio: true, users: { username: 91352089, password: 'a91352089!' } };
            await AsyncStorage.setItem('users', JSON.stringify(users));
            // await AsyncStorage.removeItem('users');
        } catch (err) {
            console.log(err);
        }
    };

    const getStorageData = async () => {
        const storageData = await AsyncStorage.getItem('users');
        const data = JSON.parse(storageData);
        console.log(data);
        const keys = Object.keys(data);

        const hasBio = keys.length > 0 && data['bio'] ? true : false;
        setBio({ ...bio, isRegistered: hasBio, modFlag: false });

        const pinValue = keys.length > 0 && data['pin'] ? data['pin'] : null;
        const hasPin = pinValue != null;
        setPin({ ...pin, isRegistered: hasPin, value: pinValue, modFlag: false });

        const users = keys.length > 0 && data['users'] ? data['users'] : null;
        setHasLDAP(users != null);

        const tabValue = hasBio ? 'bio' : hasPin ? 'pin' : 'ldap';
        setTab(tabValue);

        setStoreData(pinValue, hasBio, users, tabValue);
    };

    // store 값 저장
    const setStoreData = (pinValue, hasBio, users, tabValue) => {
        store.dispatch(
            dispatchMultiple({
                SET_PIN: pinValue,
                SET_BIO: hasBio,
                SET_USERS: users,
                SET_TAB: tabValue,
            })
        );
    };

    // 로그인 폼
    const loginForm = () => {
        switch (tab) {
            case 'bio':
                return <BioLogin sendLogin={sendLogin} />;
            case 'pin':
                return <PinLogin sendLogin={sendLogin} pin={pin} />;
            default:
                return <LDAPLogin sendLogin={sendLogin} />;
        }
    };

    // 다른 로그인 선택
    const otherLoginForm = () => {
        return hasLDAP && pin.isRegistered && <OtherLogin hasLDAP={hasLDAP} bio={bio} pin={pin} tab={tab} />;
    };

    const handleTab = (value, modify) => {
        setTab(value);
    };

    useEffect(() => {
        countFail.current = 0;
        // storeStorageData();
        getStorageData();
    }, []);

    useEffect(() => {
        if (countFail.current >= 5) {
            Alert.alert('로그인 실패');
            console.log('로그인 실패');
        }
    }, [countFail.current]);

    return (
        <View style={styles.container}>
            <ImageBackground source={genius_background} style={styles.loginBackground}>
                <Image source={top_logo} style={styles.title} resizeMode="contain" />
                <View style={styles.enterBox}>
                    <Image source={genius_logo} style={styles.logo} resizeMode="contain" />
                    <View style={styles.loginContainer}>
                        {loginForm()}
                        {otherLoginForm()}
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        marginBottom: 10,
        width: 230,
    },
    enterBox: {
        position: `relative`,
        boxShadow: `0px 4px 16px 0px rgba(221, 221, 221, 0.60)`,
        borderRadius: 15,
        width: 320,
        height: 400,
        justifyContent: `center`,
        alignItems: `center`,
        backgroundColor: `#fff`,
        color: `#666`,
        fontSize: 12,
        gap: 20,
        paddingVertical: 30,
        paddingHorizontal: 30,
        // alignItems: `stretch`,
        // flex: 1,
        // margin: `auto`,
    },
    loginBackground: {
        flex: 1,
        justifyContent: `center`,
        alignItems: `center`,
        width: `100%`,
    },
    logo: {
        // marginTop: 60,
        height: 30,
        width: 250,
    },
    loginContainer: {
        flex: 1,
        gap: 20,
    },
    otherLoginBox: {
        gap: 5,
    },
    otherText: {
        color: `#454545`,
    },
});

Login.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default Login;

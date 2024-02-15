import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import * as Authentication from 'expo-local-authentication';
import { commonInputStyles, commonTextStyles } from 'assets/styles';
import LoginLayout from './LoginLayout';
import store from 'store/store';
import * as StorageUtils from 'utils/StorageUtils';
import * as NavigateUtils from 'utils/NavigateUtils';
import { useSelector } from 'react-redux';
import { dispatchOne } from 'utils/Utils';

/** 생체 인증 로그인/등록 */
const BioLogin = ({ navigation }) => {
    const bioStore = useSelector((state) => state.loginReducer.bio);
    const [bio, setBio] = useState(bioStore);
    const bioRecords = useSelector((state) => state.loginReducer.bioRecords);

    // 생체 인증
    const authenticate = async (isRegister) => {
        try {
            const { success } = await Authentication.authenticateAsync({
                promptMessage: `${isRegister ? 'GENIUS 등록' : 'GENIUS 로그인'}`,
            });

            return success;
        } catch (error) {
            console.error('생체 인증 오류 :', error);
        }
    };

    // 생체 인증 로그인
    const loginBio = async () => {
        if (bioRecords && bio?.isRegistered) {
            const success = await authenticate();
            if (success) {
                store.dispatch(NavigateUtils.navigateDispatch('WEB', navigation));
            }
        } else {
            Alert.alert('생체 인증이 등록되어있지 않습니다.');
        }
    };

    // 생체 인증 등록
    const registBio = async () => {
        const success = await authenticate(true);
        if (success) {
            Alert.alert('GENIUS', '생체 인증이 등록되었습니다.', [
                {
                    text: '확인',
                    onPress: () => {
                        const bioValue = { ...bio, isRegistered: true, modFlag: false };
                        store.dispatch(dispatchOne('SET_BIO', bioValue));
                        StorageUtils.changeDeviceData('genius', { bio: true });
                        setBio(bioValue);
                    },
                },
            ]);
        } else {
            Alert.alert('다시 시도해주세요.');
        }
    };

    useEffect(() => {
        if (bio?.modFlag) {
            registBio();
        } else {
            loginBio();
        }
    }, [bio]);

    // return
    const bioLoginComponent = () => {
        return (
            <View style={styles.container}>
                <View style={styles.inputBox}>
                    <Text style={commonTextStyles.center}>{`생체 인증 ${bio?.modFlag ? '등록' : '로그인'}`}</Text>
                    <Text style={styles.infoText}>지문 또는 Face ID를 입력해주세요.</Text>
                    <Pressable style={commonInputStyles.buttonWhite} onPress={loginBio}>
                        <Text>다시 시도</Text>
                    </Pressable>
                </View>
            </View>
        );
    };

    return <LoginLayout element={bioLoginComponent()} />;
};

const styles = StyleSheet.create({
    container: {
        gap: 20,
    },
    inputBox: {
        gap: 20,
        margin: `0 auto`,
    },
    infoText: {
        textAlign: `center`,
        marginBottom: 50,
    },
});

BioLogin.propTypes = {
    navigation: PropTypes.any.isRequired,
};

export default BioLogin;

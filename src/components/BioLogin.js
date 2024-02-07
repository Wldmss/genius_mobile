import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import * as Authentication from 'expo-local-authentication';
import { commonInputStyles, commonTextStyles } from '@assets/styles';
import LoginLayout from './LoginLayout';

const BioLogin = ({ navigation }) => {
    const [bioSupported, setBioSupported] = useState(false);

    // 상태 관리를 사용하는게 좋을지도.. (TODO)
    const checkBioSupported = async () => {
        let bioFlag = false;

        // 단말 생체인증 지원 여부 확인
        const isSupported = await Authentication.hasHardwareAsync();

        if (isSupported) {
            const biometryType = await Authentication.supportedAuthenticationTypesAsync();
            setBioSupported(biometryType.includes(1) || biometryType.includes(2));
            bioFlag = biometryType.includes(1) || biometryType.includes(2);
        } else {
            setBioSupported(false);
            bioFlag = false;
            return;
        }

        // 단말 생체인증 등록 여부 확인
        const biometricRecords = await Authentication.isEnrolledAsync();
        bioFlag = biometricRecords;

        if (!biometricRecords) {
            return;
        }

        authenticate();
    };

    // 생체 인증
    const authenticate = async () => {
        try {
            const { success } = await Authentication.authenticateAsync({
                promptMessage: 'GENIUS 로그인',
            });

            if (success) {
                navigation.navigate('WEB');
            }
            // sendLogin(success);
        } catch (error) {
            console.error('생체 인증 오류 :', error);
        }
    };

    useEffect(() => {
        authenticate();
        // checkBioSupported();
    }, []);

    return (
        <LoginLayout
            element={
                <View style={styles.container}>
                    <View style={styles.input_box}>
                        <Text style={commonTextStyles.center}>{`생체 인증`}</Text>
                        <Text style={styles.infoText}>지문 또는 Face ID를 입력해주세요.</Text>
                        <Pressable style={commonInputStyles.buttonWhite} onPress={authenticate}>
                            <Text>다시 시도</Text>
                        </Pressable>
                    </View>
                </View>
            }
        />
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 20,
    },
    input_box: {
        gap: 12,
        margin: `0 auto`,
    },
    infoText: {
        textAlign: `center`,
        marginBottom: 50,
    },
});

BioLogin.propTypes = {
    navigation: PropTypes.any.isRequired,
    // sendLogin: PropTypes.func.isRequired,
};

export default BioLogin;

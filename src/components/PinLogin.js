import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TextInput, Pressable, Alert } from 'react-native';
import { commonInputStyles, commonTextStyles } from 'assets/styles';
import LoginLayout from './LoginLayout';
import { useSelector } from 'react-redux';
import store from 'store/store';
import { dispatchOne } from 'utils/DispatchUtils';
import * as StorageUtils from 'utils/StorageUtils';
import * as NavigateUtils from 'utils/NavigateUtils';

/** PIN 로그인/등록 */
const PinLogin = ({ navigation }) => {
    const pin = useSelector((state) => state.loginReducer.pin);
    const token = useSelector((state) => state.loginReducer.token);

    const pinLength = 6;
    const enterRef = useRef(null);
    const checkRef = useRef(null);
    const registRef = useRef(0);

    const [value, setValue] = useState({ enter: '', check: '' });
    const [isSame, setIsSame] = useState(null);
    const [isLogin, setIsLogin] = useState(false);

    const changePin = (id, input) => {
        // 숫자가 아닌 경우 return
        if (isNaN(input)) {
            Alert.alert('숫자를 입력해주세요.');
            return;
        }

        setValue({ ...value, [id]: input });

        // pin 등록 시 일치여부 확인
        if (pin.modFlag) {
            const otherId = id == 'enter' ? 'check' : 'enter';
            let sameFlag = null;
            if (value[otherId].length == pinLength && input) {
                sameFlag = checkSame(value[otherId], input);
            }

            setIsSame(sameFlag);
        }

        // pin 입력 시 자동 설정
        if (id == 'enter' && input.length == pinLength) {
            if (pin.modFlag) {
                if (checkRef.current) {
                    checkRef.current.focus();
                    return;
                }
            } else {
                if (registRef.current) {
                    registRef.current = registRef.current + 1;
                    return;
                }
            }
        }
    };

    // 일치 여부 확인
    const checkSame = (value1, value2) => {
        return value1 == value2;
    };

    // pin 설정
    const handlePinButton = () => {
        if (value.enter.length != pinLength || (pin.modFlag && value.check.length != pinLength)) {
            Alert.alert(`${pinLength}자리를 입력해주세요.`);
            return false;
        }

        const sameFlag = !pin.modFlag || checkSame(value.enter, value.check);
        if (!sameFlag) Alert.alert('PIN이 일치하지 않습니다.');

        if (!pin.modFlag) {
            if (pin.value != null && Number(value.enter) == Number(pin.value)) {
                // 로그인 성공
                store.dispatch(dispatchOne('SET_TOKEN', {}));
                setIsLogin(true);
            } else {
                enterRef.current.focus();
                Alert.alert('PIN이 일치하지 않습니다. 다시 시도해주세요.');
                setIsLogin(false);
            }
        } else {
            // PIN 등록
            registPin();
        }

        registRef.current = 0;
    };

    // PIN 등록
    const registPin = async () => {
        try {
            await StorageUtils.setDeviceData('pin', value.enter);
            store.dispatch(dispatchOne('SET_PIN', { ...pin, value: value.enter }));

            Alert.alert('PIN이 설정되었습니다.');
            store.dispatch(NavigateUtils.navigateDispatch('LDAP', navigation));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (registRef.current > 0) handlePinButton();
    }, [registRef.current]);

    useEffect(() => {
        if (isLogin) {
            const tabValue = token == null ? 'LDAP' : 'WEB';
            store.dispatch(NavigateUtils.navigateDispatch(tabValue, navigation));
        }
    }, [isLogin]);

    // return
    const pinLoginComponent = () => {
        return (
            <View style={styles.container} id="pin">
                <View style={styles.inputBox}>
                    <TextInput
                        id="enter"
                        ref={enterRef}
                        value={value.enter}
                        inputMode="numeric"
                        maxLength={pinLength}
                        placeholder="PIN 입력"
                        placeholderTextColor={`#a9a9a9`}
                        secureTextEntry
                        style={commonInputStyles.inputNumber}
                        onChangeText={(input) => changePin('enter', input)}
                    />
                    {pin.modFlag && (
                        <>
                            <TextInput
                                id="check"
                                ref={checkRef}
                                value={value.check}
                                inputMode="numeric"
                                maxLength={pinLength}
                                placeholder="PIN 입력 확인"
                                placeholderTextColor={`#a9a9a9`}
                                secureTextEntry
                                style={commonInputStyles.inputNumber}
                                onChangeText={(input) => changePin('check', input)}
                            />
                            <Text style={isSame != null ? (isSame ? commonTextStyles.success : commonTextStyles.warning) : ''}>
                                {isSame != null ? (isSame ? `일치합니다.` : `일치하지 않습니다.`) : ''}
                            </Text>
                        </>
                    )}
                </View>
                <Pressable style={commonInputStyles.buttonRed} onPress={handlePinButton}>
                    <Text style={commonTextStyles.white}>{pin.modFlag ? 'PIN 설정' : '로그인 하기'}</Text>
                </Pressable>
            </View>
        );
    };

    return <LoginLayout element={pinLoginComponent()} />;
};

const styles = StyleSheet.create({
    container: {
        gap: 20,
    },
    inputBox: {
        gap: 12,
    },
});

PinLogin.propTypes = {
    navigation: PropTypes.any.isRequired,
};

export default PinLogin;

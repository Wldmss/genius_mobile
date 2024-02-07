import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { commonInputStyles } from '@assets/styles';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const OtherLogin = ({ hasLDAP, pin, bio, tab }) => {
    const [open, setOpen] = useState(false);

    const otherLogin = (id, modFlag) => {};

    const handleOpen = () => {
        setOpen(!open);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.otherText} onPress={handleOpen}>{`다른 방법으로 로그인 ${open ? '∧' : '∨'}`}</Text>
            <View style={[styles.otherLoginBox, !open ? styles.none : '']}>
                {tab != 'pin' && hasLDAP && (
                    <Pressable style={commonInputStyles.button} onPress={() => otherLogin('PIN')}>
                        <Text>PIN</Text>
                    </Pressable>
                )}
                {tab != 'ldap' && !pin.modFlag && !bio.modFlag && (
                    <Pressable style={commonInputStyles.button} onPress={() => otherLogin('LDAP')}>
                        <Text>아이디/비밀번호</Text>
                    </Pressable>
                )}
                {tab != 'bio' &&
                    hasLDAP &&
                    !bio.modFlag &&
                    (bio.isRegistered ? (
                        <Pressable style={commonInputStyles.button} onPress={() => otherLogin('BIO')}>
                            <Text>생체 인증</Text>
                        </Pressable>
                    ) : (
                        <Pressable style={commonInputStyles.button} onPress={() => otherLogin('BIO', true)}>
                            <Text>생체 인증 설정</Text>
                        </Pressable>
                    ))}
                {tab == 'pin' && !pin.modFlag && (
                    <Pressable style={commonInputStyles.button} onPress={() => otherLogin('PIN', true)}>
                        <Text>PIN 변경</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 5,
    },
    otherLoginBox: {
        gap: 5,
    },
    otherText: {
        color: `#454545`,
        width: 250,
    },
    none: {
        display: `none`,
    },
});

OtherLogin.propTypes = {
    hasLDAP: PropTypes.bool.isRequired,
    pin: PropTypes.object.isRequired,
    bio: PropTypes.object.isRequired,
    tab: PropTypes.string.isRequired,
};

export default OtherLogin;

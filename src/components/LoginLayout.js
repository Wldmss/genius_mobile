import React from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';

const top_logo = require('/assets/login_top_title.svg');
const genius_logo = require('/assets/genius_logo.png');
const genius_background = require('/assets/genius_login_full_mobile.png');

const LoginLayout = ({ element }) => {
    return (
        <View style={styles.container}>
            <ImageBackground source={genius_background} style={styles.loginBackground}>
                <Image source={top_logo} style={styles.title} resizeMode="contain" />
                <View style={styles.enterBox}>
                    <Image source={genius_logo} style={styles.logo} resizeMode="contain" />
                    <View style={styles.loginContainer}>{element}</View>
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
        width: 300,
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

LoginLayout.propTypes = {
    element: PropTypes.object,
};

export default LoginLayout;

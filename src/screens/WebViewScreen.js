import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, BackHandler, Alert, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import store from 'store/store';
import { dispatchOne } from 'utils/Utils';
import * as NavigateUtils from 'utils/NavigateUtils';

const WebViewScreen = ({ navigation }) => {
    const isLink = useSelector((state) => state.loginReducer.isLink);
    const token = useSelector((state) => state.loginReducer.token);

    const webViewRef = useRef(null);

    const [backButtonEnabled, setBackButtonEnabled] = useState(false);

    // Webview content loaded
    const webViewLoaded = () => {
        setBackButtonEnabled(true);
    };

    // Webview navigation state change
    const onNavigationStateChange = (navState) => {
        setBackButtonEnabled(navState.canGoBack);

        if (!navState.loading) {
            exitFullscreen();
        }
    };

    const handleOnMessage = (event) => {
        const data = event.nativeEvent.data;
        console.log(data);

        switch (data) {
            case 'enterFullscreen':
                enterFullscreen();
                break;
            case 'logout':
                store.dispatch(dispatchOne('SET_TOKEN', null));
                break;
            default:
                break;
        }
    };

    const enterFullscreen = () => {
        if (Platform.OS === 'android') {
            StatusBar.setHidden(true);
        }
    };

    const exitFullscreen = () => {
        if (Platform.OS === 'android') {
            StatusBar.setHidden(false);
        }
    };

    useEffect(() => {
        console.log(isLink);
        if (isLink) BackHandler.exitApp();
        // todo QR 로그인 후 뭔가 해야함
    }, [isLink]);

    useEffect(() => {
        // Handle back event
        const backHandler = () => {
            if (backButtonEnabled) {
                webViewRef.current.goBack();
                return true;
            } else {
                Alert.alert(
                    '앱 종료',
                    'GENIUS를 종료하시겠습니까?',
                    [
                        { text: '아니요', onPress: () => null, style: 'cancel' },
                        { text: '예', onPress: () => BackHandler.exitApp() },
                    ],
                    { cancelable: false }
                );
                return true;
            }
        };
        // Subscribe to back state event
        BackHandler.addEventListener('hardwareBackPress', backHandler);

        // Unsubscribe
        return () => BackHandler.removeEventListener('hardwareBackPress', backHandler);
    }, [backButtonEnabled]);

    useEffect(() => {
        // if (token == null) store.dispatch(NavigateUtils.navigateDispatch('Main', navigation));
    }, [token]);

    return (
        <WebView
            ref={webViewRef}
            style={styles.webview}
            onLoad={webViewLoaded}
            source={{ uri: 'https://naver.com' }}
            onNavigationStateChange={onNavigationStateChange}
            onMessage={handleOnMessage}
            // onShouldStartLoadWithRequest={(e) => FileUtils.handleDownloadRequest(e, webViewRef)}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        border: `1px solid red`,
    },
    webview: {
        flex: 1,
        border: `1px solid orange`,
    },
});

WebViewScreen.propTypes = {
    navigation: PropTypes.any.isRequired,
};

export default WebViewScreen;

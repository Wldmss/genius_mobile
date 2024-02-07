import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, BackHandler, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const WebViewScreen = () => {
    const webViewRef = useRef(null);

    const [backButtonEnabled, setBackButtonEnabled] = useState(false);

    // Webview content loaded
    const webViewLoaded = () => {
        setBackButtonEnabled(true);
    };

    // Webview navigation state change
    const onNavigationStateChange = (navState) => {
        setBackButtonEnabled(navState.canGoBack);
    };

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

    return (
        <WebView
            ref={webViewRef}
            style={styles.webview}
            onLoad={webViewLoaded}
            source={{ uri: 'https://naver.com' }}
            onNavigationStateChange={onNavigationStateChange}
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

export default WebViewScreen;

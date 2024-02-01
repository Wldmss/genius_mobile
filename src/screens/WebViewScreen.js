import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-web';
import { WebView } from 'react-native-webview';
import * as FileUtils from '@utils/FileUtils';

const WebViewScreen = () => {
    const webViewRef = useRef(null);

    return (
        <ScrollView style={styles.container}>
            {/* <View style={styles.webview}></View> */}
            <WebView
                ref={webViewRef}
                style={styles.webview}
                source={{ uri: 'https://naver.com' }}
                onShouldStartLoadWithRequest={(e) => FileUtils.handleDownloadRequest(e, webViewRef)}
            />
        </ScrollView>
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

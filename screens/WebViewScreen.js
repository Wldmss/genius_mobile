import React from "react"
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-web";
import { WebView } from 'react-native-webview';

const WebViewScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.webview}></View>
            {/* <WebView
                style={styles.webview}
                source={{ uri: 'https://naver.com' }}
            /> */}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        border: `1px solid red`,
    },
    webview: {
        flex: 1,
        border: `1px solid orange`,
    }
});

export default WebViewScreen;
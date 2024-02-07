import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import store from '@store/store';
import Navigation from '@navigation/Navigation';

const App = () => {
    return (
        <Provider store={store}>
            <SafeAreaView style={styles.container}>
                <StatusBar />
                <Navigation />
            </SafeAreaView>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;

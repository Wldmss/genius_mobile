import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import store from 'store/store';
import Navigation from 'navigation/Navigation';
import PopModal from 'modal/PopModal';
// import Push from 'utils/Push';

const App = () => {
    return (
        <Provider store={store}>
            <SafeAreaView style={styles.container}>
                <StatusBar />
                <Navigation />
                <PopModal />
                {/* <Push /> */}
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

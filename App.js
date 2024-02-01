import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import WebViewScreen from './screens/WebViewScreen';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
              <StatusBar />
      <WebViewScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
});

export default App;
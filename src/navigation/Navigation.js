import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import WebViewScreen from 'screens/WebViewScreen';
import Main from 'screens/Main';
import PinLogin from 'components/PinLogin';
import BioLogin from 'components/BioLogin';
import LDAPLogin from 'components/LDAPLogin';
import { useEffect } from 'react';
import { Alert, BackHandler, Text } from 'react-native';
import { useSelector } from 'react-redux';
import store from 'store/store';
import { dispatchMultiple } from 'utils/DispatchUtils';

const Stack = createStackNavigator();
const prefix = Linking.createURL('/');

const Navigation = () => {
    const commonOptions = { headerShown: false };
    const tab = useSelector((state) => state.loginReducer.tab);

    const linking = {
        prefixes: [prefix],
        config: {
            initialRouteName: 'Main',
            screens: {
                Main: 'genius',
            },
        },
    };

    // 앱 종료
    const closeGenius = () => {
        BackHandler.exitApp();
    };

    useEffect(() => {
        console.log(prefix);
    }, [prefix]);

    useEffect(() => {
        // Handle back event
        const backHandler = () => {
            if (tab != 'WEB') {
                Alert.alert(
                    '앱 종료',
                    'GENIUS를 종료하시겠습니까?',
                    [
                        { text: '아니요', onPress: () => null, style: 'cancel' },
                        { text: '예', onPress: () => closeGenius() },
                    ],
                    { cancelable: false }
                );
            }
            return true;
        };
        // Subscribe to back state event
        BackHandler.addEventListener('hardwareBackPress', backHandler);

        // Unsubscribe
        return () => BackHandler.removeEventListener('hardwareBackPress', backHandler);
    }, [tab]);

    return (
        <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
            <Stack.Navigator>
                <Stack.Screen name="Main" component={Main} options={commonOptions} />
                <Stack.Screen name="PIN" component={PinLogin} options={commonOptions} />
                <Stack.Screen name="BIO" component={BioLogin} options={commonOptions} />
                <Stack.Screen name="LDAP" component={LDAPLogin} options={commonOptions} />
                <Stack.Screen name="WEB" component={WebViewScreen} options={commonOptions} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import WebViewScreen from 'screens/WebViewScreen';
import Main from 'screens/Main';
import PinLogin from 'components/PinLogin';
import BioLogin from 'components/BioLogin';
import LDAPLogin from 'components/LDAPLogin';
import { useEffect } from 'react';
import { Text } from 'react-native';

const Stack = createStackNavigator();
const prefix = Linking.createURL('/');

const Navigation = () => {
    const commonOptions = { headerShown: false };

    const linking = {
        prefixes: [prefix],
        config: {
            initialRouteName: 'Main',
            screens: {
                Main: 'genius',
            },
        },
    };

    useEffect(() => {
        console.log(prefix);
    }, [prefix]);

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

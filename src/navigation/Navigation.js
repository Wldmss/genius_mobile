import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WebViewScreen from '@screens/WebViewScreen';
import Main from '@screens/Main';
import PinLogin from '@components/PinLogin';
import BioLogin from '@components/BioLogin';
import LDAPLogin from '@components/LDAPLogin';

const Stack = createStackNavigator();

const Navigation = () => {
    const commonOptions = { headerShown: false };

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
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

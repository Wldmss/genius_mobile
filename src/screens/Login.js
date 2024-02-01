import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import BioLogin from '../components/BioLogin';
import PinLogin from '../components/PinLogin';
import LDAPLogin from '../components/LDAPLogin';

const Login = () => {
    const [hasLDAP, setHasLDAP] = useState(false);
    const [hasPin, setHasPin] = useState(false);
    const [hasBio, setHasBio] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    const sendLogin = (result) => {
        console.log(result);
        setIsLogin(result);
    };

    return hasBio ? <BioLogin sendLogin={sendLogin} /> : hasPin ? <PinLogin sendLogin={sendLogin} /> : <LDAPLogin sendLogin={sendLogin} />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        border: `1px solid red`,
    },
});

export default Login;

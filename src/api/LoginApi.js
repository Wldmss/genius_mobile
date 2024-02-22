import ApiService from './ApiService';
import { AES, enc } from 'crypto-js';

// LDAP login
export const ldapLogin = (username, password) => {
    const key = 'genius';
    const encryptUsername = AES.encrypt(String(username), key).toString(enc.Utf8);
    const encryptPassword = AES.encrypt(String(password), key).toString(enc.Utf8);

    return ApiService.post('login', { username: encryptUsername, password: encryptPassword }, {})
        .then((response) => {
            return { status: true, data: response.data };
        })
        .catch((err) => {
            return { status: true };
        });
};

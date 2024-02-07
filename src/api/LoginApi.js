import ApiService from './ApiService';

// LDAP login
export const ldapLogin = (username, password) => {
    return ApiService.post('login', { username: username, password: password }, {})
        .then((response) => {
            return { status: true, data: response.data };
        })
        .catch((err) => {
            return { status: false };
        });
};

const initialState = {
    token: null,
    pin: null,
    bio: null,
    users: null,
    tab: null,
    bioSupported: false,
    bioRecords: false,
    isLink: false,
};

const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TOKEN':
            return {
                ...state,
                token: action.payload,
            };
        case 'SET_PIN':
            return {
                ...state,
                pin: action.payload,
            };
        case 'SET_BIO':
            return {
                ...state,
                bio: action.payload,
            };
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload,
            };
        case 'SET_TAB':
            return {
                ...state,
                tab: action.payload,
            };
        case 'SET_BIO_SUPPORTED':
            return {
                ...state,
                bioSupported: action.payload,
            };
        case 'SET_BIO_RECORDS':
            return {
                ...state,
                bioRecords: action.payload,
            };
        case 'SET_LINK':
            return {
                ...state,
                isLink: action.payload,
            };
        default:
            return state;
    }
};

export default loginReducer;

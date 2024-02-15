import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk'; // Redux 비동기 작업을 처리하기 위한 미들웨어
import loginReducer from 'store/reducers/loginReducer';
import modalReducer from 'store/reducers/modalReducer';

const rootReducer = combineReducers({
    loginReducer,
    modalReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

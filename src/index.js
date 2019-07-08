import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { middleware as flashMiddleware } from 'redux-flash'
import thunk from 'redux-thunk';


import appReducers from 'my-reducers/index';
import AppPage from 'my-pages/AppPage';
import 'my-utils/i18n';
import * as serviceWorker from './serviceWorker';


const store = createStore(
    appReducers,
    compose(
        applyMiddleware(thunk, flashMiddleware()),
        window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : _ => _
    )
);

ReactDOM.render(
    <Provider store={store}>
        <AppPage />
    </Provider>, document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

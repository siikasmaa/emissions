import React from "react";
import {render} from 'react-dom';
import Home from "./containers/home";
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import rootReducer from './reducers';
import thunk from "redux-thunk";

const target = document.getElementById('root');
const store = createStore(rootReducer, applyMiddleware(thunk));

render(
    <Provider store={store}>
        <div className="app">
            <Home/>
        </div>
    </Provider>,
    target
);
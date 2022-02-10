// This method removes console and improves performance while rendering instead of sticking to printing console messages
if(!__DEV__){
    let consoleMethods = ["log"];
    for(let i = 0; i < consoleMethods.length; i++){
        console[consoleMethods[i]] = function() {};                
    }
}

import React, { Component } from 'react';
import Router from './Router';
import { connect } from 'react-redux';
import { Provider } from 'react-redux';
import App from './App';
import {createStore, applyMiddleware} from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk'

export let store = createStore(reducers, applyMiddleware(thunk));

const AppContainer = () => {
  return (
    <Provider store={store}>
      <App/>
    </Provider>
  );
}

export default AppContainer;

import React, { Component } from "react";
import { connect } from 'react-redux';
import {Platform, StyleSheet, View, Text, BackHandler } from "react-native";
import { Scene, Router, Actions, Drawer, Reducer, ActionConst, Stack } from "react-native-router-flux";
import Landing from './components/Landing';
import SideMenu from './components/SideMenu';
import Books from './components/Books';
import Favorites from './components/Favorites';
import AboutUs from './components/AboutUs';
import PickBookChapter from './components/PickBookChapter';
import Chapters from './components/Chapters';
import NavigationDrawer from './components/NavigationDrawer';
import Search from './components/Search';
import ResetPage from './components/ResetPage';
import WebViewTest from './components/WebViewTest';

class RouterComponent extends Component {
  constructor(props) {
    super(props);
    this.reducerCreate = this.reducerCreate.bind(this);
  }

  reducerCreate(params) {
    let {router, updateCurrentScene} = this.props;
    const defaultReducer = new Reducer(params);
    return (state, action) => {
      // console.log("router action type: " + JSON.stringify(action.type));
      return defaultReducer(state, action);
    };
  }

  render() {
    return (
      <Router hideNavBar={true} {...this.props} createReducer={this.reducerCreate}>
        <Scene key='drawer' component={NavigationDrawer} open={false}>
          <Scene key="main">
            <Scene key='landing' type='reset' component={Landing}  initial/>
            <Scene key='books' type='reset' component={Books}  />
            <Scene key='favorites' type='reset' component={Favorites} />
            <Scene key='aboutus' type='reset' component={AboutUs} />
            <Scene key='pickbookchapter' component={PickBookChapter} />
            <Scene key='chapters' component={Chapters} />
            <Scene key='search' component={Search}/>
            <Scene key='resetpage' type='reset' component={ResetPage}/>
            {/*Test page*/}
            <Scene key='webviewtest' component={WebViewTest}/> 
          </Scene>
        </Scene>
      </Router>
   );
  }
}

const mapStateToProps = (state) => {
  return {};
};

function mapDispatchToProps (dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(RouterComponent);


import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  BackHandler
} from 'react-native';
import { connect } from "react-redux";
import Router from "./Router";
import { createStore, applyMiddleware } from 'redux';
import { updateUnmountState } from './actions/RouterActions';
import ScreenBlocker from "./components/ScreenBlocker";
import { Actions } from "react-native-router-flux";
import SplashScreen from 'react-native-splash-screen'

const ConnectedRouter = connect()(Router);

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      showScreenBlocker: false
    }
    this.backAndroid = this.backAndroid.bind(this);
  }

  componentDidMount() {
    SplashScreen.hide();
    BackHandler.addEventListener('hardwareBackPress', this.backAndroid); 
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backAndroid);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.router && nextProps.router.isUnmounting) {
      this.setState({
        showScreenBlocker: true
      },()=>{
        setTimeout(()=>{
          this.setState({ showScreenBlocker: false });
          this.props.updateUnmountState(false);
        },600);
      });
    }
  }

  backAndroid () {
    Actions.pop(); 
    return true;
  }


  render() {
    return (
      <View style={styles.container}>
        <ConnectedRouter/>
        {
          (this.state.showScreenBlocker)? <ScreenBlocker /> : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width:'100%', 
    height:'100%'
  }
});


function mapStateToProps (state) {
  return {
    router: state.router
  };
}

function mapDispatchToProps (dispatch) {
  return {
    updateUnmountState: (state)=>{dispatch(updateUnmountState(state))}
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);


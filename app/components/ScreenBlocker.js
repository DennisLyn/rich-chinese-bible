import React, { Component} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import CustomSpinner from './common/CustomSpinner'

class ScreenBlocker extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.screenContainer}><CustomSpinner /></View>
    );
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height:'100%',
    backgroundColor:'#fff',
    opacity: 0.5
  }
});

export default ScreenBlocker;

import React, { Component, PureComponent } from 'react';
import { 
  ListView, 
  View, 
  Text, 
  TouchableHighlight, 
  StyleSheet, 
  Image,
  Dimensions
} from 'react-native';
import NavigationBar from './NavigationBar';
import { Actions } from 'react-native-router-flux';
import CustomSpinner from './common/CustomSpinner'

class ResetPage extends PureComponent { 
  constructor(props){
    super(props);
  }

  render() {
    return (
        <CustomSpinner />
    );
  }
}

export default ResetPage;
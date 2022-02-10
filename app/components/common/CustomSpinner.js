import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
var Spinner = require('react-native-spinkit');

const defaultType = 'Wave'; // 'CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 'ChasingDots', 'ThreeBounce', 'Circle', '9CubeGrid', 'FadingCircle', 'FadingCircleAlt'
const defaultColor = '#3676B8';
const defaultSize = 50;

class CustomSpinner extends Component {
  constructor(props){
    super(props);
  }
  render() {
    const { style, size, type, color} = this.props;
    return (
      <View style={styles.loadingContainer}>
        <Spinner 
          style={style || styles.spinner}
          isVisible={true} 
          size={size || defaultSize} 
          type={type|| defaultType}
          color={color || defaultColor}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  spinner: {
    alignItems: "center", 
    justifyContent: "center", 
  },
  loadingContainer: {
    alignItems: "center", 
    justifyContent: "center", 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height:'100%'
  }
});

export default CustomSpinner;
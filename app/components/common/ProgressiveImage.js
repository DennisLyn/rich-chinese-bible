import React, { Component } from 'react';
import { 
  Animated, 
  View, 
  StyleSheet, 
  Image
} from 'react-native';

class ProgressiveImage extends Component {
  constructor(props){
    super(props);
    this.state = {
      image_fade: new Animated.Value(0)
    };   
  }
  
  imageOnLoad(){
    Animated.timing(
      this.state.image_fade,
      {
        toValue: 1,
        duration: 250
      }
    ).start()
  }
  
  render() {
    const { imagekey, source, style } = this.props;
    return (
      <Animated.Image
        key={imagekey}
        style={[{opacity: this.state.image_fade}, style]}
        source={source}
        onLoad={this.imageOnLoad.bind(this)}>
      </Animated.Image>    
    )
  }
}

export default ProgressiveImage;

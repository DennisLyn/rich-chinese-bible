import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  WebView
} from 'react-native';

class WebViewTest extends Component {
  render() {
    let testUrl= 'https://www.samsung.com/us/m';
    return (
      <View style={styles.container}>
        <WebView
          source={{uri: testUrl}}
          style={{marginTop: 0}}
          onLoadStart={()=>{}}
          onNavigationStateChange={()=>{}}
          onShouldStartLoadWithRequest={()=>{}}
          injectedJavaScript = {``}
          javaScriptEnabled = {true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  }
});

export default WebViewTest;
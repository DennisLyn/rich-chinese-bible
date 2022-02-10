import React, { Component, PureComponent } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image,
  Dimensions,
  Animated,
  ActivityIndicator
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { fetchBibleData, fetchBooksData, fetchSearchData } from '../actions';
import { connect } from 'react-redux';
import ProgressiveImage from "./common/ProgressiveImage";
var Spinner = require('react-native-spinkit');
const logoIcon = require("../img/cbible_blue_small.jpg");

class Landing extends PureComponent { 
  constructor(props){
    super(props);
    this.state = {
      appImg_fade: new Animated.Value(0) 
    }
  }

  componentWillMount() {}
  
  componentDidMount() { 
    Animated.timing(
      this.state.appImg_fade,
      {
        toValue: 1,
        delay: 0,
        duration: 0
      }
    ).start(()=>{
      Animated.timing(
        this.state.appImg_fade,
        {
          delay: 1000,
        }
      ).start(()=>{ 
        Actions.books();
        // Actions.search();  
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={[{opacity: this.state.appImg_fade}]}>
          <View>
            <ProgressiveImage style={styles.logoIcon} source={logoIcon} />
          </View>
        </Animated.View>
        <Spinner type='ThreeBounce' size={55} color='#3676B8'/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: '#f5f5f5'
  },
  logoIcon: {
    width: 90,
    height: 90,
    borderRadius: 10,
  }
});

const mapStateToProps = (state) => {
  return {
    books: state.books,
    bible: state.bible
  };
};

function mapDispatchToProps (dispatch) {
  return {
    fetchBibleData: dispatch(fetchBibleData()),
    fetchBooksData: dispatch(fetchBooksData()),
    fetchSearchData: dispatch(fetchSearchData())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
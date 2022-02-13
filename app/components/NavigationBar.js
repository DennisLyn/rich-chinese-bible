import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableHighlight,
  Platform,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const NavigationBarStyle = {
  height: (Platform.OS == "android") ? 55 : 65
};

const { width } = Dimensions.get('window');
const navMenuIconsBlockWith = 30;
const navBarRightBlockWith = 130;
const pagePaddingHorizontal = 20;
const maxTitlelimit = 20;
class NavigationBar extends Component {
  constructor(props){
    super(props);
  }
  render () {
    let props = this.props;
    return (
      <View style={(props && props.navBarStyle)? [styles.navBarContainer,props.navBarStyle]:styles.navBarContainer}>
        {
          (props && props.menu)? (
            <TouchableOpacity style={styles.menuIconsBlock} onPress={()=>{ Actions.refresh({key: 'drawer', open: true }) }}>
              {
                (props.menuIconSource)? (<Image style={styles.menu_burger} source={props.menuIconSource}></Image>)
                : <Icon style={{}} name="menu" size={30} color="#000"/>
              }
            </TouchableOpacity>
          ): null
        }
        {
          (props && props.back)? (
            <TouchableOpacity style={styles.menuIconsBlock} onPress={(props.backOnPress)? (props.backOnPress)
            :
              ()=>{
                Actions.pop()}
              }
            >
              {
                (props.backIconSource)? (<Image style={{width:20, height:20, resizeMode: 'contain'}} source={props.backIconSource}></Image>)
                : <Icon style={{}} name="arrow-left" size={30} color="#000"/>
              }
            </TouchableOpacity>
          ): null
        }
        <View style={(props && props.rightComponent)? (styles.navBarTitleBlockWithRightBlock): (styles.navBarTitleBlock)}>
          {
            (props && props.title)? (<Text style={(props && props.titleStyle)? props.titleStyle: styles.navTitle}>{((props.title).length > maxTitlelimit)?(((props.title).substring(0,maxTitlelimit-3)) + '...') : 
            props.title}</Text>)
            : null
          }
        </View>
        {
          (props && props.rightComponent)? (
            <View style={styles.navBarRightBlock}>{props.rightComponent}</View>
          )
          : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navBarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    top: 0,
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: NavigationBarStyle.height,
    width: '100%',
    paddingHorizontal: pagePaddingHorizontal,
    paddingTop: (Platform.OS == "android") ? 0 : 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  menu_burger: {
    width:18,
    height:18,
    resizeMode: 'contain',
    marginRight: 0
  },
  backBtn: {
    width:20,
    height:20,
    resizeMode: 'contain',
    marginRight: 25
  },
  menuIconsBlock: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    width: navMenuIconsBlockWith,
  },
  navBarTitleBlock: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  navTitle: {
    textAlign:'center',
    color: '#000',
    fontSize: 18,
    marginLeft: -60
  },
  navBarTitleBlockWithRightBlock: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    width: width - navMenuIconsBlockWith - navBarRightBlockWith - (2 * pagePaddingHorizontal)
  },
  navBarRightBlock:{
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
    backgroundColor: 'transparent',
    width: navBarRightBlockWith
  }
});

export default NavigationBar;

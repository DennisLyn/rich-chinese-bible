import React, { Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import ProgressiveImage from "./common/ProgressiveImage";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const bayrimLogo = require("../img/nav-logo.png");
const appLogo = require("../img/cbible_blue_small.jpg");
const packageJson = require('../../package.json');
const appVersion = packageJson.version;


class SideMenu extends Component {
  constructor(props){
    super(props);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.goToPage = this.goToPage.bind(this);
  }

  closeDrawer() {
    Actions.refresh({key: 'drawer', open: false });
  };

  goToPage(page) {
    this.closeDrawer();
    if(page=='search' || page=='pickbookchapter'){
      window.setTimeout(()=>{
        Actions.resetpage();
        Actions[page]({from: 'sideMenu', type: 'replace'});
      }, 280);
    } else {
      window.setTimeout(()=>{
        Actions.resetpage();
        window.setTimeout(Actions[page], 280);
      });
    }
  }

  render() {
    return (
     <View style={styles.container}>
     <ScrollView style={{width:'100%', height:'100%'}}>
      <View style={styles.headerBlock}></View>
      <View style={styles.infoBlock}>
        <ProgressiveImage style={styles.appLogo} source={appLogo} />
        <View>
          <Text style={styles.menuSubTitle}>和合本</Text>
          <Text style={styles.appVeriosn}>V.{appVersion}</Text>
        </View>
      </View>
      <View style={styles.splitBar}></View>
      <View style={styles.pageMenuBlock}>
        <TouchableOpacity style={styles.menuItemBlock} onPress={()=>{this.goToPage('books')}}>
          <Text style={[styles.menuItem]}>聖經全書</Text>
          <View style={[styles.menuItemIconBlock, {backgroundColor:'#fff'}]}>
            <Icon style={{}} name="book-open" size={30} color="#3676B8"/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItemBlock} onPress={()=>{this.goToPage('pickbookchapter');}}>
          <Text style={[styles.menuItem]}>選擇章節</Text>
          <View style={[styles.menuItemIconBlock, {backgroundColor:'#fff'}]}>
            <Icon style={{}} name="launch" size={30} color="#3676B8"/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItemBlock} onPress={()=>{this.goToPage('search');}}>
          <Text style={[styles.menuItem]}>搜尋</Text>
          <View style={[styles.menuItemIconBlock, {backgroundColor:'#fff'}]}>
            <Icon style={{}} name="magnify" size={30} color="#3676B8"/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItemBlock} onPress={()=>{this.goToPage('favorites');}}>
          <Text style={[styles.menuItem]}>我的收藏</Text>
          <View style={[styles.menuItemIconBlock, {backgroundColor:'#fff'}]}>
            <Icon style={{}} name="heart" size={30} color="#3676B8"/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItemBlock} onPress={()=>{this.goToPage('aboutus');}}>
          <Text style={[styles.menuItem]}>關於我們</Text>
          <View style={[styles.menuItemIconBlock, {backgroundColor:'#fff'}]}>
            <ProgressiveImage style={styles.bayrimLogo} source={bayrimLogo} />
          </View>
        </TouchableOpacity>
        <View style={styles.menuFooter}></View>
      </View>
      </ScrollView>
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#3676B8',
    opacity: 1,
    paddingHorizontal: 25
  },
  headerBlock: {
    height: 40,
    width: '100%',
    justifyContent: 'flex-end',
    marginTop: 0,
    flexDirection: 'row'
  },
  infoBlock: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
    flexDirection: 'row',
    paddingHorizontal: 25
  },
  splitBar: {
    width: '100%',
    height: 2,
    borderBottomColor: '#fff',
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderBottomWidth: 1,
  },
  logoutTxt: {
    color: '#db662d',
    fontSize: 14,
  },
  pageMenuBlock: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
    paddingHorizontal: 25,
    marginTop: 20
  },
  menuTitle: {
    fontSize: 26,
    color: '#fff',
  },
  menuSubTitle: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10
  },
  menuItemBlock: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItem: {
    color: '#fff',
    fontSize: 20,
    marginTop: 30,
    width: '70%',
    textAlign: 'right',
    paddingRight: 25

  },
  menuItemIconBlock: {
    borderRadius:50,
    marginTop:30,
    backgroundColor:'#ECC809',
    paddingHorizontal:5,
    paddingVertical:5,
    width:50,
    height:50,
    justifyContent:'center',
    alignItems:'center'
  },
  menuItemIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain'
  },
  menuFooter: {
    height: 50
  },
  bayrimLogo: {
    height: 30,
    width: 30,
    resizeMode: 'contain'
  },
  appLogo: {
    height: 60,
    width: 60,
    resizeMode: 'contain',
    borderWidth:1,
    borderColor: '#fff',
    borderRadius: 5
  },
  appVeriosn : {
    color: '#fff',
    fontSize: 11,
    marginLeft: 10
  }
});

const mapStateToProps = (state) => {
  return {};
};

function mapDispatchToProps (dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);

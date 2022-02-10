import React, { Component, PureComponent } from 'react';
import { 
  ListView, 
  View, 
  Text, 
  TouchableHighlight, 
  StyleSheet, 
  Image,
  Dimensions,
  ScrollView,
  Linking,
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import NavigationBar, { NavigationBarStyle } from './NavigationBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class AboutUs extends PureComponent { 
  constructor(props){
    super(props);
    this.renderNavBar = this.renderNavBar.bind(this);
  }

  componentWillMount() {
    const navBarConfig = {
      hideNavBar: false,
      navBar: this.renderNavBar,
    };
    Actions.refresh(navBarConfig);
  }


  renderNavBar() {
    return (
      <NavigationBar
        menu={true} 
        // back={true}
        title="關於我們"
      />
    );
  }

  render() {
    return (
     <View style={styles.container}>
     <ScrollView style={{width:'100%', height:'100%', zIndex:1}} contentContainerStyle={{justifyContent: "flex-start", alignItems: "center"}}>
        <View style={{height: NavigationBarStyle.height + 50}} />
        <View style={styles.mainContent}>
          <Text style={styles.intruTxt}>我們是基督徒，我們是兩名成員的團隊。 Bayrim是我們的公司，它是一家非營利性的公司，志在開發創新和有用的工具。 聖經工具書是我們的主要目標之一。 我們希望這本工具書可以幫助您，讓您更多地閱讀聖經。</Text>
        </View>
        <TouchableOpacity style={styles.itemBlock} onPress={()=>{
          Linking.openURL('http://www.bayrim.org/');
        }}>
          <Icon style={styles.icon} name="domain" size={25} color="#495057"/>
          <Text style={styles.itemTxt}>Bayrim: <Text style={styles.linkTxt}>http://www.bayrim.org/</Text></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemBlock} onPress={()=>{
          Linking.openURL('mailto:bayrim101@gmail.com');
        }}>
          <Icon style={styles.icon} name="at" size={25} color="#495057"/>
          <Text style={styles.itemTxt}>Contact: <Text style={styles.linkTxt}>bayrim101@gmail.com</Text></Text>
        </TouchableOpacity>
        <View style={styles.itemBlock}>
          <Icon style={styles.icon} name="face" size={25} color="#495057"/>
          <Text style={styles.itemTxt}>Developer: Pankun Lin</Text>
        </View>
        <View style={styles.itemBlock}>
          <Icon style={styles.icon} name="face-profile" size={25} color="#495057"/>
          <Text style={styles.itemTxt}>Developer: Fangju Ou</Text>
        </View>
      </ScrollView>
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
  mainContent: {
    paddingHorizontal: 25,
    paddingVertical: 25,
  },
  intruTxt: {
    fontSize: 16
  },
  itemTxt: {
    fontSize: 16
  },
  linkTxt: {
    color: '#0000ff'
  },
  itemBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  icon:{
    marginRight: 10
  }
});


export default AboutUs;
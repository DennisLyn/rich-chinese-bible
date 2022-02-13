import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  InteractionManager,
  TouchableOpacity,
  Clipboard,
  ScrollView
} from 'react-native';
import { fetchFavoritesData, removeFavorite } from '../actions';
import NavigationBar, { NavigationBarStyle } from './NavigationBar';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import CustomSpinner from './common/CustomSpinner'
import Modal from "react-native-modal";
import Share, {ShareSheet, Button} from 'react-native-share';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const stickyBtnHeight = 10;
const headerHeight = NavigationBarStyle.height;

class Favorites extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      favorites: null,
      renderPlaceholderOnly: true,
      modalVisible: false,
      selected: null,
      isFetching: true
    };
    this.renderNavBar = this.renderNavBar.bind(this);
    this.refreshNavBar = this.refreshNavBar.bind(this);
    this.renderList = this.renderList.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.shareContent = this.shareContent.bind(this);
    this.onPressListItem = this.onPressListItem.bind(this);
    this.goToChapter = this.goToChapter.bind(this);
  }

  componentWillMount() {}

  async componentDidMount() {
    console.log('DidMount??')
    this.refreshNavBar();
    let { fetchFavoritesData } = this.props;
    fetchFavoritesData();

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        renderPlaceholderOnly: false,
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    let favorites = nextProps.favorites;
    this.setState({
      favorites: favorites.data,
      isFetching : favorites.isFetching
    });
  }

  refreshNavBar() {
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
        title="我的收藏"
      />
    );
  }

  onPressListItem(key) {
    let { favorites } = this.state;
    this.openModal();
    let selected = {};
    selected[key]= favorites[key];
    this.setState({selected: selected});
  }

  openModal() {
    this.setState({modalVisible:true});
  }

  closeModal() {
    this.setState({modalVisible:false});
  }

  removeFromFavorites() {
    let { selected } = this.state;
    let { removeFavorite } = this.props;
    removeFavorite(selected);
  }

  copyContent() {
    let { selected } = this.state;
    let content = '';
    if(selected) {
      let selectedDetails = selected[Object.keys(selected)[0]];
      content = `${selectedDetails.book} ${selectedDetails.chapterName} 第 ${selectedDetails.index+1} 節 : ${selectedDetails.content}`;
    }
    Clipboard.setString(content);
  }

  shareContent() {
    let { selected } = this.state;
    let content = '';
    if(selected) {
      let selectedDetails = selected[Object.keys(selected)[0]];
      let bookChapter = selectedDetails.chapterName.replace(/第|章| /g, '');
      content = `${selectedDetails.book} ${selectedDetails.chapterName} 第 ${selectedDetails.index+1} 節 : ${selectedDetails.content}`;

      let options = {
        title: '聖經-經節分享',
        message: content,
        subject: '聖經-經節分享'
      };

      Share.open(options)
      .then((res) => {
        this.closeModal();
      })
      .catch((err) => {
        // For debugging
        console.log(err);
      });
    }
  }

  goToChapter() {
    let { selected } = this.state;
    let selectedDetails = selected[Object.keys(selected)[0]];
    Actions.chapters({
      fromPage: 'favorites',
      bookIndex: selectedDetails.bookIndex,
      book: selectedDetails.book,
      chapter: selectedDetails.chapterName.replace(/第|章| /g, ''),
      scrollToIndex: selectedDetails.index
    })
  }

  renderList({item, index}) {
    let { favorites } = this.state;
    return (
      <TouchableOpacity key={`favorite_${index}`} onPress={()=>{this.onPressListItem(item);}}>
        <View style={[styles.sectionContent]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <Text style={[styles.sectionHeaderTxt, styles.sectionText]}>{favorites[item].book} {favorites[item].chapterName.replace(/第|章| /g, '')}:{favorites[item].index+1}</Text>
            </View>
            <TouchableOpacity style={styles.sectionMenu} onPress={()=>{this.onPressListItem(item);}}>
              <Icon style={{marginTop:0}} name="dots-vertical" size={20} color="#6F6F6F"/>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={[styles.sectionText, styles.sectionBody]}>{favorites[item].content}</Text>
          </View>
        </View>
    </TouchableOpacity>
    );
  }

  render() {
    let { favorites, renderPlaceholderOnly, selected, isFetching} = this.state;
    let selectedDetails = (selected)? selected[Object.keys(selected)[0]]: null;

    if (renderPlaceholderOnly || isFetching) {
      return (
        <CustomSpinner />
      );
    }

    return (
     <View style={styles.container}>
      {
        (!favorites || Object.keys(favorites).length==0)? (
          <Text style={styles.sectionText}>還沒有最愛經節</Text>
        ):(
          <FlatList
            ref='pageList'
            style={{width:'100%', height:'100%'}}
            data={Object.keys(favorites)}
            extraData={this.state}
            renderItem={this.renderList}
            ListFooterComponent={<View style={{height:stickyBtnHeight}}></View>}
            ListHeaderComponent={<View style={{height:headerHeight}}></View>}
            ItemSeparatorComponent={() => (
              <View style={{backgroundColor: '#fff', height:5}}></View>
            )}
            keyExtractor={(item, index) => {item}}
        />
        )
      }
      <Modal
        isVisible={this.state.modalVisible}
        backdropColor={'black'}
        backdropOpacity={0.7}
        onBackdropPress={() => {this.closeModal()}}
        supportedOrientations={['portrait', 'landscape']}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={250}
        animationOutTiming={250}
        backdropTransitionInTiming={250}
        backdropTransitionOutTiming={250}
        style={styles.modalContainer}
      >
        <View style={styles.innerContainer}>
        <TouchableOpacity style={[styles.closeBtn,{zIndex:2}]} onPress={() => {this.closeModal();}}><Icon style={{marginRight:0}} name="close-box-outline" size={30} color="#6F6F6F"/></TouchableOpacity>
          <ScrollView style={{width:'100%', height:'100%', zIndex:1}} contentContainerStyle={{justifyContent: "center", alignItems: "center"}}>
            {
              (selectedDetails)? (
                <View>
                  <View style={[styles.modalItem, styles.modalTitle]}>
                    <Icon style={{marginRight:10}} name="book-open-page-variant" size={30} color="#495057"/>
                    <Text style={[styles.sectionHeaderTxt, styles.sectionText]}>{selectedDetails.book} {selectedDetails.chapterName.replace(/第|章| /g, '')}:{selectedDetails.index+1}</Text>
                  </View>
                  <TouchableOpacity style={[styles.modalItem, styles.modalItemBtn]} onPress={() => {this.removeFromFavorites(); this.closeModal();}}>
                    <Icon style={{marginRight:10}} name="heart-off" size={25} color="#fff"/>
                    <Text style={[styles.modalItemTxt, styles.modalItemBtnTxt]}>刪除收藏</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalItem, styles.modalItemBtn]} onPress={() => {this.shareContent();}}>
                    <Icon style={{marginRight:10}} name="share-variant" size={25} color="#fff"/>
                    <Text style={[styles.modalItemTxt,styles.modalItemBtnTxt]}>分享</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalItem, styles.modalItemBtn]} onPress={() => {this.copyContent(); this.closeModal();}}>
                    <Icon style={{marginRight:10}} name="content-copy" size={25} color="#fff"/>
                    <Text style={[styles.modalItemTxt,styles.modalItemBtnTxt]}>複製</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalItem, styles.modalItemBtn]} onPress = {()=>{this.goToChapter(); this.closeModal();}}>
                    <Icon style={{marginRight:10}} name="launch" size={25} color="#fff"/>
                    <Text style={[styles.modalItemTxt,styles.modalItemBtnTxt]}>前往章節</Text>
                  </TouchableOpacity>
                </View>
              ): null
            }
          </ScrollView>
        </View>
      </Modal>
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
  sectionContent: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 5
  },
  sectionHeader: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingLeft: 15,
    paddingRight:5,
    paddingVertical: 5
  },
  sectionTitle: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '100%',
    flexDirection: 'row'
  },
  sectionMenu: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 20
  },
  sectionMenuIcon: {
    width: 20,
    resizeMode: 'contain'
  },
  heartOutlineBlock: {
    height: '100%',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartOutline: {
    width: 20,
    resizeMode: 'contain'
  },
  sectionHeaderTxt: {
    color: '#000',
    fontWeight: 'bold'
  },
  sectionBody: {
    paddingHorizontal: 20,
    marginBottom: 5
  },
  sectionText: {
    fontSize: 17
  },
  modalContainer: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: '90%',
    height: 400,
    maxHeight: '90%',
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    height: 22,
    width: 22
  },
  modalTitle: {
    marginTop: 30
  },
  modalItem: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
  },
  modalItemTxt: {
    fontSize: 18
  },
  modalItemBtn: {
    width: 200,
    height: 50,
    backgroundColor: '#3676B8',
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  modalItemBtnTxt: {
    color: '#fff'
  }
});

const mapStateToProps = (state) => {
  return {
    favorites: state.favorites
  };
};

function mapDispatchToProps (dispatch) {
  return {
    fetchFavoritesData: () => {dispatch(fetchFavoritesData());},
    removeFavorite: (selected)=>{dispatch(removeFavorite(selected));}
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);

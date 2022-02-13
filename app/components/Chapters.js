import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Clipboard,
  InteractionManager,
} from 'react-native';
import NavigationBar, { NavigationBarStyle } from './NavigationBar';
import { Actions } from 'react-native-router-flux';
import { fetchFavoritesData, removeFavorite, addFavorite } from '../actions';
import { connect } from 'react-redux';
import Modal from "react-native-modal";
import CustomSpinner from './common/CustomSpinner'
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const headerHeight = NavigationBarStyle.height;
const stickyBtnHeight = 40;
const listSeparatorHeight = 5;

// Reset this when FlatList is re-rendered
let scrollToOffsetY = 0;

class Chapters extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      bibleData: null,
      booksData: [],
      bookIndex: null,
      book: null,
      chapter: null,
      selected: null,
      listData: null,
      modalVisible: false,
      favorites: null,
      renderPlaceholderOnly: true,
      scrollToIndex: 0
    };
    this.renderNavBar = this.renderNavBar.bind(this);
    this.ScrollViewToTop = this.ScrollViewToTop.bind(this);
    this.ScrollToOffset = this.ScrollToOffset.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onPressSectionItem = this.onPressSectionItem.bind(this);
    this.addToFavorites = this.addToFavorites.bind(this);
    this.removeFromFavorites = this.removeFromFavorites.bind(this);
    this.copyContent = this.copyContent.bind(this);
    this.renderNavRightComp = this.renderNavRightComp.bind(this);
    this.onPressNextChapter = this.onPressNextChapter.bind(this);
    this.onPressPrevChapter = this.onPressPrevChapter.bind(this);
    this.refreshNavBar = this.refreshNavBar.bind(this);
    this.renderList = this.renderList.bind(this);
    this.shareContent = this.shareContent.bind(this);
  }

  componentWillMount() {}

  componentWillUnmount() {
    scrollToOffsetY=0;
  }

  componentDidMount() {
    let { fetchFavoritesData, bookIndex, book, chapter, scrollToIndex, favorites, bible, books } = this.props;
    let chapterName = `第 ${chapter} 章`;

    fetchFavoritesData();

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        bookIndex: bookIndex,
        book: book,
        chapter:chapter,
        favorites: favorites.data,
        listData: bible.data[book][chapterName],
        scrollToIndex: scrollToIndex,
        booksData: books.data,
        bibleData: bible.data
      }, ()=>{
        this.refreshNavBar();
        this.setState({ renderPlaceholderOnly: false });
        if(scrollToIndex) {
          setTimeout(()=>{
            console.log('componentDidMount scrollToOffsetY: ' + scrollToOffsetY);
            this.ScrollToOffset(scrollToOffsetY);
          }, 1000);
        }
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    let { bible } = this.props;
    let favorites = nextProps.favorites.data;
    let chapterName = `第 ${nextProps.chapter} 章`;

    if (nextProps.book==this.state.book && nextProps.chapter==this.state.chapter && nextProps.scrollToIndex==this.state.scrollToIndex) {
      // back
      this.setState({
        favorites: favorites
      });
    } else {
      // reset to force re-render FlatList to get scroll height
      this.setState({
        listData: []
      },()=>{
        this.setState({
          bookIndex: nextProps.bookIndex,
          book: nextProps.book,
          chapter:nextProps.chapter,
          favorites: favorites,
          listData: bible.data[nextProps.book][chapterName],
          scrollToIndex: nextProps.scrollToIndex
        }, ()=>{
          setTimeout(()=>{
            console.log('componentWillReceiveProps scrollToOffsetY: ' + scrollToOffsetY);
            this.ScrollToOffset(scrollToOffsetY);
          }, 1000);
        });
      });
    }
  }

  refreshNavBar() {
    const navBarConfig = {
      hideNavBar: false,
      navBar: this.renderNavBar,
    };
    Actions.refresh(navBarConfig);
  }

  renderNavBar() {
    let {book, chapter} = this.props;
    let title = `${book} 第${chapter}章`;
    return (
      <NavigationBar
        back={true}
        title={title}
        titleStyle = {styles.titleStyle}
        rightComponent={this.renderNavRightComp()}
      />
    );
  }

  renderNavRightComp() {
    let { booksData } = this.state;
    let { bookIndex, chapter, scrollToIndex } = this.props;
    let lastBookIndex = booksData.length-1;
    let lastChapter = booksData[lastBookIndex].chapterNum;
    console.log('renderNavRightComp bookIndex: chapter: '+ bookIndex + ':' + chapter);
    return (
      <View style={styles.navRightCompBlock}>
        {
          (bookIndex==0 && chapter==1)? null
          : (
          <TouchableOpacity style={styles.navRightBtn} onPress={()=>{this.onPressPrevChapter();}}>
            <Icon style={{marginRight:0}} name="arrow-left" size={20} color="#fff"/>
          </TouchableOpacity>
          )
        }
        {
          (bookIndex==lastBookIndex && chapter==lastChapter)? null
          : (
            <TouchableOpacity style={styles.navRightBtn} onPress={()=>{this.onPressNextChapter();}}>
              <Icon style={{marginRight:0}} name="arrow-right" size={20} color="#fff"/>
            </TouchableOpacity>
          )
        }
      </View>
    );
  }

  onPressNextChapter() {
    let { bookIndex, chapter, booksData } = this.state;
    let nextBookIndex = bookIndex;
    let nextChapter = chapter;
    if(Number(chapter) < Number(booksData[bookIndex].chapterNum)) {
      nextChapter = Number(nextChapter) + 1;
    } else {
      nextBookIndex = Number(nextBookIndex) + 1;
      nextChapter=1;
    }
    scrollToOffsetY=0;
    Actions.refresh({bookIndex: nextBookIndex, book: booksData[nextBookIndex].name, chapter: nextChapter, scrollToIndex: 0});
    this.ScrollViewToTop();
  }

  onPressPrevChapter() {
    let { bookIndex, chapter, booksData } = this.state;
    let prevBookIndex = bookIndex;
    let prevChapter = chapter;
    if(Number(chapter) > 1) {
      prevChapter = Number(prevChapter) - 1;
    } else {
      prevBookIndex = Number(prevBookIndex) - 1;
      prevChapter=booksData[prevBookIndex].chapterNum;
    }
    scrollToOffsetY=0;
    Actions.refresh({bookIndex: prevBookIndex, book: booksData[prevBookIndex].name, chapter: prevChapter, scrollToIndex: 0});
    this.ScrollViewToTop();
  }

  openModal() {
    this.setState({modalVisible:true});
  }

  closeModal() {
    this.setState({modalVisible:false});
  }

  ScrollViewToTop() {
    this.refs.pageList.scrollToOffset({offset: 0, animated: false});
  }

  ScrollToOffset(py) {
    this.refs.pageList.scrollToOffset({offset: py, animated: true });
  }

  onPressSectionItem(id, bookIndex, book, chapterName, index, content) {
    this.openModal();
    let selected = {};
    selected[id]= {
      bookIndex: bookIndex,
      book: book,
      chapterName: chapterName,
      index: index,
      content: content
    };
    this.setState({selected: selected});
  }

  addToFavorites(){
    let { selected } = this.state;
    let { addFavorite } = this.props;
    addFavorite(selected);
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

  removeFromFavorites() {
    let { selected } = this.state;
    let { removeFavorite } = this.props;
    removeFavorite(selected);
  }

  renderList({item, index}) {
    let { bookIndex, book, chapter, favorites, scrollToIndex } = this.state;
    let chapterName = `第 ${chapter} 章`;

    return (
      <TouchableOpacity
        onLayout={(event)=>{
          let layout = event.nativeEvent.layout;
          console.log('layout: ' + index +':'+  JSON.stringify(layout));
          if(scrollToIndex && scrollToIndex > index) {
            scrollToOffsetY = scrollToOffsetY + layout.height + listSeparatorHeight;
          }
        }}
        key={`itemId_${item.id}`}
        style={styles.listItemBlock} onPress={()=>{this.onPressSectionItem(item.id, bookIndex, book, chapterName, index, item.content)}}
      >
        <View style={styles.sectionNum}>
          <Text style={styles.sectionNumTxt}>{index+1}</Text>
          {
            (favorites && favorites.hasOwnProperty(item.id))? (
              <Icon style={{margin:0}} name="heart" size={15} color="#c82828"/>
            ):null
          }
        </View>
        <View style={[styles.sectionContent]}>
          <Text style={styles.sectionText}>{item.content}</Text>
        </View>
        <TouchableOpacity style={styles.sectionMenu} onPress={()=>{this.onPressSectionItem(item.id, bookIndex, book, chapterName, index, item.content)}}>
          <Icon style={{margin:10}} name="dots-vertical" size={20} color="#6F6F6F"/>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  render() {
    let { booksData, bibleData, listData, bookIndex, book, chapter, favorites, selected, renderPlaceholderOnly, scrollToIndex } = this.state;
    let selectedDetails = (selected)? selected[Object.keys(selected)[0]]: null;

    if (renderPlaceholderOnly ||
        booksData.length==0 ||
        bibleData==null ||
        listData==null) {
      return (
        <CustomSpinner />
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          initialNumToRender = {200}
          ref='pageList'
          style={{width:'100%', height:'100%'}}
          data={listData}
          extraData={this.state}
          renderItem={this.renderList}
          ListFooterComponent={<View style={{height:stickyBtnHeight}}></View>}
          ListHeaderComponent={<View style={{height:headerHeight}}></View>}
          ItemSeparatorComponent={() => (
            <View style={{backgroundColor: '#fff', height: listSeparatorHeight}}></View>
          )}
          removeClippedSubviews={false}
          keyExtractor={(item, index) => item.id}
        />
        <View style={styles.stickyFooterBlock}>
          <View style={styles.stickyFooterButton}>
            <TouchableOpacity style={styles.stickyFooterButtonBlock} onPress = {()=>{
              scrollToOffsetY=0;
              try{
                Actions.popTo('pickbookchapter');
                setTimeout(()=>{
                  Actions.refresh({from: 'chapters', selectedBookIndex: bookIndex, selectedChapter: chapter, selectedSection: scrollToIndex});
                }, 100);
              } catch(err){
                Actions.pickbookchapter({from: 'chapters', selectedBookIndex: bookIndex, selectedChapter: chapter, selectedSection: scrollToIndex});
              }
            }}>
              <Icon style={{marginRight:0}} name="launch" size={25} color="#fff"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.stickyFooterButtonBlock} onPress = {()=>{
              scrollToOffsetY=0;
              try{
                Actions.popTo('search');
                setTimeout(()=>{
                  Actions.refresh({from: 'chapters', searchBookIndex: bookIndex});
                }, 100);
              } catch(err){
                Actions.search({from: 'chapters', searchBookIndex: bookIndex});
              }
            }}>
              <Icon style={{marginRight:0}} name="magnify" size={25} color="#fff"/>
            </TouchableOpacity>
          </View>
          </View>
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
            <TouchableOpacity style={[styles.closeBtn, {zIndex:2}]} onPress={() => {this.closeModal();}}><Icon style={{marginRight:0}} name="close-box-outline" size={30} color="#6F6F6F"/></TouchableOpacity>
            <ScrollView style={{width:'100%', height:'100%', zIndex:1}} contentContainerStyle={{justifyContent: "center", alignItems: "center"}}>
              {
                (selectedDetails)? (
                  <View style={[styles.modalTitle, styles.modalItem]}>
                    <Icon style={{marginRight:10}} name="book-open-page-variant" size={30} color="#495057"/>
                    <Text style={styles.modalItemTxt}>{`${selectedDetails.book} ${selectedDetails.chapterName} 第 ${selectedDetails.index+1} 節`}</Text>
                  </View>
                ): null
              }
              {
                favorites && selected && favorites.hasOwnProperty(Object.keys(selected)[0])? (
                  <TouchableOpacity style={[styles.modalItem, styles.modalItemBtn]} onPress={() => {this.removeFromFavorites(); this.closeModal();}}>
                    <Icon style={{marginRight:10}} name="heart-off" size={25} color="#fff"/>
                    <Text style={[styles.modalItemTxt, styles.modalItemBtnTxt]}>刪除收藏</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={[styles.modalItem, styles.modalItemBtn]} onPress={() => {this.addToFavorites(); this.closeModal();}}>
                    <Icon style={{marginRight:10}} name="heart" size={25} color="#fff"/>
                    <Text style={[styles.modalItemTxt, styles.modalItemBtnTxt]}>加入收藏</Text>
                  </TouchableOpacity>
                )
              }
              <TouchableOpacity style={[styles.modalItem, styles.modalItemBtn]} onPress={() => {this.shareContent();}}>
                <Icon style={{marginRight:10}} name="share-variant" size={25} color="#fff"/>
                <Text style={[styles.modalItemTxt,styles.modalItemBtnTxt]}>分享</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalItem, styles.modalItemBtn]} onPress={() => {this.copyContent(); this.closeModal();}}>
                <Icon style={{marginRight:10}} name="content-copy" size={25} color="#fff"/>
                <Text style={[styles.modalItemTxt,styles.modalItemBtnTxt]}>複製</Text>
              </TouchableOpacity>
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
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5'
  },
  titleStyle: {
    textAlign:'right',
    color: '#000',
    fontSize: 15,
    marginLeft: 0,
    width: '100%'
  },
  listItemBlock: {
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 0,
    paddingHorizontal: 5,
    paddingVertical: 0
  },
  sectionNum: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 0.1,
    paddingVertical: 3,
  },
  sectionContent: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 10,
    flex:0.85
  },
  sectionMenu: {
    flex: 0.05,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  sectionMenuIcon: {
    width: 20,
    resizeMode: 'contain'
  },
  sectionNumTxt: {
    fontSize: 13,
    textAlign: 'center',
    width: '100%'
  },
  sectionText: {
    fontSize: 17
  },
  stickyFooterBlock: {
    backgroundColor: '#3676B8',
    position: "absolute",
    left: 0,
    bottom: 0,
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: "center",
    alignItems: "center",
    height: stickyBtnHeight,
    width: "100%",
    opacity: 1,
  },
  stickyFooterButtonBlock: {
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: '100%',
    flex: 0.5
  },
  stickyFooterButton: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 25
  },
  stickyFooterButtonTxt: {
    color: "#FFF",
    fontSize: 12,
    textAlign:'center'
  },
  menuItemIcon: {
    height: 28,
    resizeMode: 'contain'
  },
  modalContainer: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerContainer: {
    width: '90%',
    height: 350,
    backgroundColor: "#fff",
    padding: 20,
    borderColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: 'center',
    alignItems: 'center'
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalItemTxt: {
    fontSize: 18
  },
  modalItemBtn: {
    width: 200,
    height: 50,
    backgroundColor: '#3676B8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  modalItemBtnTxt: {
    color: '#fff'
  },
  heartIcon: {
    height: 16,
    width: 16
  },
  copyIcon: {
    height: 30,
    width: 30,
    marginRight: 10
  },
  heartIconBig: {
    height: 30,
    width: 30,
    marginRight: 10
  },
  navRightCompBlock: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center"
  },
  navRightBtn: {
    marginLeft: 10,
    backgroundColor: '#3676B8',
    padding: 5,
    borderRadius: 2,
    elevation: 1,
    width: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  navRightBtnTxt: {
    fontSize: 12,
    color: '#fff'
  }
});

const mapStateToProps = (state) => {
  return {
    books: state.books,
    bible: state.bible,
    favorites: state.favorites
  };
};

function mapDispatchToProps (dispatch) {
  return {
    fetchFavoritesData: () => {dispatch(fetchFavoritesData());},
    addFavorite: (selected)=>{dispatch(addFavorite(selected));},
    removeFavorite: (selected)=>{dispatch(removeFavorite(selected));}
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Chapters);

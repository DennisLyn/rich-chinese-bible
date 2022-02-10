import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { 
  ListView, 
  View, 
  Text, 
  TouchableHighlight, 
  StyleSheet, 
  Image,
  Dimensions,
  InteractionManager,
  FlatList, // performace is bad for large data like 1000+
  TextInput,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  ActivityIndicator,
  Picker,
  Platform
} from 'react-native';
import NavigationBar, { NavigationBarStyle } from './NavigationBar';
import { 
  searchByKeyword, 
  fetchBooksData, 
  fetchFavoritesData, 
  removeFavorite, 
  addFavorite,
  fetchSearchHistoryData,
  addSearchHistory,
  removeSearchHistory
} from '../actions';
import { Actions } from 'react-native-router-flux';
import CustomSpinner from './common/CustomSpinner'
import {Input} from './common/Input';
import Modal from "react-native-modal";
import Share, {ShareSheet, Button} from 'react-native-share';
// import SearchBar from 'react-native-searchbar'
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressiveImage from "./common/ProgressiveImage";
import Highlighter from 'react-native-highlight-words';

const { width, height } = Dimensions.get('window');
const sectionMenu = require("../img/menu-vertical.png");
const headerHeight = NavigationBarStyle.height;
const closeIcon = require("../img/icon-close.png");
const heartIcon = require("../img/heartIcon.png");
const listPageRecodeNum = 10;
const maxSearchHistoryNum = 50;

class Search extends PureComponent { 
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.searchHistory = this.props.search.searchHistory;
    this.state = {
      keyword: '',
      searchData: [],
      searchResult: [],
      listDataSource: ds.cloneWithRows([]),
      listData: [],
      loadPageIndex: null,
      renderPlaceholderOnly: true,
      showLoading: false,
      message: null,
      modalVisible: false,
      selected: null,
      favorites: null,
      fromPage: this.props.from,
      // searchBookIndex: this.props.searchBookIndex,
      searchBookIndex: null,
      booksData: this.props.books.data
    };
    this.renderNavBarWithBack = this.renderNavBarWithBack.bind(this);
    this.renderNavBarWithOutBack = this.renderNavBarWithOutBack.bind(this);
    this.onSubmitKeyword = this.onSubmitKeyword.bind(this);
    this.renderListHeader = this.renderListHeader.bind(this);
    this.renderListFooter = this.renderListFooter.bind(this);
    this.renderList = this.renderList.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onPressSectionItem = this.onPressSectionItem.bind(this);
    this.addToFavorites = this.addToFavorites.bind(this);
    this.removeFromFavorites = this.removeFromFavorites.bind(this);
    this.copyContent = this.copyContent.bind(this);
    this.goToChapter = this.goToChapter.bind(this);
    this.addRecords = this.addRecords.bind(this);
    this.onScrollHandler = this.onScrollHandler.bind(this);
    this.deleteKeyWord = this.deleteKeyWord.bind(this);
    this.onPressSearchHistoryKeyword = this.onPressSearchHistoryKeyword.bind(this);
    this.onPressDeletehHistoryKeyword = this.onPressDeletehHistoryKeyword.bind(this);
  }

  componentWillMount() {
    let { fetchSearchHistoryData } = this.props;
    fetchSearchHistoryData();
  }
  
  componentDidMount() {
    let {from} = this.props;
    let navBar = this.renderNavBarWithBack;

    if(from=='sideMenu') {
      navBar=this.renderNavBarWithOutBack;
    }
    const navBarConfig = {
      hideNavBar: false,
      navBar: navBar,
    };

    Actions.refresh(navBarConfig);

    let { fetchFavoritesData, searchBookIndex } = this.props;
    let { listDataSource } = this.state;
    
    fetchFavoritesData();
    
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        searchBookIndex: searchBookIndex,
        listData: this.searchHistory,
        listDataSource: listDataSource.cloneWithRows(JSON.parse(JSON.stringify(this.searchHistory))), // hard copy
        renderPlaceholderOnly: false
      });
    });
  }

  renderNavBarWithBack() {
    let { fromPage, searchBookIndex, booksData } = this.state;
    let searchBook = (searchBookIndex!=null)? booksData[searchBookIndex].name: null;
    return (
      <NavigationBar
        menu={true}
        back={true} 
        title={`搜尋`}
      />
    );
  }

  renderNavBarWithOutBack() {
    let { fromPage, searchBookIndex, booksData } = this.state;
    let searchBook = (searchBookIndex!=null)? booksData[searchBookIndex].name: null;
    return (
      <NavigationBar
        menu={true}
        title={`搜尋`}
      />
    );
  }

  componentWillReceiveProps(nextProps) {
    let searchData = nextProps.search.data;
    this.searchHistory = nextProps.search.searchHistory;
    let searchBookIndex = nextProps.searchBookIndex;
    let { keyword } = this.state;
    
    if(searchData.length!==0 && this.state.searchData.length==0) {
      this.setState({searchData: searchData});
    }
    
    if(this.props.searchBookIndex!= searchBookIndex) {
      this.deleteKeyWord();
      this.setState({searchBookIndex: searchBookIndex}, ()=>{
        if(keyword.trim()){
          
          // this.onSubmitKeyword();
        }
      });
    }
    
    let favorites = nextProps.favorites.data;
    this.setState({favorites: favorites});
  }

  openModal() {
    this.setState({modalVisible:true});
  }

  closeModal() {
    this.setState({modalVisible:false});
  }

  addToFavorites(){
    let { selected } = this.state;
    let { addFavorite } = this.props;
    addFavorite(selected);
    this.setState({
      // make list re-render
      listDataSource: this.state.listDataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.listData)))
    });
  }

  removeFromFavorites() {
    let { selected } = this.state;
    let { removeFavorite } = this.props;
    removeFavorite(selected);
    this.setState({
      // make list re-render
      listDataSource: this.state.listDataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.listData)))
    });
  }

  copyContent() {
    let { selected } = this.state;
    let content = '';
    if(selected) {
      let selectedDetails = selected[Object.keys(selected)[0]];
      content = `${selectedDetails.book} ${selectedDetails.chapterName} 第 ${selectedDetails.index+1} 節 : ${selectedDetails.content}`;
    }
    // console.log('copy content: ' + content);
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
        console.log(res);
        this.closeModal();
      })
      .catch((err) => { 
        console.log(err); 
      });
    }
  }

  goToChapter() {
    let { selected, fromPage } = this.state;
    let selectedDetails = selected[Object.keys(selected)[0]];
    // console.log('goToChapter selectedDetails: ' + JSON.stringify(selectedDetails));
   
    if(fromPage==='chapters') {
      Actions.pop({refresh:{
        bookIndex: selectedDetails.bookIndex, 
        book: selectedDetails.book, 
        chapter: selectedDetails.chapterName,
        scrollToIndex: selectedDetails.index
      }})
    } else {

      try{
        Actions.popTo('chapters');
        setTimeout(()=>{
          Actions.refresh({
            bookIndex: selectedDetails.bookIndex, 
            book: selectedDetails.book, 
            chapter: selectedDetails.chapterName,
            scrollToIndex: selectedDetails.index,
            // type: 'replace'
          });
        },100);
      } catch(err) {
        Actions.chapters({
          bookIndex: selectedDetails.bookIndex, 
          book: selectedDetails.book, 
          chapter: selectedDetails.chapterName,
          scrollToIndex: selectedDetails.index,
          // type: 'replace'
        });
      }

      /*Actions.chapters({
        bookIndex: selectedDetails.bookIndex, 
        book: selectedDetails.book, 
        chapter: selectedDetails.chapterName,
        scrollToIndex: selectedDetails.index,
        // type: 'replace'
      })*/
    }
  }

  onPressSectionItem(id, bookName, chapter, section, content) {
    let { books } = this.props;
    let index = Number(section.replace(/第|節| /g, ''))-1;
    let chapterName = chapter.replace(/第|章| /g, '');
    let bookIndex=-1;

    books.data.map((book, index)=>{
      if(book.name==bookName) {
        bookIndex=index;
      }
    });    
    // console.log('book: ' + bookName + 'bookIndex: ' + bookIndex + 'books length: ' + books.data.length);
    this.openModal();
    if(bookIndex!=-1) {
      let selected = {};
      selected[id]= {
        bookIndex: bookIndex,
        book: bookName,
        chapterName: chapterName,
        index: index,
        content: content 
      };
      this.setState({selected: selected}, ()=>{
        // console.log("select: " + JSON.stringify(this.state.selected));
      });
    }
  }

  onSubmitKeyword() {
    let { keyword, showLoading, listDataSource, searchBookIndex, booksData } = this.state;
    let searchBook = (searchBookIndex!=null)? booksData[searchBookIndex].name: null;
    let { searchByKeyword, addSearchHistory } = this.props;

    if(keyword.trim()) {
      //Reset first
      this.setState({
        showLoading: true, 
        message: null,
        searchResult: [],
        listData: [],
        loadPageIndex: null, 
        listDataSource: listDataSource.cloneWithRows([])
      }, ()=>{
        searchByKeyword(keyword, searchBook, (searchResult)=>{
          let message = '';
          if(searchResult.length==0) {
            message = '沒有搜尋結果';
          } else {
            message = '搜尋結果: ' + searchResult.length + ' 經節'
            this.addRecords(0, searchResult);
          }
          // console.log('searchResult: ' + JSON.stringify(searchResult));
          this.setState({ searchResult: searchResult, message: message }, ()=>{
            // console.log('search this.state.searchResult: ' + JSON.stringify(this.state.searchResult));
            // this.addRecords(0, searchResult);
            this.setState({showLoading: false});
          });
        });
      });

      addSearchHistory(keyword);
    }
  }

  deleteKeyWord() {
    // Reset
    this.setState({
      keyword: '',
      searchResult: [],
      listData: this.searchHistory,
      listDataSource: this.state.listDataSource.cloneWithRows(JSON.parse(JSON.stringify(this.searchHistory))), // hard copy
      message: null,
      loadPageIndex: null
    });
  }

  onScrollHandler() {
    let { searchResult, loadPageIndex } = this.state; 
    if(searchResult.length>0) {
      let totalPages = ((searchResult.length/listPageRecodeNum)> Math.floor(searchResult.length/listPageRecodeNum))? (Math.floor(searchResult.length/listPageRecodeNum) + 1): Math.floor(searchResult.length/listPageRecodeNum);     
      if(loadPageIndex<(totalPages-1)) {
        this.addRecords(loadPageIndex+1, searchResult);
      }
    }
  }

  addRecords(pageIndex, searchData) {
    let { listData, listDataSource, loadPageIndex } = this.state;
    if(searchData.length>0 && pageIndex!=loadPageIndex) {
      let totalPages = ((searchData.length/listPageRecodeNum)> Math.floor(searchData.length/listPageRecodeNum))? (Math.floor(searchData.length/listPageRecodeNum) + 1): Math.floor(searchData.length/listPageRecodeNum);     
      // console.log('totalPages: ' + totalPages);
      // console.log('pageIndex: loadPageIndex: ' + pageIndex + ' : ' + loadPageIndex);
      let rStartIndex, rEndIndex;
      let newData=null;
    
      if (pageIndex< (totalPages-1)) {
        rStartIndex = pageIndex * listPageRecodeNum;
        rEndIndex = rStartIndex + listPageRecodeNum;
        newData = searchData.slice(rStartIndex, rEndIndex);
      } else if (pageIndex == (totalPages-1)) {
        rStartIndex = pageIndex * listPageRecodeNum;
        newData = searchData.slice(rStartIndex);
      }
      
      let newListData = listData.concat(newData);

      this.setState({
        listDataSource: listDataSource.cloneWithRows(newListData),
        listData: newListData,
        loadPageIndex : pageIndex
      }, ()=>{
        // console.log('listData length: ' + this.state.listData.length);
      });
    }
  }
  
  onPressSearchHistoryKeyword(keyword) {
    this.setState({
      keyword: keyword
    }, ()=>{
      this.onSubmitKeyword();
    });
  }

  onPressDeletehHistoryKeyword(keyword) {
    let { listDataSource } = this.state;
    let { removeSearchHistory } = this.props;
    removeSearchHistory(keyword);
    console.log('this.searchHistory: ' + JSON.stringify(this.searchHistory));
    this.setState({
      listData: this.searchHistory,
      listDataSource: listDataSource.cloneWithRows(JSON.parse(JSON.stringify(this.searchHistory))), // hard copy
    });
  }

  renderListHeader() {
    let { message, searchBookIndex, booksData, searchResult } = this.state;
    let searchBook = (searchBookIndex!=null)? booksData[searchBookIndex].name: null;
    let bookPickerList = [];
    bookPickerList.push(<Picker.Item label={`全書`} value={null} key={`bookPickItem_${null}`}/>);
    booksData.map((item, index) => {
      bookPickerList.push(<Picker.Item label={item.name} value={index} key={`bookPickItem_${index}`}/>);
    });
    let showSearchHistory = (searchResult.length==0 && message==null)? true: false;
    return(
      <View style={styles.listHeader}>
        <View style={{height:headerHeight}}></View>
        <View style={styles.searchBarBlock}>
          <View style={styles.searchBar}>
            <Icon style={styles.searchIcon} name="magnify" size={30} color="#495057" onPress={()=>{this.onSubmitKeyword();}}/>
            <TextInput
              underlineColorAndroid="transparent"
              placeholder="輸入關鍵字"
              autoCorrect={false}
              style={styles.input}
              value={this.state.keyword}
              multiline={false}
              autoFocus={false}
              blurOnSubmit={false}
              maxLength={30}
              returnKeyType='search'
              onChangeText={(keyword)=>{
                this.setState({keyword: keyword});
              }}
              onSubmitEditing={()=>{
                this.onSubmitKeyword();
              }}
            />
            <Icon style={styles.inputDelete} name="close-circle" size={20} color="#495057" onPress={()=>{
              this.deleteKeyWord();
            }}/>
          </View>
        </View>
        <View style={styles.pickerBlock}>
          <View style={styles.pickerBar}>
              <Icon style={styles.pickerIcon} name="book-open-page-variant" size={30} color="#495057" />
              <View style={styles.pickerStyle}>
                <Picker
                  itemStyle={styles.iOSItemStyle}
                  selectedValue={searchBookIndex}
                  onValueChange={(bookIndex)=>{
                    this.setState({
                      searchBookIndex: bookIndex
                    }, ()=>{
                      this.onSubmitKeyword();
                    })
                  }}>
                {bookPickerList}
              </Picker>
            </View>
          </View>
        </View>
        {
          (message)? (
            <View style={styles.resultMsgBlock}><Text style={styles.resultMsgTxt}>{message}</Text></View>
          ):null
        }
        {
          (showSearchHistory && this.searchHistory.length>0)? (
            <View style={styles.resultMsgBlock}><Text style={styles.resultMsgTxt}>歷史搜尋</Text></View>
          ):null
        }
      </View>
    );
  }

  renderListFooter() {
    let { searchResult, loadPageIndex } = this.state;
    let totalPages = ((searchResult.length/listPageRecodeNum)> Math.floor(searchResult.length/listPageRecodeNum))? (Math.floor(searchResult.length/listPageRecodeNum) + 1): Math.floor(searchResult.length/listPageRecodeNum);       
    return (
      <View style={styles.listFooter}>
        {
          (searchResult.length>0 && loadPageIndex<(totalPages-1))? (
            <ActivityIndicator size="small"/>
          ):null
        }
      </View>
    );
  }

  renderList(item, sectionId, rowId) {
    let { keyword, favorites, searchResult, message } = this.state;
    let showSearchHistory = (searchResult.length==0 && message==null)? true: false;

    if(showSearchHistory) {
      // Show search history
      return(
        <View style={[styles.sectionContent]} key={`history_${rowId}`}>
          <View style={styles.searchHistoryItem}>
            <TouchableOpacity style={styles.searchHistoryKeywordBlock} onPress={()=>{
              this.onPressSearchHistoryKeyword(item);
            }}>
              <Icon style={[{minWidth: 20, marginLeft: 10}]} name="magnify" size={20} color="#495057"/>
              <Text style={[styles.sectionText, styles.sectionBody]}>
                {item}
              </Text>
            </TouchableOpacity>
            <Icon style={styles.inputDelete} name="close-circle" size={20} color="#495057" onPress={()=>{
              this.onPressDeletehHistoryKeyword(item);
            }}/>
          </View>
        </View>
      );
    } else {
      // show search result
      return(
        <TouchableOpacity key={`searchResult_${rowId}`} onPress={()=>{
          this.onPressSectionItem(item.id, item.book, item.chapter, item.section, item.content);
        }}>
          <View style={[styles.sectionContent]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitle}>
                {/*<Text style={[styles.sectionHeaderTxt, styles.sectionText]}>{Number(rowId)+1}.</Text>*/}
                <Text style={[styles.sectionHeaderTxt, styles.sectionText]}>{item.book} {item.chapter.replace(/第|章| /g, '')}:{item.section.replace(/第|節| /g, '')}</Text>
                {
                  (favorites && favorites.hasOwnProperty(item.id))? (
                    <Icon style={{marginLeft:10}} name="heart" size={20} color="#c82828"/>
                  ):null
                }
              </View>
              <TouchableOpacity style={styles.sectionMenu} onPress={()=>{
                this.onPressSectionItem(item.id, item.book, item.chapter, item.section, item.content);
              }}>
                <Icon style={{marginTop:0}} name="dots-vertical" size={20} color="#6F6F6F"/>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={[styles.sectionText, styles.sectionBody]}>
                <Highlighter
                  highlightStyle={{backgroundColor: 'yellow'}}
                  searchWords={[keyword]}
                  textToHighlight={item.content}
                />
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }

  render() {
    let { searchData, renderPlaceholderOnly, showLoading, searchResult, listData, listDataSource,message, selected, favorites } = this.state;
    let selectedDetails = (selected)? selected[Object.keys(selected)[0]]: null;

    if (renderPlaceholderOnly || this.props.search.isFetching || showLoading) {
      return (
        <CustomSpinner />
      );
    }

    return (
      <View style={styles.container}>
        <ListView
          style={{width:'100%', height:'100%'}}
          dataSource={listDataSource}
          keyboardShouldPersistTaps='handled'
          renderHeader={this.renderListHeader}
          renderFooter={this.renderListFooter}
          renderRow={this.renderList}
          stickySectionHeadersEnabled = {true}
          stickyHeaderIndices={[0]}
          enableEmptySections={true}
          renderSeparator={() => (
            <View style={{backgroundColor: '#fff', height:1}}></View>
          )}
          onEndReached={()=>{
            this.onScrollHandler();
          }}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          pageSize={listPageRecodeNum}
        />
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
                    <Text style={styles.modalItemTxt}>{`${selectedDetails.book} ${selectedDetails.chapterName} 第 ${Number(selectedDetails.index)+1} 節`}</Text>
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
              <TouchableOpacity style={[styles.modalItem, styles.modalItemBtn]} onPress = {()=>{this.goToChapter(); this.closeModal();}}>
                <Icon style={{marginRight:10}} name="launch" size={25} color="#fff"/>
                <Text style={[styles.modalItemTxt,styles.modalItemBtnTxt]}>前往章節</Text>
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
    height: '100%',
    width: '100%',
    backgroundColor: '#f5f5f5'
  },
  listHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#f5f5f5'
  },
  searchBarBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#3676B8',
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 10,
  },
  searchBar: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 40
  },
  searchIcon: {
    padding: 10,
    flex: 0.1
  },
  input: {
    backgroundColor: '#fff',
    color: '#424242',
    width: '100%',
    height: '100%',
    flex: 0.8,
    fontSize: 17,
    padding: 0,
    margin: 0,
    borderWidth: 0
  },
  inputDelete: {
    paddingLeft: 5,
    flex: 0.1
  },
  resultMsgBlock: {
    width: width,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f5f5f5'
  },
  resultMsgTxt: {
    fontSize: 17,
    color: '#000'
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
  sectionBody: {
    paddingHorizontal: 20,
    marginBottom: 5
  },
  sectionText: {
    fontSize: 17
  },
  sectionHeaderTxt: {
    color: '#000',
    fontWeight: 'bold'
  },
  sectionBody: {
    paddingHorizontal: 20,
    marginBottom: 5
  },
  listFooter: {
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  footerTxt: {
    fontSize: 17,
    color: '#000'
  },
  modalContainer: {
    margin: 0,
    justifyContent: 'center', 
    alignItems: 'center'
  },
  innerContainer: {
    width: '90%',
    height: 400,
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
  pickerBlock: {
    width: '100%',
    backgroundColor: '#3676B8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 10,
  },
  pickerBar: {
    height: (Platform.OS == "android") ? 45 : 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: (Platform.OS == "android") ? '#fff' : '#D8D8D8',
    paddingHorizontal: 10,
    borderRadius: (Platform.OS == "android") ? 40 : 10,
  },
  pickerTitle: {
    fontSize: 17,
    flex: 0.1,
    color: '#000',
    width: '100%'
  },
  pickerIcon: {
    flex: 0.1,
    padding: 10
  },
  pickerStyle: {
    flex: 0.9,
    width: '90%',
    backgroundColor: 'transparent',
    width: '100%',
    height: (Platform.OS == "android") ? 45 : 100,
    padding: 0,
    margin: 0,
    borderWidth: 0
  },
  //For ios only
  iOSItemStyle: {
    color: '#000',
    fontSize: 15,
    height: 100,
    width: '100%'
  },
  searchHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  searchHistoryKeywordBlock: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 0.9
  }
});

const mapStateToProps = (state) => {
  return {
    search: state.search,
    books: state.books,
    bible: state.bible, 
    favorites: state.favorites
  };
};

function mapDispatchToProps (dispatch) {
  return {
    searchByKeyword: (keyword, book, cb)=>{dispatch(searchByKeyword(keyword, book, cb))},
    fetchFavoritesData: () => {dispatch(fetchFavoritesData());},
    addFavorite: (selected)=>{dispatch(addFavorite(selected));},
    removeFavorite: (selected)=>{dispatch(removeFavorite(selected));},
    fetchSearchHistoryData: ()=>{dispatch(fetchSearchHistoryData());},
    addSearchHistory: (keyword)=>{dispatch(addSearchHistory(keyword));},
    removeSearchHistory: (keyword)=>{dispatch(removeSearchHistory(keyword));},
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
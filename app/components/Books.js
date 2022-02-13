import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  InteractionManager
} from 'react-native';
import NavigationBar, { NavigationBarStyle } from './NavigationBar';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import CustomSpinner from './common/CustomSpinner'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const headerHeight = NavigationBarStyle.height;
const stickyBtnHeight = 0;
class Books extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      books: null,
      booksData: [],
      renderPlaceholderOnly: true
    };
    this.renderNavBar = this.renderNavBar.bind(this);
    this.renderList = this.renderList.bind(this);
  }

  componentWillMount() {}

  componentDidMount() {
    const navBarConfig = {
      hideNavBar: false,
      navBar: this.renderNavBar,
    };
    Actions.refresh(navBarConfig);
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        renderPlaceholderOnly: false
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    let books = nextProps.books;
    if(books.data.length!==0 && this.state.booksData.length==0){
      this.setState({books: books, booksData: books.data });
    }
  }

  renderNavBar() {
    return (
      <NavigationBar
        menu={true}
        title="新舊約全書"
        titleStyle = {styles.titleStyle}
        rightComponent={this.renderNavRightComp()}
      />
    );
  }

  renderNavRightComp() {
    return (
      <View style={styles.navRightCompBlock}>
        <TouchableOpacity style={styles.navRightBtn} onPress = {()=>{
          Actions.pickbookchapter({from: 'books'});
        }}>
          <Icon style={{marginRight:0}} name="launch" size={20} color="#fff"/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navRightBtn} onPress = {()=>{
          Actions.search({from: 'books', searchBookIndex: null});
        }}>
          <Icon style={{marginRight:0}} name="magnify" size={20} color="#fff"/>
        </TouchableOpacity>
      </View>
    );
  }

  renderList({item, index}) {
    return (
      <TouchableOpacity
        key={`book_${index}`}
        style={[styles.listItemBlock, {backgroundColor: (index<=38)? '#f5f5f5':'#EFF7FC'}]}
        onPress={()=>{ Actions.chapters({bookIndex: index, book: item.name, chapter: '1'}); }}
      >
        <View style={styles.listItemContent}>
          {
            (index<=38)? (
              <View style={styles.oldBook}>
                <Icon style={{marginRight:5}} name="tag" size={15} color="#fff"/>
                <Text style={styles.oldNewTxt}>舊約</Text>
              </View>
            ):(
              <View style={styles.newBook}>
                <Icon style={{marginRight:5}} name="tag" size={15} color="#fff"/>
                <Text style={styles.oldNewTxt}>新約</Text>
              </View>
            )
          }
          <View style={{flexDirection: 'row',  alignItems: "center", justifyContent: "center"}}>
            <Text style={{color:'#000', fontSize: 18, marginRight: 10 }}>{item.name}</Text>
            <Text style={{color:'#999', fontSize: 15}}>{`(${item.chapterNum} 章)`}</Text>
          </View>
          <Icon style={{marginLeft:10}} name="chevron-right" size={25} color="#6F6F6F"/>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    let { booksData, renderPlaceholderOnly } = this.state;
    if (renderPlaceholderOnly || booksData.length==0) {
      return (
        <CustomSpinner />
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          style={{width:'100%', height:'100%'}}
          data={booksData}
          extraData={this.state}
          renderItem={this.renderList}
          ListFooterComponent={<View style={{height:stickyBtnHeight}}></View>}
          ListHeaderComponent={<View style={{height:headerHeight}}></View>}
          ItemSeparatorComponent={() => (
            <View style={{backgroundColor: '#fff', height:1}}></View>
          )}
          keyExtractor={(item, index) => {item.id}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height:'100%'
  },
  titleStyle: {
    textAlign:'right',
    color: '#000',
    fontSize: 18,
    marginLeft: 0,
    width: '100%'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: '#f5f5f5'
  },
  listItemBlock: {
    width:'100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth:1,
    borderBottomColor:'#ccc',
    backgroundColor: '#fff'
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width:'100%',
    height: '100%',
    paddingHorizontal: 25
  },
  oldBook: {
    borderRadius:5,
    backgroundColor:'#323233',
    paddingHorizontal:5,
    paddingVertical:5,
    width:50,
    height:20,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
  newBook: {
    borderRadius:5,
    backgroundColor:'#0A259F',
    paddingHorizontal:5,
    paddingVertical:5,
    width:50,
    height:20,
    justifyContent:'center',
    alignItems:'center',
    flexDirection: 'row'
  },
  oldNewTxt: {
    color:'#fff',
    fontSize: 12
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
    justifyContent: "center",
    alignItems: "center",
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
  }
});

const mapStateToProps = (state) => {
  return {
    books: state.books
  };
};

function mapDispatchToProps (dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Books);

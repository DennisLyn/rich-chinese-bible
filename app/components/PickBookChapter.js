import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Picker,
  ScrollView,
  TouchableOpacity,
  Platform,
  InteractionManager
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import NavigationBar, { NavigationBarStyle } from './NavigationBar';
import CustomSpinner from './common/CustomSpinner'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const stickyBtnHeight = 50;
const headerHeight = NavigationBarStyle.height;

class PickBookChapter extends PureComponent {
  constructor(props){
    super(props);
    this.state={
      bibleData: null,
      booksData: [],
      selectedBookIndex:null,
      selectedBookChaptersNum: null,
      selectedChapter:null,
      selectedChapterSections: null,
      selectedSectionIndex: null,
      fromPage: this.props.from,
      renderPlaceholderOnly: true
    };
    this.renderNavBarWithBack = this.renderNavBarWithBack.bind(this);
    this.renderNavBarWithOutBack = this.renderNavBarWithOutBack.bind(this);
    this.onBookChange = this.onBookChange.bind(this);
    this.onChapterChange = this.onChapterChange.bind(this);
    this.onSectionChange = this.onSectionChange.bind(this);
  }

  componentWillMount() {}

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

    let { bible, books, selectedBookIndex, selectedChapter, selectedSection } = this.props;
    let chapterName = selectedChapter? `第 ${selectedChapter} 章` : '第 1 章';
    let bookChapterNum = (selectedBookIndex)? books.data[selectedBookIndex].chapterNum: books.data[0].chapterNum;
    let bookIndex = selectedBookIndex? selectedBookIndex: 0;
    let chapter = selectedChapter? selectedChapter: 1;
    let chapterSections = selectedBookIndex? bible.data[books.data[selectedBookIndex].name][chapterName].length: bible.data[books.data[0].name][chapterName].length;
    let sectionIndex = selectedSection? selectedSection: 0;

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        booksData: books.data,
        bibleData: bible.data,
        selectedBookChaptersNum: bookChapterNum,
        selectedBookIndex: bookIndex,
        selectedChapter: chapter,
        selectedChapterSections: chapterSections,
        selectedSectionIndex: sectionIndex,
        renderPlaceholderOnly: false
      });
    });
  }

  componentWillReceiveProps(nextProps) {}

  renderNavBarWithBack() {
    return (
      <NavigationBar
        menu={true}
        back={true}
        title="選擇章節"
      />
    );
  }

  renderNavBarWithOutBack() {
    return (
      <NavigationBar
        menu={true}
        title="選擇章節"
      />
    );
  }

  onBookChange(bookIndex) {
    let { booksData, bibleData } = this.state;
    let chapterName = '第 1 章';
    this.setState({
      selectedBookChaptersNum: booksData[bookIndex].chapterNum,
      selectedBookIndex: bookIndex,
      selectedChapter: 1,
      selectedChapterSections: bibleData[booksData[bookIndex].name][chapterName].length,
      selectedSectionIndex: 0
    });
  }

  onChapterChange(chapter) {
    let { booksData, bibleData, selectedBookIndex } = this.state;
    let chapterName = `第 ${chapter} 章`;
    this.setState({
      selectedChapter: chapter,
      selectedChapterSections: bibleData[booksData[selectedBookIndex].name][chapterName].length,
      selectedSectionIndex: 0
    });
  }

  onSectionChange(sectionIndex) {
    this.setState({
      selectedSectionIndex: sectionIndex
    });
  }

  render() {
    let {renderPlaceholderOnly, bibleData, booksData, selectedBookChaptersNum, selectedBookIndex, selectedChapter, selectedChapterSections, selectedSectionIndex, fromPage } = this.state;
    let scrollToIndex = selectedSectionIndex;

    if (renderPlaceholderOnly ||
        bibleData== null||
        booksData.length==0) {
      return (
        <CustomSpinner />
      );
    }

    let bookPickerList = booksData.map((item, index) =>
      <Picker.Item label={item.name} value={index} key={`bookPickItem_${index}`}/>
    );

    let chapterPickerList=[];
    for(let index=0; index < selectedBookChaptersNum; index++) {
      chapterPickerList.push(<Picker.Item label={`${index+1}`} value={`${index+1}`} key={`chapterPickItem_${index}`}/>);
    }

    let sectionPickerList = [];
    for(let index=0; index < selectedChapterSections; index++) {
      sectionPickerList.push(<Picker.Item label={`${index+1}`} value={`${index}`} key={`sectionPickItem_${index}`}/>);
    }

    return (
      <View style={styles.container}>
        <ScrollView  style={{width:'100%', height:'100%'}}>
            <View style={{height: headerHeight}}></View>
            <View style={styles.pickerBlock}>
              <Text style={styles.pickerTitle}>選擇 (書)： {booksData[selectedBookIndex].name}</Text>
              <View style={styles.pickerStyle}>
                <Picker
                  itemStyle={styles.iOSItemStyle}
                  selectedValue={selectedBookIndex}
                  onValueChange={this.onBookChange}>
                  {bookPickerList}
                </Picker>
              </View>
              <Text style={styles.pickerTitle}>選擇 (章)： {selectedChapter}</Text>
              <View style={styles.pickerStyle}>
                <Picker
                  itemStyle={styles.iOSItemStyle}
                  selectedValue={selectedChapter.toString()}
                  onValueChange={this.onChapterChange}>
                  {chapterPickerList}
                </Picker>
              </View>
              <Text style={styles.pickerTitle}>選擇 (節)： { Number(selectedSectionIndex) + 1}</Text>
              <View style={styles.pickerStyle}>
                <Picker
                  itemStyle={styles.iOSItemStyle}
                  selectedValue={selectedSectionIndex.toString()}
                  onValueChange={this.onSectionChange}>
                  {sectionPickerList}
                </Picker>
              </View>
            </View>
            <View style={{height: stickyBtnHeight + 50}}></View>
        </ScrollView>
        <View style={styles.stickyFooterBlock}>
          {
            (fromPage==='chapters')? (
              <TouchableOpacity style={styles.goToBtn} onPress = {()=>{
                Actions.pop({refresh:{bookIndex: selectedBookIndex, book: booksData[selectedBookIndex].name, chapter: selectedChapter, scrollToIndex: scrollToIndex}});
              }}>
                <Icon style={{marginRight:5}} name="coffee-to-go" size={25} color="#fff"/>
                <Text style = {styles.goToBtnText}>前往章節</Text>

              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.goToBtn} onPress = {()=>{
                try{
                  Actions.popTo('chapters');
                  setTimeout(()=>{
                    Actions.refresh({bookIndex: selectedBookIndex, book: booksData[selectedBookIndex].name, chapter: selectedChapter, scrollToIndex: scrollToIndex});
                  },100);
                } catch(err) {
                  Actions.chapters({bookIndex: selectedBookIndex, book: booksData[selectedBookIndex].name, chapter: selectedChapter, scrollToIndex: scrollToIndex});
                }
              }}>
                <Icon style={{marginRight:5}} name="coffee-to-go" size={25} color="#fff"/>
                <Text style = {styles.goToBtnText}>前往章節</Text>
              </TouchableOpacity>
            )
          }
        </View>
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
  pickerBlock: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    marginVertical: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop:0
  },
  pickerTitle: {
    fontSize: 20,
    marginVertical: 10,
    width: '100%',
    textAlign: 'center',
    color: '#000',
  },
  pickerStyle: {
    width: '90%',
    backgroundColor: '#D8D8D8',
    borderRadius: 10,
    height: Platform.OS === 'ios'? 150: 60
  },
  //For ios only
  iOSItemStyle: {
    color: '#000',
    fontSize: 20,
    height: 150
  },
  goToBtn: {
    width: '100%',
    height: 40,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  goToBtnText: {
    color: '#fff',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'right'
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
  }
});

const mapStateToProps = (state) => {
    return {
      books: state.books,
      bible: state.bible
    };
  };

  function mapDispatchToProps (dispatch) {
    return {};
  }

  export default connect(mapStateToProps, mapDispatchToProps)(PickBookChapter);

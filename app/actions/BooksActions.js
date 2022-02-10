import * as TYPES from "./types";
import {store} from "../AppContainer";

export function getBooksData() {
    return {
      type: TYPES.FETCHING_BOOKS_DATA,
      payload: null,
    };
}

export function getBooksSuccess(data) {
  console.log(JSON.stringify(data));
  return {
    type: TYPES.FETCHING_BOOKS_DATA_SUCCESS,
    payload: data,
  };
}

export function getBooksFailure() {
  return {
    type: TYPES.FETCHING_BOOKS_DATA_FAILURE,
    payload: [],
  };
}

export function fetchBooksData() {
  return (dispatch)=>{
    dispatch(getBooksData());
    // let Bible = [];
    /*let Bible = require( '../data/bible.json');
    let booksList = Object.keys(Bible).map((bookName, index)=>{
        return {
            name: bookName,
            chapterNum: Object.keys(Bible[bookName]).length
        };
    });*/
    
    /*let book=[];
    let bible = require('../data/bible.json');
    let booksList = Object.keys(bible).map((bookName, index)=>{
      let newChapterlist = Object.keys(bible[bookName]).map((chapterName, index)=>{
        return chapterName;
      });
      let newBookObj = {};
      newBookObj[bookName] = newChapterlist;
      return newBookObj;
    });*/

    let booksList = require( '../data/books.json');
    // let booksList = require('../data/bookslist.json')
    // console.log("Books " + JSON.stringify(booksList));
    dispatch(getBooksSuccess(booksList));
  }
}

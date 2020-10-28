import React, { Component, useState, useEffect } from "react";
import "./css/App.css";
// import "./bookmarks.js";
import FileHandler from "./components/FileHandler.js";
// import { createBoard, createItem, createColumn } from "./components/monday-board.jsx"; // ??
import mondaySdk from "monday-sdk-js";

var $ = require("jquery");
const monday = mondaySdk();

require("dotenv").config();

const storage = monday.storage.instance;

class App extends React.Component {
  constructor(props) {
      super(props);

      // Default state
      this.state = {
          settings: {},
          context: {},
          boardData: {},
          boardId: 0,
          showData: false,
          authorized: false,
          sessionToken: "",
          name: "",
          itemId: "",
          updateItemId: "",
          fileObj: {},
          fileStr: "",
          dataRetrieved: "false",
          dataExtracted: [],
          bookmarkProperties: { "url": ['http', '\"'], "date": ['ADD_DATE=\"', '\" ICON'], "name": ['\"', '</A>'] },
          columnTitles: [
            {title: "url", type:"text"}, 
            {title: "name", type: "text"},
            {title: "date", type :"date"}
          ],
          colIndex: 0
      };
  }

  componentDidMount() {
      // monday.setToken(process.env.REACT_APP_API_TOKEN); <- THIS IS BAD; DO NOT USE

      monday.listen("settings", this.getSettings);
      monday.listen("context", this.getContext);
      monday.listen("itemIds", this.getItemIds);
      // this.createBoardWithColumns("Public", "public");
      // this.changeColumnValue2().then(() => {console.log('UPDATED')});
      console.log('reload');
      this.changeColumnValues().then(() => {console.log('UPDATED')});
      // this.addColumns();
  }

  getSettings = (res) => {
      this.setState({ settings: res.data });
      console.log("settings:", res.data);
  };

  getContext = (res) => {
      this.setState({ context: res.data });
      console.log("context:", JSON.stringify(res.data));
  };

  componentDidUpdate(prevProps, prevState) {
      const { boardIds } = this.state.context;

      if (prevState.dataRetrieved !== this.state.dataRetrieved) {
          console.log("UPDATE: data retrieved");
          // this.createBoardWithColumns("Test2", "share");

          // this.createBookmarksBoard();
          // storage.getItem("boardId").then((res) => {
          //     const boardId = res.data.value;
          //     console.log('BOARD ID: ' + boardId);
          //     // this.createItem(boardId, null, "new item");
          // })

      }

      if (prevState.dataExtracted !== this.state.dataExtracted) {
        console.log(`DATA EXTRACTED: ${JSON.stringify(this.state.dataExtracted)}`);

        let d = new Date().toISOString();
        // this.changeColumnValues();
  }}

// mutation {
// change_multiple_column_values (board_id: 720861030, item_id: 720989259, 

// id
// }
// }

  async changeColumnValues(itemId) {
      const query = `mutation { change_multiple_column_values (board_id: 726074804, item_id: 726074806, column_values: "{\"url\":\"urlVal0\",\"name1\":\"nameVal0\"}") {id}}`
      const jStr = JSON.stringify("new text");
      const jStr2 = JSON.stringify({"status": "new text"});

      // const j = JSON.stringify([{"url": "text"}, {"label:"}])

      // "{\"status\": {\"index\": 1}}"
      const txt = JSON.stringify({"url": "text"});
      const t = JSON.stringify({status: {index: 1}});
      const t2 = JSON.stringify({status: {label: "Stuck"}});
      const obj = {t};

      const t3 = JSON.stringify(
        {
          text: "success", 
          status: {
            label: "Done"
          }
        });      
      const t4 = JSON.stringify(
        {
          text: "hooray!",
          status: {
            index: 1
          },
          date7: {
            date: "2020-09-10",
            time: "13:25:00"
          },
          email_1: {     
            email: "itsmyemail@mailserver.com",
            text: "my email"
          },
          link: {
            "url": "http://monday.com",
            "text": "go to monday!"
          }, 
          numbers_3: "110.95",
          long_text_1: {
            "text": "Hi, I'm a Long Text! I can contain up to 2000 chars! Text is my twin...what's her char limit? Idk! Sadly, our creators never told us ¯\_(ツ)_/¯ But hopefully we'll find out soon enough so we can let you know! :P Anyway, try me out! Click add column > more columns & you'll find me there!"
          }           
        });



      // const query1 = `mutation change_multiple_column_values($board_id: Int!, $item_id: Int!, $column_id: String!, $column_values: JSON!) {
      //   change_multiple_column_values (board_id: 726291451, item_id: 726291453, column_values: "{\"status\": {\"index\": 1}}") {id}}`      

      const query1 = `mutation change_multiple_column_values($column_values: JSON!) {
        change_multiple_column_values (board_id: 726074804, item_id: 821999933, column_values: $column_values) {id}}`     

        // column_values: "{\"check\": {}}"

      // const query2 = `mutation change_multiple_column_values($checked: JSON!) {
      //   change_multiple_column_values (board_id: 726291451, item_id: 726291453, check: $checked) {id}}`

        // column_values: {\"url\": jStr, \"status\": {\"label\": \"Done\"}}) {id}}`
        // await monday.api(query1)
     // await monday.api(query1, {variables: {"column_values": "{\"status\":{\"index\": 1}}"}})
     await monday.api(query1, {variables: {"column_values": t4}})
      
    
    // .then(async (res) =>  await console.log(res.data));    
      // {checked: JSON.stringify({{{}}})}}})
      

      // return await monday.api(query1).then(async (res) => {
      //     await console.log(`column values updated: ${JSON.stringify(res.data)}`);
      // })
  }  

  async changeColumnValue2() {
      const str = JSON.stringify("sample");
      const query = `mutation {
change_column_value (board_id: 20178755, item_id: 200819371, column_id: "text", value: "${"test"}") {
id}}`
      await monday.api(query).then((res) => {
          console.log(res);
      })
  }

  async changeColumnValue() {
    const val = {"index": 1};
//       const query = `mutation {
// change_column_value (board_id: 726291451, item_id: 726291453, column_id: "status", value: ${JSON.stringify(val)}) {id}}`
//       return await monday.api(query).then(async (res) => {
//           await console.log(`column values updated: ${JSON.stringify(res.data)}`);
//       })

 // const value = { "value": "{\"index\": 1}"};

// const query1 = 
// `mutation change_column($value: JSON!) {
//      change_column_value(board_id: 726291451, item_id: 726291453, column_id: "status", value: $value) {
//           id
//      }
// }`;

// const value = { "value": "{\"SAMPLE\"}" };
// const value = JSON.stringify({"value" : "SAMPLE"});

// const query = 
// `mutation change_column($value: JSON!) {
//   change_column_value(board_id:726291451, item_id:726291453, column_id: “name1”, value: $value) {value} }” }`

// `{ “query” : “mutation change_column($value: “SAMPLE”) {change_column_value(board_id:218918653, item_id:551681223, column_id: “text21”, value: $value) {name} }” }`

// monday.api(query).then( (res) => {
//            console.log(`column values updated: ${JSON.stringify(res.data)}`);
//           })

      // const query1 = `mutation changeValues($board_id: Int!, $item_id: Int, $column_id: String!, $value: JSON!) {
      //   change_column_value (board_id: $board_id, item_id: $item_id , column_id: $column_id, value: $value) {
      //     id
      //   } 
      // }`

      // monday.api(query1, {variables: {"board_id": boardId, "item_id": itemId, "column_id": "status", "value": "{\"index\": 1}"}}).then((res) => console.log(res)).catch((e) => console.log(e))



const status = JSON.stringify({"index" : 2});
const value = "SAMPLE";


      // const query = `mutation changeValues($board_id: Int!, $item_id: Int, $column_id: String!, $value: String!) {
      //    change_column_value (board_id: $board_id, item_id: $item_id , column_id: $column_id, value: $value) {
      //      id
      //    }
      //  }`

      // monday.api(query, {variables: {"board_id": 726291451, "item_id": 726291453, "column_id": "name1", "value": "SAMPLE"}}).then((res) => console.log(res)).catch((e) => console.log(`didn't work: ${e}`))

      // const v = JSON.stringify({});
      const v1 = JSON.stringify("SAMPLE");
      const v2 = JSON.stringify({text: "hey"});

      const query2 = `mutation change_column_value($value: JSON!) {
          change_column_value (board_id: 726291451, item_id: 726291453, column_id: "name1", value: $value) {id}}`

      await monday.api(query2, {variables: {"value": v2}})
      .then(async (res) =>  await console.log(res.data));    


      // BAD
      // const query3 = `mutation change_column_value (board_id: 726291451, item_id: 726291453, column_id: "name1", value: "SAMPLE") {id}}`
      
      // monday.api(query3).then(res =>  console.log(res.data));

  }

  addColumns = () => {
      this.createBoard("Test", "share").then((boardId) => {

      this.addColumn(boardId, 'text');
      setTimeout(() => { this.addColumn(boardId, 'text') }, 2000);
      setTimeout(() => { this.addColumn(boardId, 'date') }, 3000);
          // setTimeout(() => { this.addColumn(boardId, 'date') }, 4000);
      })
  }

  addColumn = (boardId, type) => {
      const { columnTitles, colIndex } = this.state;
      if (colIndex < columnTitles.length) {
          this.setState({ colIndex: colIndex + 1 }, () => {
              this.createColumn(boardId, columnTitles[colIndex], type);
          });
      }
  }

// this.state.columnTitles.forEach(async col => {
//    await this.createColumn(boardId, col.title, col.type)
// })
  // createBoardWithColumns = (boardName, boardType) => {
  //   const { columnTitles } = this.state;
  //   this.createBoard(boardName, boardType).then(boardId => {
  //     // columnTitles.forEach(async col => {      
  //     for (const col of columnTitles) {
  //         this.createColumn(boardId, col.title, col.type)
  //       }    
  //   })
  // } 
      // this.createItem(boardIds[0], "new item");
      // this.createItem(boardIds[0], "Special", this.createUpdate("", this.addFileToUpdate));


  // async getColumnTitles() {
  //   var dfd = $.Deferred(); 
  //   let resArr = [];
  //   for (const key in this.state.bookmarkProperties) {
  //     await resArr.push(key);
  //   }
  //   return resArr;
  // }

  getBoardData = (res) => {
      const query = `query ($boardIds: [Int]) { boards (ids:$boardIds) 
          { name items(limit:1) { name column_values { title text } } } }`;
      monday
          .api(query, { variables: { boardIds: this.state.context.boardIds } })
          .then((res) => {
              this.setState({ boardData: res.data });
          });
  };

  // // create a new board
  /*export*/
  // createBoard = (name, type) => {
  //     var dfd = $.Deferred();
  //     const query = `mutation {
  //             create_board (board_name: ${name}, board_kind: ${type}) {
  //             id}}`;
  //     monday.api(query).then((res) => {
  //         const boardId = res.data.create_board.id;
  //         // this.createItems(boardId);
  //         // this.createColumn(boardId);

  //         storage.setItem("boardId", boardId);

  //         this.setState({ boardId: boardId }, () => {
  //             console.log("boardId: " + boardId)

  //             // this.createItem("717017404", "new item");
  //             dfd.resolve(boardId);
  //             // if (callback) {
  //             //     callback(boardId);
  //             //     // callback(boardId, null, "new item");
  //             // }
  //         })
  //         // this.setState({ boardId: boardId }); // bad
  //         console.log(`board ${name} with board id: ${boardId} created`);
  //         // console.log(`board ${name} created: ${JSON.stringify(res.data)}`);
  //     });
  //     return dfd.promise();
  // };

  // create new items in board
  async createItem(boardId, itemName, callback) {
      // var dfd = $.Deferred(); 
      const query = `mutation {create_item (board_id: ${boardId}, item_name: ${itemName}) {id}}`;

      await monday.api(query).then((res) => {
          // return new Promise(async function(resolve, reject) {
          const itemId = res.data.create_item.id; // str

          this.setState({ itemId: itemId }, () => {
              console.log("createitemId: " + itemId);
              // this.createUpdate(itemId);
              if (callback) {
                  callback(itemId);
              }
          });

          console.log(`new item: ${JSON.stringify(res.data)}`);
          console.log(`state item id: ${this.state.itemId}`);
          // })
      });
      // return dfd.promise();
  }

  // async createColumn(boardId, title, type) {
  //     const query = `mutation { 
  //       create_column (board_id: ${boardId}, title: ${title}, column_type: ${type}) {
  //         id }}`;
  //     await monday.api(query).then(res => {
  //         console.log(`col created: ${JSON.stringify(res.data)}`);
  //     });
  // };

  async createColumn(boardId, title, type) {
    const query = `mutation { 
      create_column (board_id: ${boardId}, title: ${title}, column_type: ${type}) {
        id }}`;
    return await monday.api(query).then(async (res) => {
      await console.log(`col created: ${JSON.stringify(res.data)}`);
    });
  };  

  async createBoard(boardName, boardType) {
    const query = `mutation {
    create_board (board_name: ${boardName}, board_kind: ${boardType}) {
    id}}`;
    return await monday.api(query).then((boardId) => boardId);
  };
  async createBoardWithColumns(boardName, boardType) {
    await this.createBoard(boardName, boardType).then(async (res) => {
      const boardId = res.data.create_board.id;
      for (const col of this.state.columnTitles) {
        await this.createColumn(boardId, col.title, col.type);
      }
    });
  };


  createUpdate = (itemId, callback) => {
      const query = `mutation {
                create_update (item_id: ${itemId}, 
                body: "This update will be added to the item") {id}}`;

      monday.api(query).then(res => {
          const updateItemId = res.data.create_update.id; // str
          this.setState({ updateItemId: updateItemId }, () => {
              if (callback) {
                  callback(updateItemId);
              }
          });
          console.log(`new update: ${JSON.stringify(res.data)}`);
      });
  };

  addFileToUpdate = (file) => {
      const query = `mutation {
                add_file_to_update (update_id: 774929377, 
                $file: ${file} {
                id}
                }`;
      console.log(`html file: ${JSON.stringify(file)}`);

      monday.api(query).then((res) => {
          // const updateItemId = res.data.create_update.id; // str
          // this.setState({ updateItemId: updateItemId }, () => {
          //     if (callback) {
          //       callback(updateItemId);
          //     }
          //   });
          console.log(`file update: ${JSON.stringify(res.data)}`);
      });
  };

  setDataRetrieved = (dataFromChild) => {
      this.setState({ dataRetrieved: dataFromChild }, () => {
          console.log(`dataRetrieved: ${this.state.dataRetrieved}`);
      });
  };  

  setDataExtracted = (dataFromChild) => {
      this.setState({ dataExtracted: dataFromChild }, () => {
          console.log(`dataExtracted: ${this.state.dataExtracted}`);
      });
  };

  async handleClick(e) {
      const { boardIds } = this.state.context;
      const { itemId } = this.state;

      monday
          .api(
              `query ($boardIds: [Int]) { boards (ids:$boardIds)
          { name items(limit:1) { name column_values { title text } } } }`, { variables: { boardIds: this.state.context.boardIds } }
          )
          .then((res) => {
              this.setState({ boardData: res.data });
          });

      this.setState({ showData: true });
      // monday.storage.instance.setItem('authorized', 'yes');

      // this.createBoard("favorites2");

      console.log("boardId: " + this.state.context.boardIds[0]);
      // this.createItem(boardIds[0], this.createUpdate("", this.addFileToUpdate));
      // this.addFileToUpdate('774929377');

      const file = storage.getItem("htmlFile").then((res) => {
          return res.data.file;
      });

      console.log("HTML file: " + JSON.stringify(file));
      console.log("local fileObj App.js: " + this.state.fileObj);
      // await new Promise((resolve, reject) => {setTimeout(resolve, 6000)});
      //   .then(() =>
      console.log("itemId: " + itemId);
      // this.createUpdate(itemId);
      // })

      storage.getItem("boardId").then((res) => {
          setTimeout(() => {
              console.log("boardId from monday storage: " + res.data.value);
          }, 2000);
      });

      storage.getItem("fileObj").then((res) => {
          console.log("fileObj from storage app.js:" + res);
          return res.data.file;
      });
  }

  handleAuthClick = () => {
      monday.oauth({ clientId: process.env.REACT_APP_CLIENT_ID });
      monday.get("sessionToken").then((token) => {
          console.log("sess token: " + JSON.stringify(token));
          monday.setToken(token);
          this.setState({ sessionToken: token.data });
      });
      // $('#authFrame').src(mondayAuth);
      this.setState({ authorized: true });
  };

  // { "boards": [ { "name": "Getting Paid", "items": [ { "name": "Client 1", "column_values": [
  // { "title": "Time Tracking", "text": "12:00:44" }, { "title": "h worked", "text": "12" },
  // { "title": "Price per hour", "text": "150" }, { "title": "Formula", "text": "" },
  // { "title": "Payment status", "text": "Issues" }, { "title": "Money in bank", "text": "v" } ] } ] } ] }

  /*{ "boards": [ { "name": "Tasks", "items": [ { "name": "test", "column_values": [ 
  { "title": "Owner", "text": "" }, { "title": "Priority", "text": "High" }, 
  { "title": "Status", "text": "Stuck" }, { "title": "Deadline", "text": "" }, 
  { "title": "Estimated Time", "text": "" }, { "title": "Actual Time", "text": "" }, 
  { "title": "Delta", "text": "" }, { "title": "Connect to \"Projects\" board", "text": "" }, 
  { "title": "See \"Project\" Status", "text": "" } ] } ] } ] }yo, monday Apps!*/

  render() {
      const { bgColor, txtColor, dataBtn } = this.state.settings;

      const style = {
          background: bgColor,
          color: txtColor,
          fontWeight: "bolder"
      };

      const wrapper = {
          // position: 'absolute'
          // marginTop: "-120px",
          // marginLeft: "-10px"
      }

      const step1Style = {
          marginTop: "-420px",
          marginLeft: "70px"
      }
      const step2Style = {
          marginTop: "-200px",
          marginLeft: "-30px"
      }
      const step3Style = {
          // marginTop: "-100px", 
          marginLeft: "-160px"
      }
      const misc = {
          marginTop: "200px"
          // marginLeft: "0px"
      }

      // , position: "absolute", display: "block" }

      // const authClick = $('#authBtn').click();

      return (
          <div className="App" style={style}>
      <div id="step1" style={step1Style}>Step 1 <button id="authBtn" onClick={this.handleAuthClick}>
        Authorize App
      </button></div>
      

      <div id="step2" style={step2Style}>Step 2
      <FileHandler updateDataRetrieved={this.setDataRetrieved} updateDataExtracted={this.setDataExtracted} bookmarkProperties={this.state.bookmarkProperties} /></div>

      <div id="step3" style={step3Style}>Step 3
       <button id="createBtn" onClick={() => this.createBookmarksBoard()}>
        Create Bookmarks
      </button>        
      </div>

    </div>
      );
  }
}

export default App;
import React, { Component, useState, useEffect } from "react";
import "./css/App.css";
// import "./bookmarks.js";
import FileHandler from "./components/FileHandler.js";
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
      boardId: "",
      showData: false,
      authorized: false,
      sessionToken: "",
      name: "",
      itemId: "",
      updateItemId: "",
      fileObj: {},
      fileStr: "",
      dataRetrieved: 'false'
    };
  }

  componentDidMount() {
    // monday.setToken(process.env.REACT_APP_API_TOKEN); <- THIS IS BAD; DO NOT USE

    monday.listen("settings", this.getSettings);
    monday.listen("context", this.getContext);
    monday.listen("itemIds", this.getItemIds);

    //  monday.api(
    //     `mutation ( create_column (board_id: boardId, title: "cool", column_type: status) {
    //         id }`
    // ).then((res) => {
    //   console.log('col created: ' + JSON.stringify(res.data));
    // });

    // this.getBoardData();

    // monday.listen("context", (res) => {
    //   this.setState({ context: res.data });
    //   // console.log(`context: ${JSON.stringify(context)}`);
    // monday
    //   .api(
    //     `query ($boardIds: [Int]) { boards (ids:$boardIds)
    //         { name items(limit:1) { name column_values { title text } } } }`,
    //     { variables: { boardIds: this.state.context.boardIds } }
    //   )
    //   .then((res) => {
    //     this.setState({ boardData: res.data });
    //   });
    // });
  }

  componentDidUpdate(prevProps, prevState) {
    const { boardIds } = this.state.context;

  if (prevState.dataRetrieved !== this.state.dataRetrieved) {
    console.log('UPDATE: data retrieved');
    this.createItem(boardIds[0], null, "Special");
  }
}

  setDataRetrieved = (dataFromChild) => {
    this.setState({dataRetrieved: dataFromChild}, () => {
      console.log(`dataRetrieved: ${this.state.dataRetrieved}`);
    });
  }

  getSettings = (res) => {
    // setSettings({ settings: res.data });
    this.setState({ settings: res.data });
    console.log("settings:", res.data);
  };

  getContext = (res) => {
    // setContext({ context: res.data });
    this.setState({ context: res.data });
    // getBoardData(res);
    // monday
    //   .api(
    //     `query ($boardIds: [Int]) { boards (ids:$boardIds)
    //       { name items(limit:1) { name column_values { title text } } } }`,
    //     { variables: { boardIds: this.state.context.boardIds } }
    //   )
    //   .then((res) => {
    //     this.setState({ boardData: res.data });
    //   });

    console.log("context:", JSON.stringify(res.data));
  };

  // const queries = {boardData: q1, createBoard: q2}
  // get user board data for all accessible boards
  getBoardData = (res) => {
    const query = `query ($boardIds: [Int]) { boards (ids:$boardIds) 
            { name items(limit:1) { name column_values { title text } } } }`;
    monday
      .api(query, { variables: { boardIds: this.state.context.boardIds } })
      .then((res) => {
        this.setState({ boardData: res.data });
      });
  };

  // create a new board
  createBoard = (name) => {
    const query = `mutation {
                create_board (board_name: ${name}, board_kind: public) {
                id}}`;
    monday.api(query).then((res) => {
      const boardId = res.data.create_board.id;
      // this.createItems(boardId);
      // this.createColumn(boardId);

      storage.setItem("boardId", boardId);

      // this.setState({ boardId: boardId }); // bad
      console.log(`board ${name} with board id: ${boardId} created`);
      // console.log(`board ${name} created: ${JSON.stringify(res.data)}`);
    });
  };

  // create new items in board
  async createItem(boardId, callback, itemName) {
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

  createColumn = (boardId) => {
    const query = `mutation { 
          create_column (board_id: ${boardId}, title: "cool", column_type: status) {
            id }}`;
    monday.api(query).then((res) => {
      console.log("col created: " + JSON.stringify(res.data));
    });
  };

  createUpdate = (itemId, callback) => {
    const query = `mutation {
                  create_update (item_id: ${itemId}, 
                  body: "This update will be added to the item") {id}}`;

    monday.api(query).then((res) => {
      const updateItemId = res.data.create_update.id; // str
      this.setState({ updateItemId: updateItemId }, () => {
          if (callback) {
            callback(updateItemId);
          }
        });
      console.log(`new update: ${JSON.stringify(res.data)}`);
    });
  }

  addFileToUpdate = (file) => {
    // const file = storage.getItem("htmlFile").then((res) => {
    //   return res.data.file;
    // })
    const query = `mutation {
                  add_file_to_update (update_id: 774929377, 
                  $file: ${file} {
                  id}
                  }`    
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
  }

  async handleClick(e) {
    const { boardIds } = this.state.context;
    const { itemId } = this.state;

    monday
      .api(
        `query ($boardIds: [Int]) { boards (ids:$boardIds)
            { name items(limit:1) { name column_values { title text } } } }`,
        { variables: { boardIds: this.state.context.boardIds } }
      )
      .then((res) => {
        this.setState({ boardData: res.data });
      });

    this.setState({ showData: true });
    // monday.storage.instance.setItem('authorized', 'yes');

    // this.createBoard("favorites2");

    console.log("boardId: " + this.state.context.boardIds[0]);
    this.createItem(boardIds[0], this.createUpdate("", this.addFileToUpdate));
    // this.addFileToUpdate('774929377');

        const file = storage.getItem("htmlFile").then((res) => {
      return res.data.file;
    })

        console.log('HTML file: ' + JSON.stringify(file));
        console.log('local fileObj App.js: ' + this.state.fileObj);
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
        console.log('fileObj from storage app.js:' + res )
      return res.data.file;
    })

    // create 1 item

    // monday.get("itemIds").then(res => console.log('item ids: ' + JSON.stringify(res)));

    // const boardId = context.boardIds[0];
    // const cols = ["Title", "url", "snippet"];

    // users + ids
    // monday.api(`query { users { id, name } }`).then(res => {
    //   console.log('users: ' + JSON.stringify(res));
    // })

    // console.log("token " + process.env.REACT_APP_API_TOKEN);

    // mutation {
    //       cols.forEach(col => {

    //  create_column (board_id: boardId, title: col, column_type: String) {
    //   id
    //   }
    //   }
    //   // "{\"status\": {\"index\": 1}}"
    // )})
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
      fontWeight: "bolder",
    };

    // const authClick = $('#authBtn').click();

    var authFrame;
    if (this.state.authorized === true) {
      authFrame = (
        <iframe
          id="authFrame"
          src=""
          width="20"
          height="100"
          style="border:1px solid black;"
        ></iframe>
      );
      this.setState({ authorized: true });
    } else {
      authFrame = <iframe src="https://www.google.com"></iframe>;
    }

    return (
      <div className="App" style={style}>
        <FileHandler updateDataRetrieved = {this.setDataRetrieved} />
        <p style={{marginTop:'-250px', marginLeft:'-250px'}}>dataRetrieved: {this.state.dataRetrieved}</p>
        {this.state.showData ? (
          <p>{JSON.stringify(this.state.boardData, null, 2)}</p>
        ) : (
          <h4>yo, monday Apps!</h4>
        )}

        <button id="authBtn" onClick={this.handleAuthClick}>
          Authorize App
        </button>

        <button
          style={{ marginTop: "8em", position: "absolute", display: "block" }}
          onClick={() => this.handleClick()}
        >
          Show Data
        </button>
      </div>
    );
  }
}

export default App;

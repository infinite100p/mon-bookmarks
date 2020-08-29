// import React, {Component} from "react";
import React from "react";
import App from "../App.js";

import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();
var $ = require('jquery');

class FileHandler extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = { 
      htmlStr: "",
      components: {"url": ['http','\"'], "date": ['ADD_DATE=\"', '\" ICON'], "name": ['\"','</A>']}      
  };
  }

  componentDidMount() {
    monday.storage.instance.getItem("htmlStr").then((res) => {
      console.log("html from storage: " + JSON.stringify(res.data));
    });
  }

  updateDataRetrieved = () => {
    this.props.updateDataRetrieved('true');
  } 

  handleFile = (event) => {
    const file = event.target.files[0];
    console.log(`file: ${file}`); // [object File]
    console.log(`file type: ${file.type}`);
    this.readFile(file);
    monday.storage.instance.setItem("htmlFile", file);
  };

  addFileToUpdate = (file) => {
    // const file = storage.getItem("htmlFile").then((res) => {
    //   return res.data.file;
    // })
    const query = `mutation {
                  add_file_to_update (update_id: 774929377, 
                  $file: ${file} {
                  id}
                  }`;
    console.log(`html file: ${file}`);

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

  // read (html) file as text
  readFile = (event) => {
    const file = event.target.files[0];
    // Check if the file is an image.
    // if (file.type && file.type.indexOf("html") === -1) {
    //   console.log("File is not an image.", file.type, file);
    //   return;
    // }
    var dfd = $.Deferred();
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      console.log("reader: " + reader.result);
      let fileObj = event.target.result;
      monday.storage.instance.setItem("fileObj", fileObj).then(() => {
        console.log("fileObj set in storage: " + file);
      });
      console.log("res: " + typeof fileObj); // str
      console.log("file: " + file);
      // this.addFileToUpdate(fileObj);
      this.setState({ fileStr: fileObj }, () => {
        console.log("local fileObj: " + fileObj); // [object File]
        // this.addFileToUpdate(fileObj);
        this.getLinks(fileObj,'HREF="');
        dfd.resolve(fileObj);
      });
    });
    console.log("reader: " + reader.readAsText(file));
    this.updateDataRetrieved();
    return dfd.promise();
  };

  getLinks = (htmlStr, strToFind) => {
    // let strToFind = 'HREF="'
    console.log(typeof(htmlStr));
    if (htmlStr.includes(strToFind)) {
      let splitStrArr = htmlStr.split(strToFind).splice(1);
      console.log('string split: ' + JSON.stringify(splitStrArr));

      this.extractBookmarks(splitStrArr);
      // let index = htmlStr.indexOf('http');
    } else {
      console.log(strToFind + 'not found');
    }
  }

  // array of bookmarks data
  extractBookmarks = (splitStrArr) => {
    const {components} = this.state;
    let resArr = [];
    splitStrArr.map((str) => {
      let obj = {};
      for (const key in components) {
        let val = components[key];
        let startIndex = str.indexOf(val[0]);
        
        if (key === "name") {
          startIndex = str.lastIndexOf(val[0]) + val[0].length+1;
        }
          if (key === "date") {
            startIndex = str.indexOf(val[0]) + val[0].length+1;
          }     
        
        let endIndex = str.indexOf(val[1]);
        obj[key] = str.slice(startIndex, endIndex);
      }
        resArr.push(obj);
    })
    console.log(`extracted: ${JSON.stringify(resArr)}`)
    return resArr; 
  }

  getColumnNames = () => {
    let resArr = [];
    for (const key in this.state.components) {
      resArr.push(key);
    }
  }

  getFile = () => {
    this.readFile().then((file) => {console.log('this is: ' + file)});
  }

  render() {
    // dataBtn.onClick(this.handleClick);

    return (
      <div className="FileHandler">
        <input type="file" id="file-selector" onChange={this.readFile} />
        <button onClick={() => this.getFile}>File Object</button>
        <br />
        <div id="htmlObj"></div>
      </div>
    );
  }
}

export default FileHandler;

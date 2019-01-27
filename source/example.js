import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  WebView,
  StyleSheet,
  NativeModules,
} from 'react-native';
import RNFS from 'react-native-fs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Path from './Path';
import File from './File';
import Directory from './Directory';

class Fs extends Component {
  state = { rootPath: `${RNFS.DocumentDirectoryPath}/projects` };

  componentDidMount() {
    console.log(RNFS);
    console.log(NativeModules);
    this.testDir();
  }

  async testDir() {
    const dir = await Directory.create(RNFS.DocumentDirectoryPath);
    //const dir = await Directory.create(this.state.rootPath);
    console.log(await RNFS.stat(`${this.state.rootPath}/myNew Folder`));
  }

  onLoadList = async () => {
    const { rootPath } = this.state;

    const exists = await RNFS.exists(rootPath);
    console.log('Exists: ', exists);

    if (!exists) {
      const result = await RNFS.mkdir(rootPath);
      console.log('Created:', result);
    }

    const contents = await RNFS.readDir(rootPath);
    console.log('Contents: ', contents);
  };

  onReadFile = async () => {
    const { rootPath } = this.state;

    const file = `${rootPath}/myFile.js`;
    const historyFile = `${rootPath}/.myFile.js.history`;

    const exists = await RNFS.exists(rootPath);

    if (!exists) {
      console.log(`Folder "${rootPath}" does not exist.`);
      return;
    }

    const contents = await RNFS.readFile(file, 'utf8');
    const history = await RNFS.readFile(historyFile, 'utf8');

    console.log('Read', contents, history);
  };

  onCreateFile = async () => {
    const { rootPath } = this.state;

    const file = `${rootPath}/myFile.js`;
    const historyFile = `${rootPath}/myFile.js.history`;

    console.log('onCreateFile');

    const exists = await RNFS.exists(rootPath);

    /*
    if (exists) {
      console.log(`File "${file}" already exists.`);
      return;
    }
    */

    const fileResult = await RNFS.writeFile(
      file,
      `'use strict';

    Object.defineProperty(exports, '__esModule', { value: true });

    const deferred = () => {
      let resolve;
      let reject;

      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });

      return { resolve, reject, promise };
    };

    exports.deferred = deferred;
    exports.default = deferred;`,
      'utf8',
    );

    const historyResult = await RNFS.writeFile(
      historyFile,
      `{
      "author": {
        "name": "Oleg Galaburda",
        "email": "burdiuz@gmail.com",
        "url": "http://actualwave.com/"
      },
      "bugs": {
        "url": "https://gist.github.com/burdiuz/d28d9a62879a02783735827188be1a92",
        "email": "burdiuz@gmail.com"
      },
      "description": "Simple function to create Promise with exposed resolve() and reject() handlers.",
      "homepage": "https://gist.github.com/burdiuz/d28d9a62879a02783735827188be1a92",
      "keywords": [
        "js",
        "javascript",
        "Promise",
        "resolve",
        "reject",
        "deferred"
      ],
      "license": "MIT",
      "main": "deferred.js",
      "name": "@actualwave/deferred",
      "version": "0.0.1"
    }`,
      'utf8',
    );

    console.log('Created', fileResult, historyResult);
  };

  onUpdatefile = async () => {};

  onDeleteFile = async () => {
    const { rootPath } = this.state;

    const file = `${rootPath}/myFile.js`;
    const historyFile = `${rootPath}/myFile.js.history`;

    const exists = await RNFS.exists(rootPath);

    if (!exists) {
      console.log(`Folder "${rootPath}" does not exist.`);
      return;
    }

    const fileResult = await RNFS.unlink(file);
    const historyResult = await RNFS.unlink(historyFile);

    console.log('Unlinked', fileResult, historyResult);
  };

  renderButtons() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'stretch',
          justifyContent: 'space-between',
          padding: 100,
        }}
      >
        <Button title="Load Files" onPress={this.onLoadList} />
        <Button title="Create File" onPress={this.onCreateFile} />
        <Button title="Read File" onPress={this.onReadFile} />
        <Button title="Update File" onPress={this.onUpdatefile} />
        <Button title="Delete File" onPress={this.onDeleteFile} />
      </View>
    );
  }

  render() {
    const content = this.renderButtons();

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'stretch',
          backgroundColor: '#0f0',
        }}
      >
        {content}
      </View>
    );
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#0f0',
  },
});

export default Fs;

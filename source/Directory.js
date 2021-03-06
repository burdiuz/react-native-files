import RNFS from 'react-native-fs';

import Path, { DEFAULT_ENCODING, DIRECTORY_MODE } from './Path';
import File from './File';
import { getFromPathIfExists } from './utils';

class Directory extends Path {
  isFile() {
    return false;
  }

  isDirectory() {
    return true;
  }

  async parent() {
    const path = this.parentPath();

    if (!path) {
      return null;
    }

    return Directory.get(path);
  }

  async create() {
    if (this.exists()) {
      return;
    }

    await RNFS.mkdir(this.path(), { mode: DIRECTORY_MODE });

    return this.update();
  }

  read() {
    return readDir(this._path);
  }

  getChildPath(name) {
    return `${this._path}/${name}`;
  }

  has(name) {
    return RNFS.exists(this.getChildPath(name));
  }

  getChildIfExist(name) {
    const path = this.getChildPath(name);

    return getFromPathIfExists(path);
  }

  async getFile(name) {
    const path = this.getChildPath(name);
    let stat;

    try {
      stat = await RNFS.stat(path);

      if (!stat.isFile()) {
        throw new Error(`Path "${path}" is not a file.`);
      }
    } catch (error) {
      // does not exist, ok
    }

    return File.get(stat || path);
  }

  async getDirectory(name) {
    const path = this.getChildPath(name);
    let stat;

    try {
      stat = await RNFS.stat(path);

      if (!stat.isDirectory()) {
        throw new Error(`Path "${path}" is not a directory.`);
      }
    } catch (error) {
      // does not exist, ok
    }

    return Directory.get(stat || path);
  }

  createFile(name, content = '', encoding = DEFAULT_ENCODING) {
    return File.create(this.getChildPath(name), content, encoding);
  }

  createDirectory(name) {
    return Directory.create(this.getChildPath(name));
  }

  static async get(info, createIfNotExists = false) {
    const dir = new Directory(info);
    await dir._update;

    if (createIfNotExists && !dir.exists()) {
      await dir.create();
    }

    return dir;
  }

  static async create(info) {
    const dir = new Directory(info, false);

    await RNFS.mkdir(dir.path(), { mode: DIRECTORY_MODE });

    return dir.update();
  }
}

export const readDir = async (path) => {
  const list = await RNFS.readDir(path);

  return Promise.all(
    list.map((stats) => {
      if (stats.isDirectory()) {
        return Directory.get(stats);
      }

      return File.get(stats);
    }),
  );
};

export default Directory;

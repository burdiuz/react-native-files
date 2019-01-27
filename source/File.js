import RNFS from 'react-native-fs';
import { isFunction } from '@actualwave/is-function';

import Path, { DEFAULT_ENCODING } from './Path';
import Directory from './Directory';

class File extends Path {
  isFile() {
    return true;
  }

  isDirectory() {
    return false;
  }

  async parent() {
    const path = this.parentPath();

    if (!path) {
      return null;
    }

    return Directory.get(path);
  }

  read(encoding = DEFAULT_ENCODING) {
    return RNFS.readFile(this._path, encoding);
  }

  async write(content, encoding = DEFAULT_ENCODING) {
    let string;

    if (isFunction(content)) {
      string = await content(this, encoding);
    } else {
      string = String(content);
    }

    return RNFS.writeFile(this._path, string, encoding);
  }

  async append(content, encoding = DEFAULT_ENCODING) {
    let string;

    if (isFunction(content)) {
      string = await content(this, encoding);
    } else {
      string = String(content);
    }

    return RNFS.appendFile(this._path, string, encoding);
  }

  async copyTo(path) {
    await RNFS.copyFile(this._path, path);

    return File.get(path);
  }

  async moveTo(path, applyToThis = false) {
    await RNFS.copyFile(this._path, path);

    if (applyToThis) {
      this._path = path;
      this.update();

      return this;
    }

    return File.get(path);
  }

  static get(info) {
    const file = new File(info);
    return file._update || Promise.resolve(file);
  }

  static async create(info, content = '', encoding = DEFAULT_ENCODING) {
    const file = new File(info, true);

    await file.write(content, encoding);

    return file.update();
  }
}

export default File;

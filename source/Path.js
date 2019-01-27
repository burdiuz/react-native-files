import RNFS from 'react-native-fs';

export const DEFAULT_ENCODING = 'utf8';

export const HASH_MD5 = 'md5';
export const HASH_SHA1 = 'sha1';
export const HASH_SHA224 = 'sha224';
export const HASH_SHA256 = 'sha256';
export const HASH_SHA384 = 'sha384';
export const HASH_SHA512 = 'sha512';

export const getFileName = (path) => path.match(/([^\/]+)(?:[\/]$|$)/)[1];

export const getParentPath = (path) => {
  const match = path.match(/^(.*)[\/][^\/]+(?:[\/]$|$)/);

  return (match && match[1]) || '/';
};

export const splitPath = (path) => {
  const [, parentPath, fileName] = path.match(/^(.*)[\/]([^\/]+)(?:[\/]$|$)/);

  return { parentPath, fileName };
};

class Path {
  constructor(info, preventUpdate = false) {
    this.initialized = false;
    if (typeof info === 'string') {
      this._path = info;
    } else if (info instanceof Path) {
      this._exists = info._exists;
      this._stats = info._stats;
      this._path = info._path;
    } else if (info && typeof info === 'object') {
      this._exists = true;
      this._stats = info;
      this._path = info.path;
      this.initialized = true;
    } else {
      Promise.reject(
        new Error(
          `Path constructor accepts a path string or stats info object, "${info}" were passed.`,
        ),
      );
    }

    if (!this.initialized && !preventUpdate) {
      this.update();
    }
  }

  async updateInternal() {
    this._exists = await RNFS.exists(this._path);

    if (this._exists) {
      // RNFS.stat() works for directories with version >=2.13
      this._stats = await RNFS.stat(this._path);
    } else {
      this._stats = null;
    }
  }

  update() {
    if (this._update) {
      return this._update;
    }

    this._update = this.updateInternal().then(() => {
      this.initialized = true;
      delete this._update;

      return this;
    });

    return this._update;
  }

  stat() {
    return this._stats ? { ...this._stats } : null;
  }

  exists() {
    return this._exists;
  }

  path() {
    return this._path;
  }

  name() {
    if (this._stats && this._stats.name) {
      return this._stats.name;
    }

    return getFileName(this._path);
  }

  parentPath() {
    return getParentPath(this._path);
  }

  size() {
    return this._stats ? this._stats.size : undefined;
  }

  ctime() {
    return this._stats ? this._stats.ctime : undefined;
  }

  mtime() {
    return this._stats ? this._stats.mtime : undefined;
  }

  isFile() {
    return this._stats ? this._stats.isFile() : false;
  }

  isDirectory() {
    return this._stats ? this._stats.isDirectory() : false;
  }

  unlink() {
    return RNFS.unlink(this._path);
  }

  hash(algorythm = HASH_SHA256) {
    return RNFS.hash(this._path, algorythm);
  }

  touch(mtime = undefined, ctime = undefined) {
    return RNFS.touch(this._path, mtime, ctime);
  }

  static get(info) {
    const file = new Path(info);
    return file._update || Promise.resolve(file);
  }

  static exists(path) {
    return RNFS.exists(path);
  }
}

export default Path;

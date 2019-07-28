import RNFS from 'react-native-fs';

import File from './File';
import Directory from './Directory';

export const getFromPathIfExists = async (path) => {
  const exists = await RNFS.exists(path);

  if (!exists) {
    return null;
  }

  const stat = await RNFS.stat(path);

  if (stat.isFile()) {
    return File.get(stat);
  }

  if (stat.isDirectory()) {
    return Directory.get(stat);
  }

  // we checked for existence before, so this should be strange
  throw new Error(`Path "${path}" is not a file or directory.`);
};

export const getFileFromPath = async (path) => {
  const exists = await RNFS.exists(path);

  if (!exists) {
    return null;
  }

  const stat = await RNFS.stat(path);

  if (stat.isFile()) {
    return File.get(stat);
  }

  throw new Error(`Path "${path}" is not a file.`);
};

export const getDirectoryFromPath = async (path) => {
  const exists = await RNFS.exists(path);

  if (!exists) {
    return null;
  }

  const stat = await RNFS.stat(path);

  if (stat.isDirectory()) {
    return Directory.get(stat);
  }

  throw new Error(`Path "${path}" is not a directory.`);
};

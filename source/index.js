import RNFS from 'react-native-fs';
import Path, {
  DEFAULT_ENCODING,
  HASH_MD5,
  HASH_SHA1,
  HASH_SHA224,
  HASH_SHA256,
  HASH_SHA384,
  HASH_SHA512,
  getFileName,
  getParentPath,
  splitPath,
} from './Path';
import File from './File';
import Directory, { readDir } from './Directory';

const DOCUMENT_DIRECTORY_PATH = RNFS.DocumentDirectoryPath;

const EXTERNAL_DIRECTORY_PATH = RNFS.ExternalDirectoryPath;

const EXTERNAL_STORAGE_DIRECTORY_PATH = RNFS.ExternalStorageDirectoryPath;

export {
  Path,
  DEFAULT_ENCODING,
  HASH_MD5,
  HASH_SHA1,
  HASH_SHA224,
  HASH_SHA256,
  HASH_SHA384,
  HASH_SHA512,
  getFileName,
  getParentPath,
  splitPath,
  File,
  Directory,
  readDir,
  DOCUMENT_DIRECTORY_PATH,
  EXTERNAL_DIRECTORY_PATH,
  EXTERNAL_STORAGE_DIRECTORY_PATH,
};

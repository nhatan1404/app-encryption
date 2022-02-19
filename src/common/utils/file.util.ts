import { existsSync, mkdirSync, writeFile } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as config from 'config';

type File = { path: string; originalName: string };

const getPathToWrite = (fileName: string): File => {
  const date = new Date().toISOString().slice(0, 10);
  const uuid = uuidv4();
  const staticPath = config.get('file.path');
  return { path: `${staticPath}/${date}/${uuid}`, originalName: fileName };
};

const getPathDownload = (path): string => {
  const url = config.get('server.url');
  const staticPath: string = config.get('file.static');
  path = path.substring(staticPath.length, path.length);
  return url + path;
};

const createFolder = (path) => {
  try {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
  } catch (err) {}
};

const getFiles = (fileName: string, buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { path, originalName } = getPathToWrite(fileName) as File;
    try {
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }
    } catch (err) {
      reject(err);
    }
    const fullPath: string = path + '/' + originalName;
    writeFile(fullPath, buffer, (error) => {
      if (error) reject(error);
      resolve(getPathDownload(fullPath));
    });
  });
};

const getFilesAsymmetric = (path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }
    } catch (err) {
      reject(err);
    }
    resolve(getPathDownload(path));
  });
};

const getFilenameWithoutExtension = (originalName: string) => {
  const index = originalName.lastIndexOf('.');
  return originalName.substring(0, index);
};

const getExtension = (originalName: string) => {
  const index = originalName.lastIndexOf('.');
  return originalName.substring(index + 1, originalName.length);
};

export {
  getPathToWrite,
  getPathDownload,
  createFolder,
  getFiles,
  getFilesAsymmetric,
  getFilenameWithoutExtension,
  getExtension,
};

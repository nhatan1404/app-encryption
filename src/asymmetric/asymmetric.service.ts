import { transformFileSymmetric } from 'src/common/utils/crypt-symmetric.util';
import { Algorithm } from '../common/types/algorithm.type';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  FileParamsAsymmetric,
  TextParamsAsymmetric,
} from '../common/types/params-asymmetric.type';
import { DownloadFile } from '../common/types/file.type';
import {
  createFolder,
  getFilenameWithoutExtension,
  getFiles,
  getFilesAsymmetric,
  getPathToWrite,
} from '../common/utils/file.util';
import { getCipherInfo } from '../common/constants/list-ciphers';
import * as fs from 'fs';
import * as archiver from 'archiver';
import {
  transformTextAsymmetric,
  transformFileAsymmetric,
} from '../common/utils/crypt-asymmetric.util';
import logger from '../common/utils/logger.util';
import { FileParamsSymmetric } from 'src/common/types/params-symmetric.type';

@Injectable()
export class AsymmetricService {
  async encryptFiles(
    files: Array<Express.Multer.File>,
    params: FileParamsAsymmetric,
  ): Promise<DownloadFile[]> {
    return this.transformFiles(files, true, params);
  }

  async decryptFiles(
    files: Array<Express.Multer.File>,
    params: FileParamsAsymmetric,
  ): Promise<DownloadFile[]> {
    return this.transformFiles(files, false, params);
  }

  private async transformFiles(
    files: Array<Express.Multer.File>,
    isEncrypt: boolean,
    params: FileParamsAsymmetric,
  ): Promise<DownloadFile[]> {
    const result: Array<DownloadFile> = [];
    for (const file of files) {
      const buffer: Buffer = transformFileAsymmetric(file, isEncrypt, params);
      const downloadLinks: string = await getFiles(file.originalname, buffer);
      const item: DownloadFile = {
        fileName: file.originalname,
        linkDownload: downloadLinks,
        size: buffer.byteLength,
      };
      result.push(item);
    }
    return result;
  }

  async encryptFilesAdvanced(
    files: Array<Express.Multer.File>,
    params: FileParamsAsymmetric,
  ): Promise<DownloadFile[]> {
    const result: Array<DownloadFile> = [];
    const { algorithm, symKey, iv, isHexKey, isHexIv } = params;
    const algoInfo: Algorithm = getCipherInfo(algorithm);
    const paramsSym = {
      algorithm,
      key: symKey,
      iv,
      isHexKey,
      isHexIv,
    };

    for (const file of files) {
      const { originalname } = file;
      const buffer = transformFileSymmetric(file, true, paramsSym);
      const archive = archiver('zip', {
        gzip: true,
        zlib: { level: 9 },
      });
      const { path } = getPathToWrite(originalname);
      createFolder(path);
      const filenameZip: string =
        getFilenameWithoutExtension(originalname) + '.zip';
      const fullPath: string = path + '/' + filenameZip;
      const stream = fs.createWriteStream(fullPath);
      archive.on('close', function () {
        archive.pointer();
      });
      archive.on('error', function (err) {
        logger('asymmetric-seriver - encrypt', err, params);
        throw new InternalServerErrorException(err);
      });

      archive.pipe(stream);
      archive.append(buffer, { name: file.originalname });

      const paramsAsym: TextParamsAsymmetric = {
        data: symKey,
        key: params.key,
        isPublicKey: params.isPublicKey,
        passphrase: params.passphrase,
      };

      const keyBuffer = transformTextAsymmetric(
        symKey,
        true,
        paramsAsym,
      ).toString('base64');
      if (algoInfo.hasOwnProperty('ivLength')) {
        const ivBuffer = transformTextAsymmetric(iv, true, paramsAsym).toString(
          'base64',
        );
        archive.append(ivBuffer, { name: 'iv.txt' });
      }
      archive.append(keyBuffer, { name: 'key-symmetric.txt' });
      archive.finalize();
      const downloadLinks = await getFilesAsymmetric(fullPath);
      const item: DownloadFile = {
        fileName: filenameZip,
        linkDownload: downloadLinks,
        size: buffer.byteLength,
      };
      result.push(item);
    }
    return result;
  }

  async decryptFilesAdvanced(
    files: Array<Express.Multer.File>,
    params: FileParamsAsymmetric,
  ) {
    const { algorithm, symKey, iv, isHexKey, isHexIv } = params;
    const symKeyValue = transformTextAsymmetric(
      symKey,
      false,
      this.getParamsAsym(symKey, params),
    ).toString();
    const algoInfo: Algorithm = getCipherInfo(algorithm);
    const ivValue =
      algoInfo.hasOwnProperty('ivLength') &&
      (await transformTextAsymmetric(
        iv,
        false,
        this.getParamsAsym(iv, params),
      ).toString());
    const paramsSym: FileParamsSymmetric = {
      algorithm,
      key: symKeyValue,
      iv: ivValue,
      isHexKey,
      isHexIv,
    };
    return this.decryptSymFiles(files, paramsSym);
  }

  private getParamsAsym(
    data: string,
    params: FileParamsAsymmetric,
  ): TextParamsAsymmetric {
    const { key, isPublicKey, passphrase } = params;
    return {
      data,
      key,
      isPublicKey,
      passphrase,
    };
  }

  private async decryptSymFiles(
    files: Array<Express.Multer.File>,
    params: FileParamsSymmetric,
  ): Promise<DownloadFile[]> {
    const result: Array<DownloadFile> = [];
    for (const file of files) {
      const buffer: Buffer = transformFileSymmetric(file, false, params);
      const downloadLinks: string = await getFiles(file.originalname, buffer);
      const item: DownloadFile = {
        fileName: file.originalname,
        linkDownload: downloadLinks,
        size: buffer.byteLength,
      };
      result.push(item);
    }
    return result;
  }
}

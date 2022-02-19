import { Injectable } from '@nestjs/common';
import { FileParamsSymmetric } from 'src/common/types/params-symmetric.type';
import { transformFileSymmetric } from 'src/common/utils/crypt-symmetric.util';
import { DownloadFile } from '../common/types/file.type';
import { getFiles } from '../common/utils/file.util';

@Injectable()
export class SymmetricService {
  async encryptFiles(
    files: Array<Express.Multer.File>,
    params: FileParamsSymmetric,
  ): Promise<DownloadFile[]> {
    return this.transformFiles(files, true, params);
  }

  async decryptFiles(
    files: Array<Express.Multer.File>,
    params: FileParamsSymmetric,
  ): Promise<DownloadFile[]> {
    return this.transformFiles(files, false, params);
  }

  private async transformFiles(
    files: Array<Express.Multer.File>,
    isEncrypt: boolean,
    params: FileParamsSymmetric,
  ): Promise<DownloadFile[]> {
    const result: Array<DownloadFile> = [];
    for (const file of files) {
      const buffer: Buffer = transformFileSymmetric(file, isEncrypt, params);
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

import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { rm } from 'fs';
import { getExtension } from './common/utils/file.util';
import * as config from 'config';

@Controller()
export class AppController {
  @Post('get-key-value')
  @UseInterceptors(FileInterceptor('file'))
  getKeyValue(@UploadedFile() fileKey: Express.Multer.File): string {
    if (getExtension(fileKey.originalname) !== 'txt')
      throw new BadRequestException('Key must be text file');
    if (fileKey && fileKey.buffer) return fileKey.buffer.toString('utf8');
    throw new BadRequestException('Key file is invalid.');
  }

  @Get('/remove-data')
  remove(@Res() res) {
    const path: string = config.get('file.path');
    rm(path, { recursive: true }, () => res.send('Done'));
  }
}

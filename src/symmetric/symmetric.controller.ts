import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  TextParamsSymmetric,
  FileParamsSymmetric,
} from '../common/types/params-symmetric.type';
import {
  getListAlgorithm,
  transformTextSymmetric,
} from '../common/utils/crypt-symmetric.util';
import {
  TextParamsValidationPipe,
  FileParamsValidationPipe,
} from '../common/pipes/params-symmetric.pipe';
import { Algo } from './../common/types/algorithm.type';
import { DownloadFile } from '../common/types/file.type';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { validateFiles } from '../common/validations/file-upload.validator';
import { SymmetricService } from './symmetric.service';

@Controller('symmetric')
export class SymmetricController {
  constructor(private symmetricService: SymmetricService) {}

  @Get('algorithms')
  getAllAlgorithm(): Array<Algo> {
    return getListAlgorithm();
  }

  @Post('encrypt/text')
  encryptText(@Body(TextParamsValidationPipe) params: TextParamsSymmetric) {
    const result = transformTextSymmetric(params.text, true, params);
    return Buffer.from(result).toString('hex');
  }

  @Post('decrypt/text')
  decryptText(@Body(TextParamsValidationPipe) params: TextParamsSymmetric) {
    if (!params.text.match(/[0-9A-Fa-f]/g)) {
      throw new BadRequestException('Data must be a hex string');
    }
    const result = transformTextSymmetric(params.text, false, params);
    return Buffer.from(result).toString();
  }

  @Post('encrypt/files')
  @UseInterceptors(AnyFilesInterceptor())
  async encryptFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body(FileParamsValidationPipe) params: FileParamsSymmetric,
  ): Promise<DownloadFile[]> {
    validateFiles(files);
    return this.symmetricService.encryptFiles(files, params);
  }

  @Post('decrypt/files')
  @UseInterceptors(AnyFilesInterceptor())
  async decrypt(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body(FileParamsValidationPipe) params: FileParamsSymmetric,
  ): Promise<DownloadFile[]> {
    validateFiles(files);
    return this.symmetricService.decryptFiles(files, params);
  }
}

import {
  Body,
  Controller,
  Post,
  InternalServerErrorException,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import {
  FileParamsAsymmetric,
  KeyPairParamsAsymmetric,
  TextParamsAsymmetric,
} from '../common/types/params-asymmetric.type';
import { generateKeyPairRSA } from '../common/utils/generate-key-pair.util';
import { transformTextAsymmetric } from '../common/utils/crypt-asymmetric.util';
import { KeyPairValidationPipe } from '../common/pipes/key-pair.pipe';
import {
  FileAsymmetricPipe,
  FileAsymmetricAdvancedPipe,
  TextAsymmetricPipe,
} from '../common/pipes/params.asymmetric.pipe';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { validateFiles } from 'src/common/validations/file-upload.validator';
import { AsymmetricService } from './asymmetric.service';
import { DownloadFile } from 'src/common/types/file.type';

@Controller('asymmetric')
export class AsymmetricController {
  constructor(private asymmetricService: AsymmetricService) {}

  @Post('genenrate-key-pair')
  async generateKeyPair(
    @Body(KeyPairValidationPipe) params: KeyPairParamsAsymmetric,
  ) {
    const { bitSize, passphrase } = params;
    try {
      const keyPair = await generateKeyPairRSA(bitSize, passphrase);
      return keyPair;
    } catch (error) {
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  @Post('encrypt/text')
  encryptText(@Body(TextAsymmetricPipe) params: TextParamsAsymmetric) {
    const result = transformTextAsymmetric(params.data, true, params);
    return Buffer.from(result).toString('base64');
  }

  @Post('decrypt/text')
  decryptText(@Body(TextAsymmetricPipe) params: TextParamsAsymmetric) {
    if (!params.data.match(/[0-9A-Fa-f]/g)) {
      throw new BadRequestException('Data must be a hex string');
    }
    const result = transformTextAsymmetric(params.data, false, params);
    return Buffer.from(result).toString();
  }

  @Post('encrypt/files')
  @UseInterceptors(AnyFilesInterceptor())
  async encryptFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body(FileAsymmetricPipe) params: FileParamsAsymmetric,
  ): Promise<DownloadFile[]> {
    validateFiles(files);
    return this.asymmetricService.encryptFiles(files, params);
  }

  @Post('decrypt/files')
  @UseInterceptors(AnyFilesInterceptor())
  async decrypt(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body(FileAsymmetricPipe) params: FileParamsAsymmetric,
  ): Promise<DownloadFile[]> {
    validateFiles(files);
    return this.asymmetricService.decryptFiles(files, params);
  }

  @Post('advanced/encrypt/files')
  @UseInterceptors(AnyFilesInterceptor())
  async encryptFilesAdvanced(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body(FileAsymmetricAdvancedPipe) params: FileParamsAsymmetric,
  ): Promise<DownloadFile[]> {
    validateFiles(files);
    return this.asymmetricService.encryptFilesAdvanced(files, params);
  }

  @Post('advanced/decrypt/files')
  @UseInterceptors(AnyFilesInterceptor())
  async decryptFilesAdvanced(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body(FileAsymmetricAdvancedPipe) params: FileParamsAsymmetric,
  ): Promise<DownloadFile[]> {
    validateFiles(files);
    return this.asymmetricService.decryptFilesAdvanced(files, params);
  }
}

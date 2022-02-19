import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ParamsHashValidationPipe,
  ParamsVerifyValidationPipe,
} from '../common/pipes/hash.pipe';
import {
  generateChecksum,
  verifyChecksum,
  getListHashes,
} from '../common/utils/hash.util';
import { ParamsHash, ParamsVerifyChecksum } from '../common/types/hash.type';
import { FileInterceptor } from '@nestjs/platform-express';
import logger from '../common/utils/logger.util';
import { Algo } from 'src/common/types/algorithm.type';

@Controller('hash')
export class HashController {
  @Post('generate')
  @UseInterceptors(FileInterceptor('file'))
  async hashFile(
    @UploadedFile() file: Express.Multer.File,
    @Body(ParamsHashValidationPipe) params: ParamsHash,
  ): Promise<string> {
    try {
      return await generateChecksum(file.buffer, params);
    } catch (error) {
      logger('hash.controller - generate', error, params);
      throw new BadRequestException(error);
    }
  }

  @Post('verify')
  @UseInterceptors(FileInterceptor('file'))
  async verify(
    @UploadedFile() file: Express.Multer.File,
    @Body(ParamsVerifyValidationPipe) params: ParamsVerifyChecksum,
  ): Promise<boolean> {
    try {
      return await verifyChecksum(file.buffer, params);
    } catch (error) {
      logger('hash.controller - verrify', error, params);
      throw new BadRequestException(error);
    }
  }

  @Get()
  getListHashes(): Algo[] {
    return getListHashes();
  }
}

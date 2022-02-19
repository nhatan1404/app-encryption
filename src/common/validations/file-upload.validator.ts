import { BadRequestException } from '@nestjs/common';
import { constants } from 'buffer';

export const checkFiles = (files: Array<Express.Multer.File>): boolean => {
  if (files.length <= 0) return false;
  return !files.some((file) => file.buffer === null);
};

export const checkFile = (file: Express.Multer.File): boolean => {
  if (!file || file.size === 0 || file.buffer === null) return false;
  return true;
};

export const validateFiles = (files: Array<Express.Multer.File>): void => {
  if (!checkFiles(files)) {
    throw new BadRequestException('Please upload correct file.');
  }
  if (files.some((file) => file.size >= constants.MAX_LENGTH)) {
    throw new BadRequestException('File must be less than 2GB');
  }
};

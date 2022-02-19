import {
  FileParamsSymmetric,
  TextParamsSymmetric,
} from '../types/params-symmetric.type';
import { Cipher, createCipheriv, createDecipheriv, Decipher } from 'crypto';
import showErrorMessageCode from '../validations/crypto-error-code.validator';
import { Algo, Algorithm } from '../types/algorithm.type';
import { getCipherInfo, listCiphers } from '../constants/list-ciphers';
import Logger from '../utils/logger.util';

const getListAlgorithm = (): Algo[] => {
  return listCiphers.map((cipher) => {
    return {
      id: cipher.name,
      ...cipher,
      name: cipher.name.toUpperCase(),
    };
  });
};

const transform = (
  data: Buffer,
  isEcrypt: boolean,
  params: TextParamsSymmetric | FileParamsSymmetric,
): Buffer => {
  const { algorithm, key, iv } = params;
  const algoInfo: Algorithm = getCipherInfo(algorithm);
  const ivValue: string | null | Buffer = algoInfo.hasOwnProperty('ivLength')
    ? iv
    : null;

  try {
    const cipher: Cipher | Decipher = isEcrypt
      ? createCipheriv(algorithm, key, ivValue)
      : createDecipheriv(algorithm, key, ivValue);
    return Buffer.concat([cipher.update(data), cipher.final()]);
  } catch (error) {
    Logger('crypt-symmetric.util - transform', error, params);
    showErrorMessageCode(error);
  }
};

const transformTextSymmetric = (
  text: string,
  isEncrypt = false,
  params: TextParamsSymmetric,
): Buffer => {
  if (isEncrypt) return transform(Buffer.from(text), isEncrypt, params);
  return transform(Buffer.from(text, 'hex'), isEncrypt, params);
};

const transformFileSymmetric = (
  file: Express.Multer.File,
  isEcrypt = false,
  params: FileParamsSymmetric,
): Buffer => {
  return transform(file.buffer, isEcrypt, params);
};

export { getListAlgorithm, transformTextSymmetric, transformFileSymmetric };

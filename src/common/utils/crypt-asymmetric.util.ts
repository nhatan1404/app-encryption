import * as crypto from 'crypto';
import showErrorMessageCode from './../validations/crypto-error-code.validator';
import {
  TextParamsAsymmetric,
  FileParamsAsymmetric,
} from '../types/params-asymmetric.type';
import logger from './logger.util';

const transform = (
  data: Buffer,
  isEcrypt: boolean,
  params: TextParamsAsymmetric | FileParamsAsymmetric,
): Buffer => {
  const cipher = isEcrypt ? encrypt(data, params) : decrypt(data, params);
  return Buffer.from(cipher);
};

const transformTextAsymmetric = (
  text: string,
  isEncrypt = false,
  params: TextParamsAsymmetric,
) => {
  if (isEncrypt) return transform(Buffer.from(text), isEncrypt, params);
  return transform(Buffer.from(text, 'base64'), isEncrypt, params);
};

const transformFileAsymmetric = (
  file: Express.Multer.File,
  isEcrypt = false,
  params: FileParamsAsymmetric,
): Buffer => {
  return transform(file.buffer, isEcrypt, params);
};

const encrypt = (
  data: Buffer,
  params: TextParamsAsymmetric | FileParamsAsymmetric,
) => {
  const { key, isPublicKey, passphrase } = params;
  if (isPublicKey) {
    try {
      return crypto.publicEncrypt(
        {
          key,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          passphrase,
        },
        data,
      );
    } catch (error) {
      logger('crypt-asymmetric.util - publicEncrypt', error, params);
      showErrorMessageCode(error);
    }
  } else {
    try {
      return crypto.privateEncrypt(
        {
          key,
          passphrase,
        },
        data,
      );
    } catch (error) {
      logger('crypt-asymmetric.util - privateEncrypt', error, params);
      showErrorMessageCode(error);
    }
  }
};

const decrypt = (
  data: Buffer,
  params: TextParamsAsymmetric | FileParamsAsymmetric,
) => {
  const { key, isPublicKey, passphrase } = params;
  if (isPublicKey) {
    try {
      return crypto.publicDecrypt(
        {
          key,
          passphrase,
        },
        data,
      );
    } catch (error) {
      logger('crypt-asymmetric.util - publicDecrypt', error, params);
      showErrorMessageCode(error);
    }
  } else {
    try {
      return crypto.privateDecrypt(
        {
          key,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          passphrase,
        },
        data,
      );
    } catch (error) {
      logger('crypt-asymmetric.util - privateDecrypt', error, params);
      showErrorMessageCode(error);
    }
  }
};

export { transformTextAsymmetric, transformFileAsymmetric };

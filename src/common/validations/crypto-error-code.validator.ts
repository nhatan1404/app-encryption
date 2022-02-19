import { BadRequestException } from '@nestjs/common';

const errorCode = {
  ERR_CRYPTO_INVALID_IV: 'Invalid initialization vector',
  ERR_CRYPTO_INVALID_KEYLEN: 'Invalid key length',
  ERR_OSSL_RSA_INVALID_PADDING: `"key" is invalid or unexpected error occurred`,
  ERR_OSSL_RSA_DATA_TOO_LARGE_FOR_KEY_SIZE: 'Data to large for key size',
  ERR_OSSL_RSA_MISSING_PRIVATE_KEY: `"key" is invalid. Key must be private key`,
  ERR_OSSL_PEM_NO_START_LINE: 'No start line',
  ERR_OSSL_EVP_WRONG_FINAL_BLOCK_LENGTH: 'Wrong final block length',
};

const showErrorMessageCode = ({ code }) => {
  if (errorCode[code]) throw new BadRequestException(errorCode[code]);
  throw new BadRequestException('Unexpected error orrcurred.');
};

export default showErrorMessageCode;

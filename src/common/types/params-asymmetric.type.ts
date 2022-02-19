type KeyPairParamsAsymmetric = {
  bitSize: number;
  passphrase: string;
};

enum Padding {
  RSA_PKCS1_PADDING = 1,
  RSA_SSLV23_PADDING = 2,
  RSA_NO_PADDING = 3,
  RSA_PKCS1_OAEP_PADDING = 4,
  RSA_X931_PADDING = 5,
  RSA_PKCS1_PSS_PADDING = 6,
  RSA_PSS_SALTLEN_DIGEST = 7,
  RSA_PSS_SALTLEN_MAX_SIGN = 8,
  RSA_PSS_SALTLEN_AUTO = 9,
}

type TextParamsAsymmetric = {
  data: string;
  key: string;
  isPublicKey: boolean;
  passphrase?: string;
};

type FileParamsAsymmetric = {
  key: string;
  symKey: string;
  isPublicKey: boolean;
  algorithm: string;
  passphrase?: string;
  iv: string | null;
  isHexKey: boolean;
  isHexIv: boolean;
};

export {
  Padding,
  KeyPairParamsAsymmetric,
  TextParamsAsymmetric,
  FileParamsAsymmetric,
};

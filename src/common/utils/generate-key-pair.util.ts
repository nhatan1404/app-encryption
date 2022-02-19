import { generateKeyPair } from 'crypto';

type KeyPair = {
  publicKey: string;
  privateKey: string;
};

const generateKeyPairRSA = (
  modulusLength: number,
  passphrase: string,
): Promise<KeyPair> => {
  return new Promise((resolve, reject) =>
    generateKeyPair(
      'rsa',
      {
        modulusLength: modulusLength,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: passphrase,
        },
      },
      (error, publicKey, privateKey) => {
        if (error) reject(error);
        else resolve({ publicKey, privateKey });
      },
    ),
  );
};
export { generateKeyPairRSA };

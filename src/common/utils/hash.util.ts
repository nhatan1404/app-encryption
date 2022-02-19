import { Stream, Readable } from 'stream';
import { BinaryLike, createHash, Hash, getHashes } from 'crypto';
import { ParamsHash, ParamsVerifyChecksum } from '../types/hash.type';
import { Algo } from '../types/algorithm.type';

const bufferToStream = (buffer: Buffer): Stream => {
  const stream: Readable = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const generateChecksum = (
  buffer: Buffer,
  params: ParamsHash,
): Promise<string> => {
  const { algorithm } = params;
  const hash: Hash = createHash(algorithm);
  return new Promise((resolve, reject) => {
    const stream: Stream = bufferToStream(buffer);
    stream.on('error', (err: Error) => reject(err));
    stream.on('data', (chunk: BinaryLike) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
};

const verifyChecksum = (
  buffer: Buffer,
  params: ParamsVerifyChecksum,
): Promise<boolean> => {
  const { hash } = params;
  return new Promise<boolean>((resolve, reject) => {
    const paramsHash: ParamsHash = { ...params };
    generateChecksum(buffer, paramsHash)
      .then((value: string) => {
        resolve(value === hash);
      })
      .catch((err: Error) => reject(err));
  });
};

const getListHashes = (): Algo[] => {
  return getHashes().map((hash) => {
    return {
      id: hash,
      name: hash.toUpperCase(),
    };
  });
};

export { generateChecksum, verifyChecksum, getListHashes };

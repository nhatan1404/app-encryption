type TextParamsSymmetric = {
  text: string;
  algorithm: string;
  key: string;
  iv: string | null;
  isHexKey: boolean;
  isHexIv: boolean;
};

type FileParamsSymmetric = {
  algorithm: string;
  key: Buffer | string;
  iv: Buffer | string | null;
  isHexKey: boolean;
  isHexIv: boolean;
};

export { TextParamsSymmetric, FileParamsSymmetric };

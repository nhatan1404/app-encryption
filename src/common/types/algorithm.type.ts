export type Algorithm = {
  mode: string;
  name: string;
  keyLength: number;
  ivLength?: number;
  nid?: number;
  blockSize?: number;
};

export type Algo = {
  id: string | number;
  name: string;
};

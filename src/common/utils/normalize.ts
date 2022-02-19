const encodingUTF8 = (str: string): string | null => {
  if (!str) return null;
  // Remove space and normalize string
  str = str.replace(/ + /g, ' ');
  str = str.trim();

  // convert to combination
  str = str.normalize('NFD');
  // remove combo mark characters
  str = str.replace(/[\u0300-\u036f]/g, '');
  // đ/Đ -> d/D
  str = str.replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'));
  // Remove punctuations
  //str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
  return str;
};

const convertToBoolean = (value: any) => {
  for (const key in value) {
    if (key.startsWith('is')) {
      if (['true', 'on', 'yes', '1'].includes(value[key])) {
        value[key] = true;
      }
      if (['false', 'off', 'no', '0'].includes(value[key])) {
        value[key] = false;
      }
    }
  }
  return value;
};

export { encodingUTF8, convertToBoolean };

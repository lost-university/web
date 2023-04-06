const CATEGORY_COLOR_MAP = {
  Auf: '#f368e0',
  MaPh: '#ee5253',
  KomEng: '#0abde3',
  gwr: '#10ac84',
  Inf: '#576574',
  SaBa: '#222f3e',
  EP: '#55efc4',
  RA: '#ff9f43',
  Fallback: '#737373',
};

// eslint-disable-next-line max-len
const getColorForCategory = (categoryId) => CATEGORY_COLOR_MAP[categoryId] || CATEGORY_COLOR_MAP.Fallback;

export {
  // eslint-disable-next-line import/prefer-default-export
  getColorForCategory,
};

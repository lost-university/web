const CATEGORY_COLOR_PRIORITIES = {
  Auf: -1,
  Inf: -1,
};

const CATEGORY_COLOR_MAP = {
  Auf: '#f368e0',
  MaPh: '#ee5253',
  KomEng: '#0abde3',
  gwr: '#10ac84',
  Inf: '#576574',
  SaBa: '#222f3e',
  EP: '#222f3e',
  RA: '#ff9f43',
  Fallback: '#737373',
};

// eslint-disable-next-line vue/max-len
const getColorForCategoryId = (categoryId) => CATEGORY_COLOR_MAP[categoryId] || CATEGORY_COLOR_MAP.Fallback;

const getCategoryColorForModule = (module) => module.categories
  .sort((a, b) => CATEGORY_COLOR_PRIORITIES[b.id] ?? 0 - CATEGORY_COLOR_PRIORITIES[a.id] ?? 0)
  .map((category) => category.id)
  .map(getColorForCategoryId)[0] ?? CATEGORY_COLOR_MAP.Fallback;

export {
  // eslint-disable-next-line import/prefer-default-export
  getColorForCategoryId,
  getCategoryColorForModule,
};

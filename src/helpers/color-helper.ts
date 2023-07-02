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

const getCategoryColorForModule = (module) => {
  const prioritzedCategory = module.categories
    .map((category) => ({ id: category.id, priority: CATEGORY_COLOR_PRIORITIES[category.id] ?? 0 }))
    .sort((a, b) => b.priority - a.priority)[0];

  return prioritzedCategory ? getColorForCategoryId(prioritzedCategory.id) : CATEGORY_COLOR_MAP.Fallback;
};
type ColorCategoryKey = keyof typeof CATEGORY_COLOR_MAP;

// eslint-disable-next-line max-len
const getColorForCategoryId = (categoryId: ColorCategoryKey) => CATEGORY_COLOR_MAP[categoryId] || CATEGORY_COLOR_MAP.Fallback;

export {
  // eslint-disable-next-line import/prefer-default-export
  getColorForCategoryId,
  getCategoryColorForModule,
};

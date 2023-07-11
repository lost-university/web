import type { Module } from '../helpers/types';

const CATEGORY_COLOR_MAP: { [key: string]: string } = {
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

type ColorCategoryKey = keyof typeof CATEGORY_COLOR_MAP;

const CATEGORY_COLOR_PRIORITIES: { [key: ColorCategoryKey]: number } = {
  Auf: -1,
  Inf: -1,
};

const getColorForCategoryId = (categoryId: ColorCategoryKey) => CATEGORY_COLOR_MAP[categoryId] || CATEGORY_COLOR_MAP.Fallback;

const getCategoryColorForModule = (module: Module) => {
  const prioritzedCategory = module.categories
    .map((category) => ({ id: category.id, priority: CATEGORY_COLOR_PRIORITIES[category.id] ?? 0 }))
    .sort((a, b) => b.priority - a.priority)[0];

  return prioritzedCategory ? getColorForCategoryId(prioritzedCategory.id) : CATEGORY_COLOR_MAP.Fallback;
};

export {
  getColorForCategoryId,
  getCategoryColorForModule,
};

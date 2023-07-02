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

// eslint-disable-next-line vue/max-len
const getColorForCategoryId = (categoryId: ColorCategoryKey) => CATEGORY_COLOR_MAP[categoryId] || CATEGORY_COLOR_MAP.Fallback;

const getCategoryColorForModule = (module: Module) => module.categories
  .sort((a, b) => CATEGORY_COLOR_PRIORITIES[b.id] ?? 0 - CATEGORY_COLOR_PRIORITIES[a.id] ?? 0)
  .map((category) => category.id)
  .map(getColorForCategoryId)[0] ?? CATEGORY_COLOR_MAP.Fallback;

export {
  // eslint-disable-next-line import/prefer-default-export
  getColorForCategoryId,
  getCategoryColorForModule,
};

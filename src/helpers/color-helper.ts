import type { Module } from '../helpers/types';

const CATEGORY_COLOR_MAP: { [key: string]: string } = {
  Auf: '#888888',
  MaPh: '#cb0b57',
  KomEng: '#0aadd0',
  gwr: '#10ac84',
  GWRIKTS: '#057760',
  Inf: '#3957d7',
  SaBa: '#231c4a',
  EP: '#4332a1',
  RA: '#fe7b11',
  Fallback: '#262c40',
};

type ColorCategoryKey = keyof typeof CATEGORY_COLOR_MAP;

const CATEGORY_COLOR_PRIORITIES: { [key: ColorCategoryKey]: number } = {
  Auf: -1,
  Inf: -1,
};

const getColorForCategoryId = (categoryId: ColorCategoryKey) =>
  CATEGORY_COLOR_MAP[categoryId] || CATEGORY_COLOR_MAP.Fallback;

const getCategoryColorForModule = (module: Module) => {
  const prioritzedCategory = module.categories_for_coloring
    .map((categoryId) => ({ id: categoryId, priority: CATEGORY_COLOR_PRIORITIES[categoryId] ?? 0 }))
    .sort((a, b) => b.priority - a.priority)[0];

  return prioritzedCategory ? getColorForCategoryId(prioritzedCategory.id) : CATEGORY_COLOR_MAP.Fallback;
};

export {
  getColorForCategoryId,
  getCategoryColorForModule,
};

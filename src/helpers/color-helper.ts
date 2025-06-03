const CATEGORY_COLOR_CLASS_MAP: { [key: string]: string } = {
  Auf: 'bg-neutral-500',
  MaPh: 'bg-sky-700',
  KomEng: 'bg-sky-400',
  gwr: 'bg-emerald-600',
  GWRIKTS: 'bg-teal-400',
  Inf: 'bg-slate-600',
  SaBa: 'bg-slate-800',
  EP: 'bg-slate-800',
  RA: 'bg-amber-500',
  Fallback: 'bg-purple-500',
};

const CATEGORY_COLOR_HEX_MAP: { [key: string]: string } = {
  Auf: '#737373',
  MaPh: '#075985',
  KomEng: '#38bdf8',
  gwr: '#059669',
  GWRIKTS: '#14b8a6',
  Inf: '#475569',
  SaBa: '#1e293b',
  EP: '#1e293b',
  RA: '#f59e0b',
  Fallback: '#8b5cf6',
};


type ColorClassCategoryKey = keyof typeof CATEGORY_COLOR_CLASS_MAP;

const CATEGORY_COLOR_PRIORITIES: { [key: ColorClassCategoryKey]: number } = {
  Auf: -1,
  Inf: -1,
};

const getColorClassForCategoryId = (categoryId: ColorClassCategoryKey) =>
  CATEGORY_COLOR_CLASS_MAP[categoryId] || CATEGORY_COLOR_CLASS_MAP.Fallback;

const getColorClassForPrioritizedCategory = (categoryIds: string[]) => {
  const prioritzedCategory = categoryIds
    .map((categoryId) => ({ id: categoryId, priority: CATEGORY_COLOR_PRIORITIES[categoryId] ?? 0 }))
    .sort((a, b) => b.priority === a.priority ? (a.id > b.id ? 1 : -1) : b.priority - a.priority)[0];

  return prioritzedCategory ? getColorClassForCategoryId(prioritzedCategory.id) : CATEGORY_COLOR_CLASS_MAP.Fallback;
};


const getColorHexForCategoryId = (categoryId: string): string =>
  CATEGORY_COLOR_HEX_MAP[categoryId] || CATEGORY_COLOR_HEX_MAP.Fallback;

const getColorHexForPrioritizedCategory = (categoryIds: string[]): string => {
  const prioritizedCategory = categoryIds
    .map((categoryId) => ({
      id: categoryId,
      priority: CATEGORY_COLOR_PRIORITIES[categoryId as keyof typeof CATEGORY_COLOR_CLASS_MAP] ?? 0,
    }))
    .sort((a, b) =>
      b.priority === a.priority ? (a.id > b.id ? 1 : -1) : b.priority - a.priority
    )[0];

  return prioritizedCategory ? getColorHexForCategoryId(prioritizedCategory.id) : CATEGORY_COLOR_HEX_MAP.Fallback;
};

export {
  getColorClassForCategoryId,
  getColorClassForPrioritizedCategory,
  getColorHexForPrioritizedCategory,
};

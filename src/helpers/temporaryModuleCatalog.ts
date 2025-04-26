import type { Module } from './types';

const moduleCatalog: Module[] = [
  { name: 'Module A', url: 'modA.json', ects: 5, categoriesForColoring: ['cat1'], validationInfo: null },
  { name: 'Module B', url: 'modB.json', ects: 3, categoriesForColoring: ['cat2'], validationInfo: null },
  { name: 'Module C', url: 'modC.json', ects: 4, categoriesForColoring: ['cat3'], validationInfo: null },
];

export default moduleCatalog;

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faUserSecret,
  faChartLine,
  faCloud,
  faCode,
  faPalette,
  faBrain,
  faStar,
} from '@fortawesome/free-solid-svg-icons';

// focus ids differ between Studienordnung 21 and 23, so both variants are listed
const FOCUS_ICON_MAP: { [key: string]: IconDefinition } = {
  CySec: faUserSecret,
  CySe: faUserSecret,
  DaEnMaIn: faChartLine,
  DaEn: faChartLine,
  NetCloud: faCloud,
  NetC: faCloud,
  SE: faCode,
  FrEng: faPalette,
  VTAI: faBrain,
};

const getIconForFocusId = (focusId: string): IconDefinition =>
  FOCUS_ICON_MAP[focusId] || faStar;

export {
  getIconForFocusId,
};

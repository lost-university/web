import type { PlanDTO } from './PlanDTO';

export interface Plan {
  id: string;
  name: string;
  content: string;
  isFavorite: boolean;
  createdAt: string;
  userId: string;
}

export function map(dto: PlanDTO): Plan {
  return {
    id: dto.id,
    name: dto.name,
    content: dto.content,
    isFavorite: dto.is_favorite,
    createdAt: dto.created_at,
    userId: dto.user_id,
  };
}

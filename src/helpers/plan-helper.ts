import type { PlanDTO } from "../types/PlanDTO";
import type { Plan } from "../types/Plan";

export function map(dto: PlanDTO): Plan {
  return {
    id: dto.id,
    name: dto.name,
    content: dto.content,
    isFavorite: dto.is_favorite,
    publicSlug: dto.public_slug,
    createdAt: dto.created_at,
    userId: dto.user_id,
  };
}

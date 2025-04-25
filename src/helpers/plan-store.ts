export interface Plan {
  id: string;
  name: string;
  content: string;
  is_favorite: boolean;
  created_at: string;
  user_id: string;
}

const BASE_URL = process.env.NODE_ENV === 'production' ? window.location.origin : "http://localhost:8000";

export class PlanStore {

  static async fetchSavedPlans(token: string): Promise<Plan[]> {
    try {
      const response = await fetch(`${BASE_URL}/api/plans`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching saved plans:', error);
      throw error;
    }
  }

  static async savePlan(modules: string, token: string): Promise<void> {
    modules = JSON.stringify({ content: modules });
    console.log(modules);
    try {
      const response = await fetch(`${BASE_URL}/api/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: modules,
      });
      console.log(await response.json());
      if (!response.ok) {
        throw new Error('Failed to store plan');
      }
    } catch (error) {
      console.error('Error storing plan:', error);
      throw error;
    }
  }
}

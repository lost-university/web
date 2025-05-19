export interface Plan {
  id: string;
  name: string;
  content: string;
  bookmark: boolean;
  created_at: string;
  user_id: string;
}

export class PlanStore {

  async fetchSavedPlans(token: string): Promise<Plan[]> {
    try {
      const response = await fetch(`/api/plans`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.plans;
    } catch (error) {
      console.error('Error fetching saved plans:', error);
      throw error;
    }
  }

  async savePlan(planName: string, modules: string, token: string): Promise<void> {
    const payload = JSON.stringify({ name: planName, content: modules });
    try {
      const response = await fetch(`/api/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: payload,
      });
      if (!response.ok) {
        throw new Error('Failed to store plan');
      }
    } catch (error) {
      console.error('Error storing plan:', error);
      throw error;
    }
  }

  async deletePlan(planId: string, token: string): Promise<void> {
    try {
      const response = await fetch(`/api/plan/${planId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete plan');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  }

  async bookmarkPlan(planId: string, token: string): Promise<void> {
    try {
      const response = await fetch(`/api/plan/bookmark/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to (un)bookmark plan');
      }
    } catch (error) {
      console.error('Error to bookmark plan:', error);
      throw error;
    }
  }
}

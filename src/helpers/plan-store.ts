export interface SavedPlan {
  id: number;
  title: string;
  path: string;
}

const BASE_URL = process.env.NODE_ENV === 'production' ? window.location.origin : "http://localhost:8000";

export class PlanStore {

  // TODO: Change base url to production as soon as its available
  baseUrl: string = ''

  static async fetchSavedPlans(): Promise<SavedPlan[]> {
    try {
      const response = await fetch('/api/plans'); // Replace with your actual API endpoint
      return response.data;
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

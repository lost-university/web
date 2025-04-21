export interface SavedPlan {
  id: number;
  title: string;
  path: string;
}

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
}

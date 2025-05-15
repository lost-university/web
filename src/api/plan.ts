import type { Plan as SavedPlan } from '../types/Plan';
import * as planHelper from '../helpers/plan-helper';

const fetchSavedPlans = async (token: string): Promise<SavedPlan[]> => {
  try {
    const response = await fetch(`/api/plans`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data.plans.map(planHelper.map);
  } catch (error) {
    console.error('Error fetching saved plans:', error);
    throw error;
  }
}

const savePlan = async (planName: string, modules: string, token: string): Promise<void> => {
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

const deletePlan = async (planId: string, token: string): Promise<void> => {
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

export { fetchSavedPlans, savePlan, deletePlan };

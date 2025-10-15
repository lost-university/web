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
    return []
  }
}

const savePlan = async (planName: string, modules: string, token: string): Promise<void> => {
  const payload = JSON.stringify({ name: planName, content: modules });
  try {
    await fetch(`/api/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: payload,
    });
  } catch (error) {
    console.error('Error storing plan:', error);
  }
}

const deletePlan = async (planId: string, token: string): Promise<void> => {
  try {
    await fetch(`/api/plans/${planId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error deleting plan:', error);
  }
}

const bookmarkPlan = async (planId: string, token: string): Promise<void> => {
  try {
    await fetch(`/api/plans/bookmark/${planId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error to bookmark plan:', error);
  }
}

const fetchSharedPlan = async (slug: string|string[]): Promise<string> => {
  try {
    const response = await fetch(`/api/plans/shared/${slug}`);
    const data = await response.json();
    if (data.content) {
      return `/plan/${data.content}`
    } else {
      return `/`
    }
  } catch (err) {
    console.error('Sharing link error:', err);
    return `/`
  }
}

export { fetchSavedPlans, savePlan, deletePlan, bookmarkPlan, fetchSharedPlan };

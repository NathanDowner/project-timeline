import { type Activity } from './index';

const STORAGE_KEY = 'project-timeline-activities';

/**
 * Saves activities to localStorage
 */
export function saveActivities(activities: Activity[]): void {
  try {
    const serialized = JSON.stringify(activities);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save activities to localStorage:', error);
  }
}

/**
 * Loads activities from localStorage
 */
export function loadActivities(): Activity[] {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return [];

    const activities = JSON.parse(serialized);
    // Convert date strings back to Date objects
    return activities.map((activity: any) => ({
      ...activity,
      startDate: activity.startDate ? new Date(activity.startDate) : null,
      endDate: activity.endDate ? new Date(activity.endDate) : null,
    }));
  } catch (error) {
    console.error('Failed to load activities from localStorage:', error);
    return [];
  }
}

/**
 * Clears all activities from localStorage
 */
export function clearActivities(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear activities from localStorage:', error);
  }
}

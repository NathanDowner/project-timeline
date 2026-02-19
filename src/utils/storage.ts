import { type Project } from './index';

const STORAGE_KEY = 'ptt_project';

/**
 * Saves project to localStorage
 */
export function saveProject(project: Project): void {
  try {
    const serialized = JSON.stringify(project);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save project to localStorage:', error);
  }
}

/**
 * Loads project from localStorage
 */
export function loadProject(): Project | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;

    return JSON.parse(serialized);
  } catch (error) {
    console.error('Failed to load project from localStorage:', error);
    return null;
  }
}

/**
 * Clears only activities from the project in localStorage
 */
export function clearActivities(): void {
  try {
    const project = loadProject();
    if (project) {
      project.activities = [];
      saveProject(project);
    }
  } catch (error) {
    console.error('Failed to clear activities from localStorage:', error);
  }
}

export interface Activity {
  id: number;
  name: string;
  duration: number;
  dependencies: number[];
  allowedDays: string;
  startDate: Date | null;
  endDate: Date | null;
}

const dayMap: Record<string, number> = {
  sunday: 0,
  sun: 0,
  monday: 1,
  mon: 1,
  tuesday: 2,
  tue: 2,
  wednesday: 3,
  wed: 3,
  thursday: 4,
  thu: 4,
  friday: 5,
  fri: 5,
  saturday: 6,
  sat: 6,
};

/**
 * Adds a specified number of calendar days to a date.
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Adds a specified number of business days (excluding weekends) to a date.
 */
export function addBusinessDays(date: Date, days: number): Date {
  let result = new Date(date);
  let addedDays = 0;

  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      addedDays++;
    }
  }
  return result;
}

/**
 * Calculates the number of business days (excluding weekends) between two dates.
 */
export function calculateBusinessDays(startDate: Date, endDate: Date): number {
  let count = 0;
  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    // Count if not weekend
    if (current.getDay() !== 0 && current.getDay() !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

/**
 * Advances a date to the next weekday if it falls on a weekend.
 */
export function skipWeekends(date: Date): Date {
  let result = new Date(date);
  while (result.getDay() === 0 || result.getDay() === 6) {
    result.setDate(result.getDate() + 1);
  }
  return result;
}

/**
 * Parses a comma-separated string of dependency IDs into an array of activity indices.
 */
export function parseDependencies(depString: string): number[] {
  if (!depString || depString.trim() === '') return [];

  return depString
    .split(',')
    .map((s) => parseInt(s.trim()))
    .filter((n) => !isNaN(n) && n >= 1)
    .map((n) => n - 1); // Convert display ID to index
}

/**
 * Formats an array of dependency indices as a comma-separated string of display IDs.
 */
export function formatDependencies(depArray: number[]): string {
  if (!depArray || depArray.length === 0) return '';
  return depArray.map((index) => index + 1).join(', ');
}

/**
 * Finds the next date that satisfies the allowed days constraint.
 */
export function getNextValidDate(date: Date, allowedDaysStr: string): Date {
  if (!allowedDaysStr || allowedDaysStr.trim() === '') return date;

  const allowedIndexes = allowedDaysStr
    .toLowerCase()
    .split(',')
    .map((d) => dayMap[d.trim()])
    .filter((d) => d !== undefined);

  if (allowedIndexes.length === 0) return date;

  let validDate = new Date(date);
  let safety = 0;

  while (!allowedIndexes.includes(validDate.getDay()) && safety < 365) {
    validDate.setDate(validDate.getDate() + 1);
    safety++;
  }
  return validDate;
}

/**
 * Formats a Date object to YYYY-MM-DD format for use in date input fields.
 */
export function formatDateForInput(dateObj: Date): string {
  return dateObj.toISOString().split('T')[0];
}

/**
 * Formats a Date object for human-readable display.
 */
export function formatDateForDisplay(dateObj: Date): string {
  return dateObj.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Calculates the earliest allowable start date for an activity based on its dependencies.
 */
export function getEarliestStartDate(
  activityIndex: number,
  activities: Activity[],
  projectStartDate: Date,
  includeWeekends: boolean
): Date {
  const activity = activities[activityIndex];
  let earliestStart = new Date(projectStartDate);

  if (activity.dependencies && activity.dependencies.length > 0) {
    let latestDependencyEnd: Date | null = null;

    activity.dependencies.forEach((depIndex) => {
      if (
        depIndex >= 0 &&
        depIndex < activities.length &&
        depIndex !== activityIndex
      ) {
        const depActivity = activities[depIndex];
        if (depActivity.endDate) {
          const depEnd = new Date(depActivity.endDate);
          if (!latestDependencyEnd || depEnd > latestDependencyEnd) {
            latestDependencyEnd = depEnd;
          }
        }
      }
    });

    if (latestDependencyEnd) {
      earliestStart = addDays(latestDependencyEnd, 1);
      if (!includeWeekends) {
        earliestStart = skipWeekends(earliestStart);
      }
    }
  }

  return earliestStart;
}

/**
 * Recursively checks if an activity has circular dependencies.
 */
export function hasCircularDependency(
  startIndex: number,
  activities: Activity[],
  visited: Set<number> = new Set()
): boolean {
  if (visited.has(startIndex)) return true;
  visited.add(startIndex);

  const activity = activities[startIndex];
  if (!activity.dependencies) return false;

  for (let depIndex of activity.dependencies) {
    if (depIndex === startIndex) return true; // Self-reference
    if (depIndex >= 0 && depIndex < activities.length) {
      if (hasCircularDependency(depIndex, activities, new Set(visited))) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Recalculates all activity dates based on dependencies and constraints.
 */
export function recalculateAllDates(
  activities: Activity[],
  projectStartDate: Date,
  includeWeekends: boolean
): Activity[] {
  return activities.map((activity, index) => {
    let earliestStart = new Date(projectStartDate);

    if (activity.dependencies && activity.dependencies.length > 0) {
      let latestDependencyEnd: Date | null = null;

      activity.dependencies.forEach((depIndex) => {
        if (depIndex >= 0 && depIndex < activities.length) {
          const depActivity = activities[depIndex];
          if (depActivity.endDate) {
            const depEnd = new Date(depActivity.endDate);
            if (!latestDependencyEnd || depEnd > latestDependencyEnd) {
              latestDependencyEnd = depEnd;
            }
          }
        }
      });

      if (latestDependencyEnd) {
        earliestStart = addDays(latestDependencyEnd, 1);
        if (!includeWeekends) {
          earliestStart = skipWeekends(earliestStart);
        }
      }
    }

    // For activities with dependencies, always start immediately after dependencies
    // For activities without dependencies, only update if not set or too early
    let startDate: Date;
    if (activity.dependencies && activity.dependencies.length > 0) {
      startDate = earliestStart;
    } else if (
      !activity.startDate ||
      new Date(activity.startDate) < earliestStart
    ) {
      startDate = earliestStart;
    } else {
      startDate = new Date(activity.startDate);
    }

    // Apply "Allowed Days" constraint
    startDate = getNextValidDate(startDate, activity.allowedDays);

    // Ensure start date is not on weekend if weekends are excluded
    if (!includeWeekends) {
      startDate = skipWeekends(startDate);
    }

    // Calculate End Date based on Duration
    let endDate: Date;
    if (includeWeekends) {
      endDate = addDays(startDate, activity.duration - 1);
    } else {
      endDate = addBusinessDays(startDate, activity.duration - 1);
    }

    return {
      ...activity,
      startDate,
      endDate,
    };
  });
}

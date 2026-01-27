import { useState, useEffect } from 'react';
import { ProjectControls } from './components/ProjectControls';
import { ActivityForm } from './components/ActivityForm';
import { ActivityTable } from './components/ActivityTable';
import {
  type Activity,
  parseDependencies,
  recalculateAllDates,
  hasCircularDependency,
  getEarliestStartDate,
  calculateBusinessDays,
  addDays,
  skipWeekends,
  getNextValidDate,
} from './utils';
import { saveActivities, loadActivities, clearActivities } from './utils/storage';

function App() {
  const [projectStartDate, setProjectStartDate] = useState<Date>(new Date());
  const [includeWeekends, setIncludeWeekends] = useState<boolean>(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Load activities from localStorage on mount
  useEffect(() => {
    const loaded = loadActivities();
    if (loaded.length > 0) {
      setActivities(loaded);
    }
  }, []);

  // Recalculate all dates whenever dependencies change
  useEffect(() => {
    setActivities((prev) =>
      recalculateAllDates(prev, projectStartDate, includeWeekends),
    );
  }, [projectStartDate, includeWeekends]);

  const handleAddActivity = (
    name: string,
    duration: number,
    dependenciesRaw: string,
    allowedDays: string,
  ) => {
    const dependencies = parseDependencies(dependenciesRaw);

    const newActivity: Activity = {
      id: Date.now(),
      name,
      duration,
      dependencies,
      allowedDays,
      startDate: null,
      endDate: null,
    };

    const newActivities = [...activities, newActivity];
    setActivities(
      recalculateAllDates(newActivities, projectStartDate, includeWeekends),
    );
    setHasUnsavedChanges(true);
  };

  const handleDeleteActivity = (index: number) => {
    const newActivities = activities.filter((_, i) => i !== index);
    setActivities(
      recalculateAllDates(newActivities, projectStartDate, includeWeekends),
    );
    setHasUnsavedChanges(true);
  };

  const handleStartDateChange = (index: number, newStartDateString: string) => {
    const activity = activities[index];
    const newStart = new Date(newStartDateString);

    // Validate: Cannot set weekend dates if weekends are excluded
    if (
      !includeWeekends &&
      (newStart.getDay() === 0 || newStart.getDay() === 6)
    ) {
      alert(
        'Cannot set start date on a weekend when "Include Weekends" is not checked.',
      );
      return;
    }

    // Check if this violates dependency constraints
    const earliestAllowed = getEarliestStartDate(
      index,
      activities,
      projectStartDate,
      includeWeekends,
    );
    if (newStart < earliestAllowed) {
      alert(
        `This activity depends on others and cannot start before ${earliestAllowed.toLocaleDateString()}`,
      );
      return;
    }

    // Adjust start date based on "Allowed Days" constraint
    const adjustedStart = getNextValidDate(newStart, activity.allowedDays);

    const updatedActivities = activities.map((act, i) =>
      i === index ? { ...act, startDate: adjustedStart } : act,
    );

    setActivities(
      recalculateAllDates(updatedActivities, projectStartDate, includeWeekends),
    );
    setHasUnsavedChanges(true);
  };

  const handleEndDateChange = (index: number, newEndDateString: string) => {
    const activity = activities[index];
    const originalStart = activity.startDate
      ? new Date(activity.startDate)
      : new Date();
    const newEnd = new Date(newEndDateString);

    // Validate: Cannot set weekend dates if weekends are excluded
    if (!includeWeekends && (newEnd.getDay() === 0 || newEnd.getDay() === 6)) {
      alert(
        'Cannot set end date on a weekend when "Include Weekends" is not checked.',
      );
      return;
    }

    // Validation: End date cannot be before start date
    if (newEnd < originalStart) {
      alert('End date cannot be before the start date.');
      return;
    }

    // Calculate new duration based on whether weekends are included
    let newDuration: number;
    if (includeWeekends) {
      const diffTime = Math.abs(newEnd.getTime() - originalStart.getTime());
      newDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } else {
      newDuration = calculateBusinessDays(originalStart, newEnd);
    }

    const updatedActivities = activities.map((act, i) =>
      i === index ? { ...act, duration: newDuration } : act,
    );

    setActivities(
      recalculateAllDates(updatedActivities, projectStartDate, includeWeekends),
    );
    setHasUnsavedChanges(true);
  };

  const handleDependenciesChange = (
    index: number,
    newDependenciesString: string,
  ) => {
    const newDependencies = parseDependencies(newDependenciesString);

    const updatedActivities = activities.map((act, i) =>
      i === index
        ? { ...act, dependencies: newDependencies, startDate: null }
        : act,
    );

    // Validate no circular dependencies or self-references
    if (hasCircularDependency(index, updatedActivities)) {
      alert('Circular dependency detected! Please check your dependencies.');
      return;
    }

    setActivities(
      recalculateAllDates(updatedActivities, projectStartDate, includeWeekends),
    );
    setHasUnsavedChanges(true);
  };

  const handleProjectStartDateChange = (date: Date) => {
    setProjectStartDate(date);
  };

  const handleIncludeWeekendsChange = (include: boolean) => {
    setIncludeWeekends(include);
  };

  const handleSave = () => {
    saveActivities(activities);
    setHasUnsavedChanges(false);
  };

  const handleClearAll = () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear all activities? This action cannot be undone.'
    );
    if (confirmed) {
      clearActivities();
      setActivities([]);
      setHasUnsavedChanges(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-6">
          Project Timeline Tracker
        </h1>

        <ProjectControls
          projectStartDate={projectStartDate}
          onProjectStartDateChange={handleProjectStartDateChange}
          includeWeekends={includeWeekends}
          onIncludeWeekendsChange={handleIncludeWeekendsChange}
        />

        <ActivityForm onAddActivity={handleAddActivity} />

        {activities.length > 0 && (
          <div className="flex gap-3 mb-4">
            {hasUnsavedChanges && (
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded transition-colors shadow-md"
              >
                💾 Save Changes
              </button>
            )}
            <button
              onClick={handleClearAll}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded transition-colors shadow-md"
            >
              🗑️ Clear All
            </button>
          </div>
        )}

        <ActivityTable
          activities={activities}
          onDeleteActivity={handleDeleteActivity}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onDependenciesChange={handleDependenciesChange}
        />
      </div>
    </div>
  );
}

export default App;

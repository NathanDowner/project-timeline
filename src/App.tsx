import { useState, useEffect } from 'react';
import { ProjectControls } from './components/ProjectControls';
import { ActivityForm } from './components/ActivityForm';
import { ActivityTable } from './components/ActivityTable';
import {
  type Activity,
  type Project,
  parseDependencies,
  recalculateAllDates,
  hasCircularDependency,
  getEarliestStartDate,
  calculateBusinessDays,
  getNextValidDate,
  parseDateString,
  formatDateForDisplay,
  formatDateForInput,
} from './utils';
import {
  saveProject,
  loadProject,
  clearActivities,
} from './utils/storage';

function App() {
  const [projectId, setProjectId] = useState<string>(
    `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  );
  const [projectName, setProjectName] = useState<string>('My Project');
  const [projectStartDate, setProjectStartDate] = useState<string>(
    formatDateForInput(new Date()),
  );
  const [includeWeekends, setIncludeWeekends] = useState<boolean>(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Load project from localStorage on mount
  useEffect(() => {
    const loaded = loadProject();
    if (loaded) {
      setProjectId(loaded.id);
      setProjectName(loaded.name);
      setProjectStartDate(loaded.startDate);
      setIncludeWeekends(loaded.includeWeekends);
      setActivities(loaded.activities);
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
      id: (activities.length + 1).toString(),
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

  /**
   * Builds an HTML table string from an array of activities.
   *
   * @param data - An array of Activity objects to be displayed in the table
   * @returns An HTML string containing a table with columns for Name, Start Date, End Date, and Duration (Days)
   *
   * @remarks
   * - Dates are formatted using `toLocaleDateString()`
   * - If start or end dates are not available, 'N/A' is displayed
   * - Duration is displayed in days
   */
  const buildHtmlTable = (data: Activity[]) => {
    // this creates an html table string for the Name, Start Date, End Date and Duration columns
    let table =
      '<table><tr><th>Activity</th><th>Duration</th><th>Start Date</th><th>End Date</th></tr>';
    data.forEach((activity) => {
      const startDate = activity.startDate
        ? formatDateForDisplay(activity.startDate, false)
        : 'N/A';
      const endDate = activity.endDate
        ? formatDateForDisplay(activity.endDate, false)
        : 'N/A';
      table += `<tr><td>${activity.name}</td><td>${activity.duration}d</td><td>${startDate}</td><td>${endDate}</td></tr>`;
    });
    table += '</table>';
    return table;
  };

  const copyTableToClipboard = () => {
    const activitiesHTML = buildHtmlTable(activities);

    let clipboardText = 'Activity\tDuration\tStart Date\tEnd Date\n';
    activities.forEach((activity) => {
      const startDateString = activity.startDate;
      const endDateString = activity.endDate;
      clipboardText += `${activity.name}\t${activity.duration}d\t${startDateString}\t${endDateString}\n`;
    });

    const blobHtml = new Blob([activitiesHTML], { type: 'text/html' });
    const blobText = new Blob([clipboardText], { type: 'text/plain' });

    navigator.clipboard
      .write([
        new ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText,
        }),
      ])
      .then(
        () => {
          alert('Activity table copied to clipboard!');
        },
        (err) => {
          alert('Failed to copy table: ' + err);
        },
      );
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
    const newStart = parseDateString(newStartDateString);

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
      i === index
        ? { ...act, startDate: formatDateForInput(adjustedStart) }
        : act,
    );

    setActivities(
      recalculateAllDates(updatedActivities, projectStartDate, includeWeekends),
    );
    setHasUnsavedChanges(true);
  };

  const handleEndDateChange = (index: number, newEndDateString: string) => {
    const activity = activities[index];
    const originalStart = activity.startDate
      ? parseDateString(activity.startDate)
      : new Date();
    const newEnd = parseDateString(newEndDateString);

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

  const handleProjectNameChange = (name: string) => {
    setProjectName(name);
    setHasUnsavedChanges(true);
  };

  const handleProjectStartDateChange = (date: string) => {
    setProjectStartDate(date);
    setHasUnsavedChanges(true);
  };

  const handleIncludeWeekendsChange = (include: boolean) => {
    setIncludeWeekends(include);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    const project: Project = {
      id: projectId,
      name: projectName,
      startDate: projectStartDate,
      includeWeekends: includeWeekends,
      activities: activities,
    };
    saveProject(project);
    setHasUnsavedChanges(false);
  };

  const handleClearAll = () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear all activities? This action cannot be undone.',
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
          projectName={projectName}
          onProjectNameChange={handleProjectNameChange}
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

            <button
              onClick={copyTableToClipboard}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded transition-colors shadow-md"
            >
              💾 Print table
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

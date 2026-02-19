import { useEffect, useState } from 'react';
import {
  type Activity,
  formatDateForDisplay,
  formatDependencies,
} from '../utils';

interface ActivityRowProps {
  activity: Activity;
  onDeleteActivity: () => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onDependenciesChange: (dependencies: string) => void;
}

const INITIAL_ACTIVITY_ID = '1';

export function ActivityRow({
  activity,
  onDeleteActivity,
  onStartDateChange,
  onEndDateChange,
  onDependenciesChange,
}: ActivityRowProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Current input values - initialized from activity props
  const [startDateInput, setStartDateInput] = useState<string>(
    activity.startDate || '',
  );
  const [endDateInput, setEndDateInput] = useState<string>(
    activity.endDate || '',
  );
  const [depInput, setDepInput] = useState(
    formatDependencies(activity.dependencies),
  );
  const [durationInput, setDurationInput] = useState<number>(activity.duration);

  // Calculate duration based on date inputs
  useEffect(() => {
    if (startDateInput && endDateInput) {
      const start = new Date(startDateInput);
      const end = new Date(endDateInput);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDurationInput(diffDays > 0 ? diffDays : activity.duration);
    } else {
      setDurationInput(activity.duration);
    }
  }, [startDateInput, endDateInput, activity.duration]);

  // Update input values when activity prop changes (but not while editing)
  useEffect(() => {
    if (!isEditing) {
      setStartDateInput(activity.startDate || '');
      setEndDateInput(activity.endDate || '');
      setDepInput(formatDependencies(activity.dependencies));
      setDurationInput(activity.duration);
    }
  }, [
    activity.startDate,
    activity.endDate,
    activity.dependencies,
    activity.duration,
    isEditing,
  ]);

  // Check if any field has changed by comparing current input with prop values
  const hasChanges =
    startDateInput !== (activity.startDate || '') ||
    endDateInput !== (activity.endDate || '') ||
    depInput !== formatDependencies(activity.dependencies);

  const handleRowClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    // Call only the callbacks for fields that changed
    if (startDateInput !== (activity.startDate || '')) {
      onStartDateChange(startDateInput);
    }
    if (endDateInput !== (activity.endDate || '')) {
      onEndDateChange(endDateInput);
    }
    if (depInput !== formatDependencies(activity.dependencies)) {
      onDependenciesChange(depInput);
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    // Revert to original prop values
    setStartDateInput(activity.startDate || '');
    setEndDateInput(activity.endDate || '');
    setDepInput(formatDependencies(activity.dependencies));
    setDurationInput(activity.duration);
    setIsEditing(false);
  };

  return (
    <tr
      className={`transition-colors ${
        isEditing ? 'bg-blue-50' : 'hover:bg-slate-50 cursor-pointer'
      }`}
      onClick={handleRowClick}
    >
      <td className="px-4 py-3 border-b border-slate-200">
        <span className="font-mono text-slate-600">#{activity.id}</span>
      </td>
      <td className="px-4 py-3 border-b border-slate-200">
        <span className="text-slate-800">{activity.name}</span>
      </td>
      <td
        className="px-4 py-3 border-b border-slate-200"
        onClick={(e) => isEditing && e.stopPropagation()}
      >
        {activity.id === INITIAL_ACTIVITY_ID ? (
          <span className="text-slate-500 italic">None</span>
        ) : isEditing ? (
          <input
            type="text"
            value={depInput}
            onChange={(e) => setDepInput(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <span className="text-slate-800">
            {depInput || <span className="text-slate-500 italic">None</span>}
          </span>
        )}
      </td>
      <td className="px-4 py-3 border-b border-slate-200">
        {activity.allowedDays ? (
          <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
            {activity.allowedDays}
          </span>
        ) : (
          <span className="text-slate-500 italic text-sm">Any day</span>
        )}
      </td>
      <td
        className="px-4 py-3 border-b border-slate-200"
        onClick={(e) => isEditing && e.stopPropagation()}
      >
        {activity.startDate ? (
          isEditing ? (
            <input
              type="date"
              value={startDateInput}
              onChange={(e) => setStartDateInput(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <span className="text-slate-800">
              {formatDateForDisplay(startDateInput)}
            </span>
          )
        ) : (
          <span className="text-slate-500 italic">Not set</span>
        )}
      </td>
      <td className="px-4 py-3 border-b border-slate-200">
        <span className="text-slate-800 font-medium">{durationInput}</span>
        <span className="text-slate-500 text-sm ml-1">
          {durationInput === 1 ? 'day' : 'days'}
        </span>
      </td>
      <td
        className="px-4 py-3 border-b border-slate-200"
        onClick={(e) => isEditing && e.stopPropagation()}
      >
        {activity.endDate ? (
          isEditing ? (
            <input
              type="date"
              value={endDateInput}
              onChange={(e) => setEndDateInput(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <span className="text-slate-800">
              {formatDateForDisplay(endDateInput)}
            </span>
          )
        ) : (
          <span className="text-slate-500 italic">Not set</span>
        )}
      </td>
      <td
        className="px-4 py-3 border-b border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {isEditing && (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`text-xl transition-opacity ${
                hasChanges
                  ? 'hover:scale-110 cursor-pointer'
                  : 'opacity-30 cursor-not-allowed'
              }`}
              title="Save changes"
            >
              ✅
            </button>
            <button
              onClick={handleCancel}
              className="text-xl hover:scale-110 transition-transform"
              title="Cancel editing"
            >
              ❌
            </button>
            <button
              onClick={onDeleteActivity}
              className="text-xl hover:scale-110 transition-transform"
              title="Delete activity"
            >
              🗑️
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

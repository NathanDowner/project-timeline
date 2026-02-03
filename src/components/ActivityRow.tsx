import { useState } from 'react';
import {
  type Activity,
  formatDateForInput,
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
  const [depInput, setDepInput] = useState(
    formatDependencies(activity.dependencies),
  );

  return (
    <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3 border-b border-slate-200">
        <span className="font-mono text-slate-600">#{activity.id}</span>
      </td>
      <td className="px-4 py-3 border-b border-slate-200">
        <span className="text-slate-800">{activity.name}</span>
      </td>
      <td className="px-4 py-3 border-b border-slate-200">
        {activity.id === INITIAL_ACTIVITY_ID ? (
          <span className="text-slate-500 italic">None</span>
        ) : (
          <input
            type="text"
            value={depInput}
            onChange={(e) => setDepInput(e.target.value)}
            onBlur={() => onDependenciesChange(depInput)}
            className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
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
      <td className="px-4 py-3 border-b border-slate-200">
        {activity.startDate ? (
          <div className="flex flex-col gap-1">
            <input
              type="date"
              value={formatDateForInput(activity.startDate)}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="px-2 py-1 text-sm border border-slate-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 cursor-pointer"
            />
            <span className="text-xs text-slate-600">
              {formatDateForDisplay(activity.startDate)}
            </span>
          </div>
        ) : (
          <span className="text-slate-500 italic">Not set</span>
        )}
      </td>
      <td className="px-4 py-3 border-b border-slate-200">
        <span className="text-slate-800 font-medium">{activity.duration}</span>
        <span className="text-slate-500 text-sm ml-1">
          {activity.duration === 1 ? 'day' : 'days'}
        </span>
      </td>
      <td className="px-4 py-3 border-b border-slate-200">
        {activity.endDate ? (
          <div className="flex flex-col gap-1">
            <input
              type="date"
              value={formatDateForInput(activity.endDate)}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="px-2 py-1 text-sm border border-slate-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 cursor-pointer"
            />
            <span className="text-xs text-slate-600">
              {formatDateForDisplay(activity.endDate)}
            </span>
          </div>
        ) : (
          <span className="text-slate-500 italic">Not set</span>
        )}
      </td>
      <td className="px-4 py-3 border-b border-slate-200">
        <button
          onClick={onDeleteActivity}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3 py-1.5 rounded transition-colors"
        >
          Remove
        </button>
      </td>
    </tr>
  );
}

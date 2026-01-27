import {
  type Activity,
  formatDateForInput,
  formatDateForDisplay,
  formatDependencies,
} from '../utils';

interface ActivityTableProps {
  activities: Activity[];
  onDeleteActivity: (index: number) => void;
  onStartDateChange: (index: number, date: string) => void;
  onEndDateChange: (index: number, date: string) => void;
  onDependenciesChange: (index: number, dependencies: string) => void;
}

const columns = [
  { label: 'ID', width: 'w-[6%]' },
  { label: 'Activity', width: 'w-[18%]' },
  { label: 'Dependencies', width: 'w-[12%]' },
  { label: 'Constraints', width: 'w-[14%]' },
  { label: 'Est. Start (Editable)', width: 'w-[14%]' },
  { label: 'Duration', width: 'w-[9%]' },
  { label: 'Est. End (Editable)', width: 'w-[17%]' },
  { label: 'Action', width: 'w-[10%]' },
];

export function ActivityTable({
  activities,
  onDeleteActivity,
  onStartDateChange,
  onEndDateChange,
  onDependenciesChange,
}: ActivityTableProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-slate-500">
        No activities yet. Add your first activity above to get started.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              {columns.map((column) => (
                <th
                  key={column.label}
                  className={`text-left px-4 py-3 font-semibold text-slate-700 border-b border-slate-200 ${column.width}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr
                key={activity.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3 border-b border-slate-200">
                  <span className="font-mono text-slate-600">#{index + 1}</span>
                </td>
                <td className="px-4 py-3 border-b border-slate-200">
                  <span className="text-slate-800">{activity.name}</span>
                </td>
                <td className="px-4 py-3 border-b border-slate-200">
                  {index === 0 ? (
                    <span className="text-slate-500 italic">None</span>
                  ) : (
                    <input
                      type="text"
                      value={formatDependencies(activity.dependencies)}
                      onChange={(e) =>
                        onDependenciesChange(index, e.target.value)
                      }
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
                    <span className="text-slate-500 italic text-sm">
                      Any day
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 border-b border-slate-200">
                  {activity.startDate ? (
                    <div className="flex flex-col gap-1">
                      <input
                        type="date"
                        value={formatDateForInput(activity.startDate)}
                        onChange={(e) =>
                          onStartDateChange(index, e.target.value)
                        }
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
                  <span className="text-slate-800 font-medium">
                    {activity.duration}
                  </span>
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
                        onChange={(e) => onEndDateChange(index, e.target.value)}
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
                    onClick={() => onDeleteActivity(index)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3 py-1.5 rounded transition-colors"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

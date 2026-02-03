import { type Activity } from '../utils';
import { ActivityRow } from './ActivityRow';

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
  { label: 'Est. Start Date', width: 'w-[14%]' },
  { label: 'Duration', width: 'w-[9%]' },
  { label: 'Est. End Date', width: 'w-[17%]' },
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
              <ActivityRow
                key={activity.id}
                activity={activity}
                onDeleteActivity={() => onDeleteActivity(index)}
                onStartDateChange={(date: string) =>
                  onStartDateChange(index, date)
                }
                onEndDateChange={(date: string) => onEndDateChange(index, date)}
                onDependenciesChange={(dependencies: string) =>
                  onDependenciesChange(index, dependencies)
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

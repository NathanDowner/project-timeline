interface ProjectControlsProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  projectStartDate: string;
  onProjectStartDateChange: (date: string) => void;
  includeWeekends: boolean;
  onIncludeWeekendsChange: (include: boolean) => void;
}

export function ProjectControls({
  projectName,
  onProjectNameChange,
  projectStartDate,
  onProjectStartDateChange,
  includeWeekends,
  onIncludeWeekendsChange,
}: ProjectControlsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-slate-600 mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            placeholder="Enter project name"
            className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-slate-600 mb-2">
            Project Start Date
          </label>
          <input
            type="date"
            value={projectStartDate}
            onChange={(e) => onProjectStartDateChange(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="includeWeekends"
            checked={includeWeekends}
            onChange={(e) => onIncludeWeekendsChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="includeWeekends" className="text-sm font-semibold text-slate-600">
            Include Weekends in Calculations
          </label>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';

interface ActivityFormProps {
  onAddActivity: (
    name: string,
    duration: number,
    dependencies: string,
    allowedDays: string,
  ) => void;
}

export function ActivityForm({ onAddActivity }: ActivityFormProps) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('1');
  const [dependencies, setDependencies] = useState('');
  const [allowedDays, setAllowedDays] = useState('');

  const handleSubmit = () => {
    if (!name || !duration) {
      alert('Please enter a name and duration.');
      return;
    }

    onAddActivity(name, parseInt(duration), dependencies, allowedDays);

    // Clear inputs
    setName('');
    setDuration('1');
    setDependencies('');
    setAllowedDays('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="border-b border-slate-200 mb-4 pb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Add New Activity
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-slate-600 mb-2">
            Activity Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Design Phase"
            className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-slate-600 mb-2">
            Duration (Days)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="1"
            className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-slate-600 mb-2">
            Dependencies (Optional)
          </label>
          <input
            type="text"
            value={dependencies}
            onChange={(e) => setDependencies(e.target.value)}
            placeholder="e.g. 1, 2"
            className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-slate-600 mb-2">
            Allowed Start Days (Optional)
          </label>
          <input
            type="text"
            value={allowedDays}
            onChange={(e) => setAllowedDays(e.target.value)}
            placeholder="e.g. Mon, Thu"
            className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded transition-colors"
        >
          Add Activity
        </button>
      </div>
    </div>
  );
}

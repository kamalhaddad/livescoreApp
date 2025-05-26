import React from 'react';

export type GameStatus = 'all' | 'live' | 'finished' | 'scheduled';
export type SortOption = 'time' | 'league' | 'team';

interface FilterBarProps {
  selectedStatus: GameStatus;
  selectedSort: SortOption;
  onStatusChange: (status: GameStatus) => void;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedStatus,
  selectedSort,
  onStatusChange,
  onSortChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="bg-white shadow-sm p-4 mb-4 sticky top-0 z-10">
      <div className="flex flex-col space-y-4">
        {/* Search Input */}
        <div>
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {(['all', 'live', 'finished', 'scheduled'] as GameStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedStatus === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <div className="flex space-x-2">
            {([
              { value: 'time', label: 'Time' },
              { value: 'league', label: 'League' },
              { value: 'team', label: 'Team' },
            ] as { value: SortOption; label: string }[]).map((option) => (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedSort === option.value
                    ? 'bg-gray-200 text-gray-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 
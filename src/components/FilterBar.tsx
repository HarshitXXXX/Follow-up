import React from 'react';
import { Search, X, Filter, User, MapPin, Folder } from 'lucide-react';
import { EffectiveStatus, FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  assignees: string[];
  villages: string[];
  projects: string[];
  statusCounts: Record<'all' | EffectiveStatus, number>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  assignees,
  villages,
  projects,
  statusCounts,
}) => {
  const chips: Array<{ key: 'all' | EffectiveStatus; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'progress', label: 'In Progress' },
    { key: 'done', label: 'Done' },
    { key: 'overdue', label: 'Overdue' },
  ];

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.assignee) ||
    Boolean(filters.village) ||
    Boolean(filters.project) ||
    filters.status !== 'all';

  return (
    <div className="space-y-3 mb-5">
      {/* Top Filter Row: Search & Dropdowns */}
      <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93A0AC]" />
          <input
            id="search-tasks-input"
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search task, name, village, or assignee..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#DCE1E6] bg-white text-sm text-[#1B2430] placeholder-[#93A0AC] focus:outline-none focus:border-[#4C5FD5] focus:ring-2 focus:ring-[#4C5FD5]/15 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC] hover:text-[#1B2430] p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Assignee Filter */}
        <div className="relative min-w-[140px]">
          <select
            id="select-assignee-filter"
            value={filters.assignee}
            onChange={(e) => onFilterChange({ assignee: e.target.value })}
            className="w-full pl-8 pr-7 py-2.5 rounded-xl border border-[#DCE1E6] bg-white text-xs sm:text-sm text-[#1B2430] focus:outline-none focus:border-[#4C5FD5] focus:ring-2 focus:ring-[#4C5FD5]/15 transition-all cursor-pointer appearance-none"
          >
            <option value="">All Assignees</option>
            {assignees.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC] pointer-events-none" />
        </div>

        {/* Village Filter */}
        {villages.length > 0 && (
          <div className="relative min-w-[140px]">
            <select
              id="select-village-filter"
              value={filters.village}
              onChange={(e) => onFilterChange({ village: e.target.value })}
              className="w-full pl-8 pr-7 py-2.5 rounded-xl border border-[#DCE1E6] bg-white text-xs sm:text-sm text-[#1B2430] focus:outline-none focus:border-[#4C5FD5] focus:ring-2 focus:ring-[#4C5FD5]/15 transition-all cursor-pointer appearance-none"
            >
              <option value="">All Villages</option>
              {villages.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC] pointer-events-none" />
          </div>
        )}

        {/* Project Filter (if any exist) */}
        {projects.length > 0 && (
          <div className="relative min-w-[140px]">
            <select
              id="select-project-filter"
              value={filters.project}
              onChange={(e) => onFilterChange({ project: e.target.value })}
              className="w-full pl-8 pr-7 py-2.5 rounded-xl border border-[#DCE1E6] bg-white text-xs sm:text-sm text-[#1B2430] focus:outline-none focus:border-[#4C5FD5] focus:ring-2 focus:ring-[#4C5FD5]/15 transition-all cursor-pointer appearance-none"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <Folder className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#93A0AC] pointer-events-none" />
          </div>
        )}

        {hasActiveFilters && (
          <button
            onClick={() =>
              onFilterChange({
                search: '',
                assignee: '',
                village: '',
                project: '',
                status: 'all',
              })
            }
            className="text-xs text-[#D6604D] hover:bg-[#FBE7E3] px-3 py-2 rounded-xl transition-colors border border-transparent hover:border-[#D6604D]/30 flex items-center justify-center gap-1 cursor-pointer font-medium whitespace-nowrap"
            title="Clear all active filters"
          >
            <Filter className="w-3 h-3" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Bottom Status Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {chips.map((chip) => {
          const isActive = filters.status === chip.key;
          const count = statusCounts[chip.key] ?? 0;
          return (
            <button
              key={chip.key}
              id={`filter-chip-${chip.key}`}
              onClick={() => onFilterChange({ status: chip.key })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-[#1B2430] text-white shadow-xs'
                  : 'bg-white text-[#5B6472] border border-[#DCE1E6] hover:bg-[#F3F5F7] hover:text-[#1B2430]'
              }`}
            >
              <span>{chip.label}</span>
              <span
                className={`text-[10.5px] px-1.5 py-0.2 rounded-full font-mono-code ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[#EEF1F4] text-[#5B6472]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

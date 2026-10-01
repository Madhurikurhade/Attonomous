import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CampaignRecord } from '../../types';
import { Search, Check, ChevronDown, Calendar as CalendarIcon } from 'lucide-react';
import { CustomMultiSelectDropdown } from './CustomMultiSelectDropdown';
import { isDateInPast } from '../home/CreatedDateDropdown';

export function getCampaignQueueStatus(c: CampaignRecord): 'Launch' | 'Launched' {
  if (c.status === 'Launched' || c.status === 'Scheduled' || c.status === 'Completed') {
    return 'Launched';
  }
  return 'Launch';
}

interface CampaignQueueScreenProps {
  campaigns: CampaignRecord[];
  onOpenReviewLaunch: (campaign: CampaignRecord) => void;
  onRefresh: () => void;
}

export const CampaignQueueScreen: React.FC<CampaignQueueScreenProps> = ({
  campaigns,
  onOpenReviewLaunch,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Launch' | 'Launched'>('All');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Close status dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    if (isStatusDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStatusDropdownOpen]);

  const channelsList = ['WhatsApp', 'SMS', 'RCS'];

  // Constraint: On campaign queue screen only today's campaigns are shown.
  // Past approved non-launched campaigns show on the Campaigns screen.
  const queueCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const rawDate = c.launchDate || c.decisionDate;
      const past = isDateInPast(rawDate);
      if (past) {
        return false;
      }
      return c.status === 'Approved' || c.status === 'Scheduled' || c.status === 'Launched';
    });
  }, [campaigns]);

  const allUseCases = useMemo(() => {
    return Array.from(new Set(queueCampaigns.map((c) => c.useCaseName)));
  }, [queueCampaigns]);

  const filtered = useMemo(() => {
    return queueCampaigns.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          c.campaignName.toLowerCase().includes(q) ||
          c.useCaseName.toLowerCase().includes(q) ||
          c.theme.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (selectedChannels.length > 0 && !selectedChannels.includes(c.channel)) {
        return false;
      }
      if (selectedUseCases.length > 0 && !selectedUseCases.includes(c.useCaseName)) {
        return false;
      }
      if (statusFilter !== 'All') {
        const qStatus = getCampaignQueueStatus(c);
        if (qStatus !== statusFilter) {
          return false;
        }
      }
      return true;
    });
  }, [queueCampaigns, searchQuery, selectedChannels, selectedUseCases, statusFilter]);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  return (
    <div className="space-y-5 font-body">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#1A1816] tracking-tight">Campaign Queue</h1>
          <p className="text-[13px] text-[#706B62] mt-0.5">
            Review and validate campaigns before launch
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefreshClick}
          className="px-4 py-1.5 rounded-[8px] text-[13px] font-medium text-[#FF5C35] border border-[#FF5C35] bg-transparent hover:bg-[#FF5C35]/5 active:bg-[#FF5C35]/10 transition-colors cursor-pointer"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* ── Filter Bar (matching Image 5: Use Case Name, Select Channel, Status filter, Today filter) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Entries........"
            className="w-full h-[40px] pl-3.5 pr-9 bg-white border border-[#D5D0C7] rounded-[8px] text-[13px] text-[#1A1816] placeholder:text-[#9E988E] outline-none focus:border-[#1A1816] transition-colors shadow-2xs"
          />
          <Search className="w-4 h-4 text-[#807A70] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Use Case Dropdown */}
        <CustomMultiSelectDropdown
          label="Use Case Name"
          options={allUseCases}
          selected={selectedUseCases}
          onChange={setSelectedUseCases}
          searchPlaceholder="Search use cases..."
          dropdownWidth="w-full sm:w-[360px]"
        />

        {/* Channel Dropdown */}
        <CustomMultiSelectDropdown
          label="Select Channel"
          options={channelsList}
          selected={selectedChannels}
          onChange={setSelectedChannels}
          searchPlaceholder="Search..."
          dropdownWidth="w-full sm:w-[260px]"
        />

        {/* Status Dropdown: Launch / Pending vs Launched (matching Image 5) */}
        <div className="relative" ref={statusDropdownRef}>
          <button
            type="button"
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className={`w-full h-[40px] px-3.5 bg-white border rounded-[8px] text-[13px] flex items-center justify-between shadow-2xs transition-colors cursor-pointer ${
              statusFilter !== 'All'
                ? 'border-[#FF5C35] text-[#1A1816] font-medium'
                : 'border-[#D5D0C7] text-[#1A1816] hover:border-[#807A70]'
            }`}
          >
            <span className={statusFilter === 'All' ? 'text-[#807A70]' : 'text-[#1A1816] font-medium'}>
              {statusFilter === 'All'
                ? 'Select Status'
                : statusFilter === 'Launch'
                ? 'Launch (Pending)'
                : 'Launched'}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-[#807A70] transition-transform ${
                isStatusDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isStatusDropdownOpen && (
            <div className="absolute left-0 top-[calc(100%+4px)] w-full min-w-[180px] bg-white border border-[#D5D0C7] rounded-[8px] shadow-lg z-50 py-1 font-body">
              {(
                [
                  { key: 'All', label: 'All Status' },
                  { key: 'Launch', label: 'Launch (Pending)' },
                  { key: 'Launched', label: 'Launched' },
                ] as const
              ).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setStatusFilter(item.key);
                    setIsStatusDropdownOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left text-[13px] flex items-center justify-between transition-colors hover:bg-[#FAF8F5] cursor-pointer ${
                    statusFilter === item.key
                      ? 'font-semibold text-[#FF5C35] bg-[#FFF5F2]'
                      : 'text-[#1A1816]'
                  }`}
                >
                  <span>{item.label}</span>
                  {statusFilter === item.key && (
                    <Check className="w-3.5 h-3.5 text-[#FF5C35]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Filter: Today only (matching Image 5: orange calendar icon & border) */}
        <div className="h-[40px] px-3.5 bg-white border border-[#FF5C35] rounded-[8px] flex items-center justify-between shadow-2xs select-none">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#FF5C35]" />
            <span className="text-[13px] font-medium text-[#1A1816]">Today</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#807A70]" />
        </div>
      </div>

      {/* ── Section Title: Approved & Launched Campaigns (Image 3 & 4: outside table, between filter & table) ── */}
      <div className="flex items-center justify-between text-[13px] text-[#706B62]">
        <span>Approved &amp; Launched Campaigns</span>
      </div>

      {/* ── Table Container ─────────────────────────────────────────────────── */}
      <div className="w-full bg-white rounded-[12px] border border-[#E2DDD5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[960px]">
            <thead>
              <tr className="bg-[#DDD6C9] border-b border-[#D5CEC0] text-[13px] font-bold text-[#1A1816]">
                <th className="py-3 px-4 font-bold">Campaign Name</th>
                <th className="py-3 px-4 font-bold">Use Case Name</th>
                <th className="py-3 px-3 font-bold text-center">Channel</th>
                <th className="py-3 px-3 font-bold text-center">Audience Count</th>
                <th className="py-3 px-3 font-bold text-center">Spent</th>
                <th className="py-3 px-3 font-bold text-center">Theme</th>
                <th className="py-3 px-3 font-bold text-center">Launch Date</th>
                <th className="py-3 px-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE5DC] text-[12.5px] text-[#2D2A26]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-[#8C857B]">
                    No campaigns waiting in queue.
                  </td>
                </tr>
              ) : (
                filtered.map((camp) => {
                  const qStatus = getCampaignQueueStatus(camp);
                  return (
                    <tr
                      key={camp.id}
                      className="hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                      onClick={() => onOpenReviewLaunch(camp)}
                    >
                      <td className="py-3.5 px-4 font-semibold text-[#1A1816] max-w-[220px] truncate group-hover:text-[#FF5C35] transition-colors">
                        {camp.campaignName}
                      </td>
                      <td className="py-3.5 px-4 text-[#555047] max-w-[200px] truncate">
                        {camp.useCaseName}
                      </td>
                      <td className="py-3.5 px-3 font-medium text-[#1A1816] text-center">
                        <span className="px-2 py-0.5 rounded-[4px] bg-[#F2EEE7] text-[11px] font-semibold">
                          {camp.channel}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-data font-medium text-[#1A1816] text-center">
                        {camp.audienceCount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 font-data text-[#555047] text-center">
                        ₹ {camp.spent.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-[#555047] text-center">
                        {camp.theme}
                      </td>
                      <td className="py-3.5 px-3 text-[#706B62] text-[12px] font-data text-center">
                        {camp.launchDate || camp.decisionDate}
                      </td>
                      {/* Action column */}
                      <td className="py-3.5 px-4 text-center">
                        {qStatus === 'Launch' ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenReviewLaunch(camp);
                            }}
                            className="text-[#FF5C35] hover:text-[#E04823] font-semibold text-[13px] hover:underline cursor-pointer"
                          >
                            Launch
                          </button>
                        ) : (
                          <span className="text-[#1E40AF] font-medium text-[13px]">
                            Launched
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  Eye,
  Plus,
} from 'lucide-react';

interface ContentStudioViewProps {
  onBackToHome: () => void;
}

interface TemplateItem {
  id: string;
  name: string;
  channel: 'WhatsApp' | 'RCS' | 'SMS' | 'Push';
  status: 'Approved' | 'In Review' | 'Draft';
  lastEdited: string;
  author: string;
  variantsCount: number;
}

const MOCK_TEMPLATES: TemplateItem[] = [
  {
    id: 'tmpl-01',
    name: 'Personal Loan Pre-Approved Festival Offer',
    channel: 'WhatsApp',
    status: 'Approved',
    lastEdited: 'Today at 10:15 AM',
    author: 'Marketing Team',
    variantsCount: 3,
  },
  {
    id: 'tmpl-02',
    name: 'Instant Credit Line Upgrade Reminder',
    channel: 'RCS',
    status: 'Approved',
    lastEdited: 'Yesterday',
    author: 'Growth Ops',
    variantsCount: 2,
  },
  {
    id: 'tmpl-03',
    name: 'EMI Card Activation & Cashback Voucher',
    channel: 'SMS',
    status: 'In Review',
    lastEdited: '2 days ago',
    author: 'Lifecycle Marketing',
    variantsCount: 4,
  },
  {
    id: 'tmpl-04',
    name: 'Co-Branded Gold Card Limited Edition Alert',
    channel: 'Push',
    status: 'Draft',
    lastEdited: '15 Sept 2026',
    author: 'Brand Studio',
    variantsCount: 2,
  },
];

export const ContentStudioView: React.FC<ContentStudioViewProps> = ({ onBackToHome }) => {
  const [selectedChannel, setSelectedChannel] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filtered = MOCK_TEMPLATES.filter((t) => {
    if (selectedChannel !== 'All' && t.channel !== selectedChannel) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header & Back Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E2DDD5]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="p-2 rounded-[8px] bg-white border border-[#D5D0C7] text-[#706B62] hover:text-[#1A1816] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            title="Back to Decisioning Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[6px] bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#FF5C35]">
                <Sparkles className="w-4 h-4" />
              </div>
              <h1 className="text-[20px] font-bold text-[#1A1816]">Content Studio</h1>
            </div>
            <p className="text-[12.5px] text-[#706B62] mt-0.5">
              Create, manage, and approve campaign content and creative variants across channels while maintaining brand consistency.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="px-4 py-2 bg-[#FF5C35] hover:bg-[#E04823] text-white text-[13px] font-medium rounded-[7px] transition-colors cursor-pointer flex items-center gap-2 shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Content Variant</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-[10px] border border-[#E2DDD5] shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All', 'WhatsApp', 'RCS', 'SMS', 'Push'].map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => setSelectedChannel(ch)}
              className={`px-3.5 py-1.5 rounded-[6px] text-[12.5px] font-medium transition-colors cursor-pointer ${
                selectedChannel === ch
                  ? 'bg-[#1A1816] text-white'
                  : 'text-[#706B62] hover:bg-[#F2EEE7] hover:text-[#1A1816]'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#807A70] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full h-9 pl-9 pr-3 bg-[#FAF8F5] border border-[#D5D0C7] rounded-[7px] text-[12.5px] text-[#1A1816] outline-none focus:bg-white focus:border-[#FF5C35]"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[10px] border border-[#E2DDD5] p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-[#FAF8F5] text-[#1A1816] border border-[#E8E4DC]">
                  {item.channel}
                </span>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1 ${
                    item.status === 'Approved'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : item.status === 'In Review'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                  }`}
                >
                  {item.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                  {item.status === 'In Review' && <Clock className="w-3 h-3" />}
                  <span>{item.status}</span>
                </span>
              </div>

              <h4 className="text-[14.5px] font-bold text-[#1A1816] leading-snug">
                {item.name}
              </h4>
            </div>

            <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-[12px] text-[#807A70]">
              <span>{item.variantsCount} variants</span>
              <span>{item.lastEdited}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

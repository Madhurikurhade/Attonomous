import React, { useState } from 'react';
import {
  Shield,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Lock,
  History,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface GovernanceViewProps {
  onBackToHome: () => void;
}

interface GovernanceRule {
  id: string;
  name: string;
  category: 'Compliance' | 'Frequency Capping' | 'Suppression' | 'Approvals';
  description: string;
  status: 'Active' | 'Enforced' | 'Draft';
  enabled: boolean;
  lastAudited: string;
}

const MOCK_RULES: GovernanceRule[] = [
  {
    id: 'gov-01',
    name: 'TRAI Commercial Communications DND Scrubbing',
    category: 'Compliance',
    description: 'Mandatory real-time scrubbing against national Do Not Disturb (NDNC) database prior to send.',
    status: 'Enforced',
    enabled: true,
    lastAudited: 'Today at 08:30 AM',
  },
  {
    id: 'gov-02',
    name: 'Customer Contact Frequency Limit (Max 2 per week)',
    category: 'Frequency Capping',
    description: 'Prevents customer fatigue by capping promotional interactions to a maximum of 2 campaigns every 7 days.',
    status: 'Active',
    enabled: true,
    lastAudited: 'Yesterday',
  },
  {
    id: 'gov-03',
    name: 'Dual-Review Requirement for High-Value Loan Offers',
    category: 'Approvals',
    description: 'Campaigns offering credit limits > ₹5,00,000 require secondary risk manager approval.',
    status: 'Enforced',
    enabled: true,
    lastAudited: '18 Sept 2026',
  },
  {
    id: 'gov-04',
    name: 'Mandatory WhatsApp Opt-in Consent Verification',
    category: 'Suppression',
    description: 'Suppresses records where Whats_consent_flag is 0 or empty for outbound WhatsApp campaigns.',
    status: 'Enforced',
    enabled: true,
    lastAudited: '15 Sept 2026',
  },
];

export const GovernanceView: React.FC<GovernanceViewProps> = ({ onBackToHome }) => {
  const [rules, setRules] = useState<GovernanceRule[]>(MOCK_RULES);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

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
                <Shield className="w-4 h-4" />
              </div>
              <h1 className="text-[20px] font-bold text-[#1A1816]">Governance</h1>
            </div>
            <p className="text-[12.5px] text-[#706B62] mt-0.5">
              Manage approvals, controls, compliance, rules, and audit visibility across the campaign lifecycle.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-[#15803D] bg-[#DCFCE7] px-3 py-1 rounded-[6px] border border-[#86EFAC] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Compliance Engine: 100% Passed</span>
          </span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[10px] border border-[#E2DDD5] shadow-2xs space-y-1">
          <span className="text-[11.5px] font-medium text-[#807A70] uppercase tracking-wider">Active Guardrails</span>
          <div className="text-[22px] font-bold text-[#1A1816]">14 Rules</div>
          <span className="text-[11.5px] text-[#15803D]">All operational and synced</span>
        </div>

        <div className="bg-white p-5 rounded-[10px] border border-[#E2DDD5] shadow-2xs space-y-1">
          <span className="text-[11.5px] font-medium text-[#807A70] uppercase tracking-wider">Audited Records Today</span>
          <div className="text-[22px] font-bold text-[#1A1816]">248,910</div>
          <span className="text-[11.5px] text-[#706B62]">100% compliance adherence</span>
        </div>

        <div className="bg-white p-5 rounded-[10px] border border-[#E2DDD5] shadow-2xs space-y-1">
          <span className="text-[11.5px] font-medium text-[#807A70] uppercase tracking-wider">Pending Approvals</span>
          <div className="text-[22px] font-bold text-[#1A1816]">0</div>
          <span className="text-[11.5px] text-[#706B62]">All queue items cleared</span>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-[10px] border border-[#E2DDD5] shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2DDD5] flex items-center justify-between">
          <h3 className="text-[14.5px] font-bold text-[#1A1816]">Active Governance Rules</h3>
          <span className="text-[12px] text-[#807A70]">Enterprise Security &amp; Compliance Policy</span>
        </div>

        <div className="divide-y divide-[#EAE5DD]">
          {rules.map((rule) => (
            <div key={rule.id} className="p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-[#FAF8F5] text-[#1A1816] border border-[#E8E4DC]">
                    {rule.category}
                  </span>
                  <h4 className="text-[14px] font-bold text-[#1A1816]">{rule.name}</h4>
                </div>
                <p className="text-[12.5px] text-[#706B62]">{rule.description}</p>
                <div className="text-[11px] text-[#807A70] pt-1">
                  Last verified: {rule.lastAudited}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleRule(rule.id)}
                  className="cursor-pointer"
                  title="Toggle rule status"
                >
                  {rule.enabled ? (
                    <ToggleRight className="w-8 h-8 text-[#FF5C35]" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-[#A8A299]" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

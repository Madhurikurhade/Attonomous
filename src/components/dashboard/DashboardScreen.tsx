import React from 'react';
import {
  Box,
  Brain,
  TrendingUp,
  Sparkles,
  Shield,
} from 'lucide-react';

interface DashboardScreenProps {
  userName?: string;
  onNavigateOrchestration: () => void;
  onNavigateCampaigns: () => void;
  onNavigateAnalytics: () => void;
  onNavigateContentStudio: () => void;
  onNavigateGovernance: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userName = 'Madhuri',
  onNavigateOrchestration,
  onNavigateCampaigns,
  onNavigateAnalytics,
  onNavigateContentStudio,
  onNavigateGovernance,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 sm:px-10 md:px-14 py-8 sm:py-10 bg-[#F4F1EB] min-h-full font-body select-none">
      <div className="max-w-6xl mx-auto space-y-7">
        {/* ── Top Welcome Header (Matching Image 2) ───────────────────────── */}
        <div>
          <h1 className="text-[32px] sm:text-[36px] font-serif font-bold text-[#1A1816] tracking-tight">
            Welcome, {userName}
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#2C2824] mt-1 font-medium">
            Your AI-Powered Decisioning Hub is active and optimizing
          </p>
        </div>

        {/* ── White Rounded Container Card (Matching Image 2) ─────────────── */}
        <div className="bg-white rounded-[16px] p-6 sm:p-10 border border-[#E5DFD5] shadow-xs">
          {/* Top Row: 3 Cards (Use Case Orchestration, Campaigns, Analytics) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Use Case Orchestration */}
            <div className="bg-[#FAF8F5] rounded-[10px] p-6 sm:p-7 flex flex-col justify-between border border-[#EDE8E0] hover:border-[#D5D0C7] transition-all shadow-2xs">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center text-[#1A1816]">
                    <Box className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h2 className="text-[17px] font-serif font-bold text-[#1A1816]">
                    Use Case Orchestration
                  </h2>
                </div>
                <p className="text-[13px] text-[#4A453E] leading-relaxed mt-4">
                  Define business objectives, configure use cases, and drive 1:1
                  customer decisioning.
                </p>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={onNavigateOrchestration}
                  className="px-4 py-2 bg-[#FF5C35] hover:bg-[#E04F2E] text-white text-[12.5px] font-semibold rounded-[4px] shadow-2xs transition-colors cursor-pointer active:scale-98"
                >
                  Open Use Case Orchestration
                </button>
              </div>
            </div>

            {/* Card 2: Campaigns */}
            <div className="bg-[#FAF8F5] rounded-[10px] p-6 sm:p-7 flex flex-col justify-between border border-[#EDE8E0] hover:border-[#D5D0C7] transition-all shadow-2xs">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center text-[#1A1816]">
                    <Brain className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h2 className="text-[17px] font-serif font-bold text-[#1A1816]">
                    Campaigns
                  </h2>
                </div>
                <p className="text-[13px] text-[#4A453E] leading-relaxed mt-4">
                  Configure, execute, and manage personalized campaigns across
                  channels.
                </p>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={onNavigateCampaigns}
                  className="px-4 py-2 bg-[#FF5C35] hover:bg-[#E04F2E] text-white text-[12.5px] font-semibold rounded-[4px] shadow-2xs transition-colors cursor-pointer active:scale-98"
                >
                  Open Campaigns
                </button>
              </div>
            </div>

            {/* Card 3: Analytics */}
            <div className="bg-[#FAF8F5] rounded-[10px] p-6 sm:p-7 flex flex-col justify-between border border-[#EDE8E0] hover:border-[#D5D0C7] transition-all shadow-2xs">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center text-[#1A1816]">
                    <TrendingUp className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h2 className="text-[17px] font-serif font-bold text-[#1A1816]">
                    Analytics
                  </h2>
                </div>
                <p className="text-[13px] text-[#4A453E] leading-relaxed mt-4">
                  Measure Use Case performance, customer outcomes, and business
                  impact in real time.
                </p>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={onNavigateAnalytics}
                  className="px-4 py-2 bg-[#FF5C35] hover:bg-[#E04F2E] text-white text-[12.5px] font-semibold rounded-[4px] shadow-2xs transition-colors cursor-pointer active:scale-98"
                >
                  Open Analytics
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: 2 Centered Cards (Content Studio, Governance) */}
          <div className="flex flex-col md:flex-row justify-center gap-6 mt-6">
            {/* Card 4: Content Studio */}
            <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-[#FAF8F5] rounded-[10px] p-6 sm:p-7 flex flex-col justify-between border border-[#EDE8E0] hover:border-[#D5D0C7] transition-all shadow-2xs">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center text-[#1A1816]">
                    <Sparkles className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h2 className="text-[17px] font-serif font-bold text-[#1A1816]">
                    Content Studio
                  </h2>
                </div>
                <p className="text-[13px] text-[#4A453E] leading-relaxed mt-4">
                  Create, manage, and approve personalized content for campaign
                  execution.
                </p>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={onNavigateContentStudio}
                  className="px-4 py-2 bg-[#FF5C35] hover:bg-[#E04F2E] text-white text-[12.5px] font-semibold rounded-[4px] shadow-2xs transition-colors cursor-pointer active:scale-98"
                >
                  Open Content Studio
                </button>
              </div>
            </div>

            {/* Card 5: Governance */}
            <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-[#FAF8F5] rounded-[10px] p-6 sm:p-7 flex flex-col justify-between border border-[#EDE8E0] hover:border-[#D5D0C7] transition-all shadow-2xs">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center text-[#1A1816]">
                    <Shield className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h2 className="text-[17px] font-serif font-bold text-[#1A1816]">
                    Governance
                  </h2>
                </div>
                <p className="text-[13px] text-[#4A453E] leading-relaxed mt-4">
                  Enforce system-wide governance, consent, compliance, and
                  communication controls.
                </p>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={onNavigateGovernance}
                  className="px-4 py-2 bg-[#FF5C35] hover:bg-[#E04F2E] text-white text-[12.5px] font-semibold rounded-[4px] shadow-2xs transition-colors cursor-pointer active:scale-98"
                >
                  Open Governance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

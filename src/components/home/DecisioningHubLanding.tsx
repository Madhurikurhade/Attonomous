import React from 'react';
import { OrchestrationIcon } from '../icons/OrchestrationIcon';
import {
  Megaphone,
  TrendingUp,
  Sparkles,
  Shield,
  ArrowRight,
} from 'lucide-react';

interface DecisioningHubLandingProps {
  userName?: string;
  onOpenUseCaseOrchestration: () => void;
  onOpenCampaignConfiguration: () => void;
  onOpenAnalytics: () => void;
  onOpenContentStudio: () => void;
  onOpenGovernance: () => void;
}

export const DecisioningHubLanding: React.FC<DecisioningHubLandingProps> = ({
  userName = 'Shashank',
  onOpenUseCaseOrchestration,
  onOpenCampaignConfiguration,
  onOpenAnalytics,
  onOpenContentStudio,
  onOpenGovernance,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 sm:py-10 space-y-8 animate-in fade-in duration-200">
      {/* ── Top Welcome Header ─────────────────────────────────────────────── */}
      <div className="space-y-1">
        <h1 className="text-[26px] sm:text-[28px] font-bold text-[#1A1816] tracking-tight">
          Welcome back, {userName}
        </h1>
        <p className="text-[14px] sm:text-[15px] text-[#706B62]">
          Your AI-Powered Decisioning Hub is active and optimizing.
        </p>
      </div>

      {/* ── Module Cards Layout: 3 + 2 ────────────────────────────────────── */}
      <div className="space-y-6">
        {/* Top Row — 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: Use Case Orchestration (Primary Entry Point) */}
          <div className="bg-white rounded-[12px] border border-[#E2DDD5] p-7 shadow-2xs hover:shadow-md hover:border-[#D5D0C7] transition-all flex flex-col justify-between h-full group">
            <div className="space-y-4">
              {/* Icon at top - Using the user's uploaded 4-square icon */}
              <div className="flex items-center">
                <OrchestrationIcon size={44} className="shadow-2xs rounded-[10px]" />
              </div>

              {/* Title */}
              <h3 className="text-[17px] font-bold text-[#1A1816] tracking-tight">
                Use Case Orchestration
              </h3>

              {/* Description (1-2 lines) */}
              <p className="text-[13px] text-[#706B62] leading-relaxed line-clamp-2">
                Define business objectives, configure audiences and suppression, and orchestrate AI-driven decisions to determine the right campaign outcome.
              </p>
            </div>

            {/* CTA button at bottom */}
            <div className="pt-6">
              <button
                type="button"
                onClick={onOpenUseCaseOrchestration}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF5C35] hover:bg-[#E04823] text-white text-[13px] font-medium rounded-[7px] transition-colors cursor-pointer shadow-2xs"
              >
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                <span>Open Use Case Orchestration</span>
              </button>
            </div>
          </div>

          {/* Card 2: Campaign Configuration */}
          <div className="bg-white rounded-[12px] border border-[#E2DDD5] p-7 shadow-2xs hover:shadow-md hover:border-[#D5D0C7] transition-all flex flex-col justify-between h-full group">
            <div className="space-y-4">
              {/* Icon at top */}
              <div className="w-11 h-11 rounded-[10px] bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#1A1816]">
                <Megaphone className="w-5 h-5 text-[#FF5C35] stroke-[1.8]" />
              </div>

              {/* Title */}
              <h3 className="text-[17px] font-bold text-[#1A1816] tracking-tight">
                Campaign Configuration
              </h3>

              {/* Description (1-2 lines) */}
              <p className="text-[13px] text-[#706B62] leading-relaxed line-clamp-2">
                Configure templates, creatives, channels, and campaign settings to operationalize approved decisions for execution.
              </p>
            </div>

            {/* CTA button at bottom */}
            <div className="pt-6">
              <button
                type="button"
                onClick={onOpenCampaignConfiguration}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF5C35] hover:bg-[#E04823] text-white text-[13px] font-medium rounded-[7px] transition-colors cursor-pointer shadow-2xs"
              >
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                <span>Open Campaign Configuration</span>
              </button>
            </div>
          </div>

          {/* Card 3: Analytics */}
          <div className="bg-white rounded-[12px] border border-[#E2DDD5] p-7 shadow-2xs hover:shadow-md hover:border-[#D5D0C7] transition-all flex flex-col justify-between h-full group">
            <div className="space-y-4">
              {/* Icon at top */}
              <div className="w-11 h-11 rounded-[10px] bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#1A1816]">
                <TrendingUp className="w-5 h-5 text-[#FF5C35] stroke-[1.8]" />
              </div>

              {/* Title */}
              <h3 className="text-[17px] font-bold text-[#1A1816] tracking-tight">
                Analytics
              </h3>

              {/* Description (1-2 lines) */}
              <p className="text-[13px] text-[#706B62] leading-relaxed line-clamp-2">
                Monitor campaign performance, audience outcomes, spend, and decisioning insights through real-time analytics.
              </p>
            </div>

            {/* CTA button at bottom */}
            <div className="pt-6">
              <button
                type="button"
                onClick={onOpenAnalytics}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF5C35] hover:bg-[#E04823] text-white text-[13px] font-medium rounded-[7px] transition-colors cursor-pointer shadow-2xs"
              >
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                <span>Open Analytics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row — 2 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Card 4: Content Studio */}
          <div className="bg-white rounded-[12px] border border-[#E2DDD5] p-7 shadow-2xs hover:shadow-md hover:border-[#D5D0C7] transition-all flex flex-col justify-between h-full group">
            <div className="space-y-4">
              {/* Icon at top */}
              <div className="w-11 h-11 rounded-[10px] bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#1A1816]">
                <Sparkles className="w-5 h-5 text-[#FF5C35] stroke-[1.8]" />
              </div>

              {/* Title */}
              <h3 className="text-[17px] font-bold text-[#1A1816] tracking-tight">
                Content Studio
              </h3>

              {/* Description (1-2 lines) */}
              <p className="text-[13px] text-[#706B62] leading-relaxed line-clamp-2">
                Create, manage, and approve campaign content and creative variants across channels while maintaining brand consistency.
              </p>
            </div>

            {/* CTA button at bottom */}
            <div className="pt-6">
              <button
                type="button"
                onClick={onOpenContentStudio}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF5C35] hover:bg-[#E04823] text-white text-[13px] font-medium rounded-[7px] transition-colors cursor-pointer shadow-2xs"
              >
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                <span>Open Content Studio</span>
              </button>
            </div>
          </div>

          {/* Card 5: Governance */}
          <div className="bg-white rounded-[12px] border border-[#E2DDD5] p-7 shadow-2xs hover:shadow-md hover:border-[#D5D0C7] transition-all flex flex-col justify-between h-full group">
            <div className="space-y-4">
              {/* Icon at top */}
              <div className="w-11 h-11 rounded-[10px] bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#1A1816]">
                <Shield className="w-5 h-5 text-[#FF5C35] stroke-[1.8]" />
              </div>

              {/* Title */}
              <h3 className="text-[17px] font-bold text-[#1A1816] tracking-tight">
                Governance
              </h3>

              {/* Description (1-2 lines) */}
              <p className="text-[13px] text-[#706B62] leading-relaxed line-clamp-2">
                Manage approvals, controls, compliance, rules, and audit visibility across the campaign lifecycle.
              </p>
            </div>

            {/* CTA button at bottom */}
            <div className="pt-6">
              <button
                type="button"
                onClick={onOpenGovernance}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF5C35] hover:bg-[#E04823] text-white text-[13px] font-medium rounded-[7px] transition-colors cursor-pointer shadow-2xs"
              >
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                <span>Open Governance</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

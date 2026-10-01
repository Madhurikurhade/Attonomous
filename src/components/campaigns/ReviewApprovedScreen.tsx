import React, { useState } from 'react';
import { CampaignRecord } from '../../types';
import { PhonePreview } from './PhonePreview';
import { Check, Rocket, Send, CheckCircle2 } from 'lucide-react';
import { isDateInPast } from '../home/CreatedDateDropdown';

interface ReviewApprovedScreenProps {
  campaign: CampaignRecord;
  onBack: () => void;
  onApprove: (updatedCampaign: CampaignRecord) => void;
  onApproveAndLaunch: (updatedCampaign: CampaignRecord) => void;
  onRefresh: () => void;
}

export const ReviewApprovedScreen: React.FC<ReviewApprovedScreenProps> = ({
  campaign,
  onBack,
  onApprove,
  onApproveAndLaunch,
}) => {
  const config = campaign.config;
  const beforeCount = config?.audienceBeforeSuppression || campaign.audienceCount || 30000;
  const suppressedCount = config?.suppressedUserCount !== undefined ? config.suppressedUserCount : 3;
  const afterCount =
    config?.audienceAfterSuppression !== undefined && config.audienceAfterSuppression < beforeCount
      ? config.audienceAfterSuppression
      : Math.max(0, beforeCount - suppressedCount);

  const isPast = isDateInPast(campaign.decisionDate);
  const isArchived = campaign.status === 'Archived';
  const isLaunchedOrCompleted =
    campaign.status === 'Launched' ||
    campaign.status === 'Scheduled' ||
    campaign.status === 'Completed';
  const isPastOrArchived = isPast || isArchived;

  const [testNumber, setTestNumber] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSentSuccess, setTestSentSuccess] = useState(false);

  const handleTestSend = () => {
    if (!testNumber.trim()) return;
    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      setTestSentSuccess(true);
      setTimeout(() => setTestSentSuccess(false), 2500);
    }, 600);
  };

  const handleApprove = () => {
    const updated: CampaignRecord = {
      ...campaign,
      status: 'Approved',
      assignment: 'Assigned',
      audienceCount: afterCount,
      config: {
        ...campaign.config,
        audienceBeforeSuppression: beforeCount,
        suppressedUserCount: suppressedCount,
        audienceAfterSuppression: afterCount,
        isApproved: true,
      },
    };
    onApprove(updated);
  };

  const handleApproveAndLaunch = () => {
    const updated: CampaignRecord = {
      ...campaign,
      status: 'Launched',
      assignment: 'Assigned',
      audienceCount: afterCount,
      config: {
        ...campaign.config,
        audienceBeforeSuppression: beforeCount,
        suppressedUserCount: suppressedCount,
        audienceAfterSuppression: afterCount,
        isApproved: true,
      },
    };
    onApproveAndLaunch(updated);
  };

  return (
    <div className="space-y-6 font-body">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#1A1816] tracking-tight">Campaigns</h1>
          <p className="text-[13px] text-[#706B62] mt-0.5">
            Review, configure, and manage <span className="text-[#FF5C35] font-medium">recommended campaigns</span>
          </p>
        </div>
      </div>

      {/* ── Section Title: Campaign Details ─────────────────────────────────── */}
      <div>
        <h2 className="text-[18px] font-bold text-[#FF5C35]">
          {isLaunchedOrCompleted || isPastOrArchived
            ? 'Campaign Details'
            : campaign.status === 'Approved'
            ? 'Review & Launch'
            : 'Review & Confirm'}
        </h2>
        {isLaunchedOrCompleted && (
          <p className="text-[13px] text-[#706B62] italic mt-1">
            This campaign has already been launched
          </p>
        )}
      </div>

      {/* ── Campaign Header Bar ────────────────────────────────────────────── */}
      <div className="bg-white rounded-[10px] border border-[#E2DDD5] p-4 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-[12.5px] items-start">
          <div>
            <span className="text-[11px] text-[#807A70] uppercase font-bold tracking-wider block">
              Campaign Name
            </span>
            <span className="font-semibold text-[#1A1816] truncate block mt-0.5" title={campaign.campaignName}>
              {campaign.campaignName}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-[#807A70] uppercase font-bold tracking-wider block">
              Use Case Name
            </span>
            <span className="text-[#4A453E] block mt-0.5 leading-snug break-words" title={campaign.useCaseName}>
              {campaign.useCaseName}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-[#807A70] uppercase font-bold tracking-wider block">
              Audience Count
            </span>
            <span className="font-data font-semibold text-[#1A1816] block mt-0.5">
              {campaign.audienceCount ? campaign.audienceCount.toLocaleString('en-IN') : afterCount.toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-[#807A70] uppercase font-bold tracking-wider block">
              Decision Date
            </span>
            <span className="font-data text-[#4A453E] block mt-0.5">
              {campaign.decisionDate}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-[#807A70] uppercase font-bold tracking-wider block">
              Estimated Spents
            </span>
            <span className="font-data font-semibold text-[#1A1816] block mt-0.5">
              ₹ {campaign.spent.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* ── Creative Section (Full Width / Acquires the Page) ──────────────── */}
      <div className="w-full bg-white rounded-[10px] border border-[#E2DDD5] p-6 shadow-xs space-y-4">
        <h3 className="text-[15px] font-bold text-[#FF5C35]">Creative</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Metadata Fields */}
          <div className="space-y-3.5 text-[13px]">
            <div>
              <span className="text-[13px] text-[#706B62] block mb-0.5">Channel</span>
              <span className="text-[14px] font-semibold text-[#1A1816] block">{campaign.channel}</span>
            </div>

            <div>
              <span className="text-[13px] text-[#706B62] block mb-0.5">Theme</span>
              <span className="text-[14px] font-semibold text-[#1A1816] block">{campaign.theme}</span>
            </div>

            <div>
              <span className="text-[13px] text-[#706B62] block mb-0.5">Vendor</span>
              <span className="text-[14px] font-semibold text-[#1A1816] block">{config?.vendor || 'Karix'}</span>
            </div>

            <div>
              <span className="text-[13px] text-[#706B62] block mb-0.5">Sender</span>
              <span className="text-[14px] font-semibold text-[#1A1816] block font-mono">{config?.sender || 'BFDLMT'}</span>
            </div>

            <div>
              <span className="text-[13px] text-[#706B62] block mb-0.5">template Name</span>
              <span className="text-[14px] font-semibold text-[#1A1816] block">{config?.template || 'Personalization_8march'}</span>
            </div>

            {config?.headerLink ? (
              <div>
                <span className="text-[13px] text-[#706B62] block mb-0.5">header Link</span>
                <a
                  href={config.headerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] font-semibold text-[#FF5C35] hover:underline truncate block max-w-md"
                  title={config?.headerLink}
                >
                  {config?.headerLink}
                </a>
              </div>
            ) : null}

            <div>
              <span className="text-[13px] text-[#706B62] block mb-0.5">Variable</span>
              <span className="text-[14px] font-semibold text-[#1A1816] block">{config?.variable || 'There'}</span>
            </div>

            <div>
              <span className="text-[13px] text-[#706B62] block mb-0.5">CTA Link</span>
              <a
                href={config?.ctaLink || 'https://www.bajajmarkets.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-semibold text-[#FF5C35] hover:underline truncate block max-w-md"
                title={config?.ctaLink}
              >
                {config?.ctaLink || 'https://www.bajajmarkets.com'}
              </a>
            </div>
          </div>

          {/* Interactive Mockup Preview */}
          <div className="flex justify-center">
            <PhonePreview
              channel={campaign.channel}
              sender={config?.sender}
              vendor={config?.vendor}
              headerLink={config?.headerLink}
              ctaLink={config?.ctaLink}
              variable={config?.variable}
              targetUrl={config?.ctaLink}
              shortenedUrl={config?.ctaLink}
              templateName={config?.template}
            />
          </div>
        </div>
      </div>

      {/* ── Test Campaign Box (Only before launch - Image 7) ───────────────── */}
      {!isLaunchedOrCompleted && !isPastOrArchived && (
        <div className="bg-white rounded-[10px] border border-[#E2DDD5] p-5 shadow-xs space-y-3">
          <span className="text-[13.5px] font-semibold text-[#1A1816] block">
            Test Campaign
          </span>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={testNumber}
              onChange={(e) => setTestNumber(e.target.value)}
              placeholder="Enter Mobile Number with +91"
              className="flex-1 h-[42px] px-3.5 bg-white border border-[#D5D0C7] rounded-[8px] text-[13.5px] text-[#1A1816] placeholder:text-[#9E988E] outline-none hover:border-[#807A70] focus:border-[#1A1816] transition-colors"
            />
            <button
              type="button"
              onClick={handleTestSend}
              disabled={isSendingTest}
              className="h-[42px] px-6 rounded-[8px] bg-[#E8E4DD] hover:bg-[#D5D0C7] text-[#1A1816] font-medium text-[13.5px] transition-colors cursor-pointer flex items-center gap-2 shrink-0"
            >
              {isSendingTest ? (
                <span>Sending...</span>
              ) : testSentSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#166534]" />
                  <span>Sent!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Test</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom Actions ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-4 pb-12 border-t border-[#E2DDD5]">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-2 rounded-[8px] text-[13.5px] font-medium bg-[#E8E4DD] text-[#4A453E] hover:bg-[#DDD8D0] hover:text-[#1A1816] transition-colors cursor-pointer"
        >
          Back
        </button>

        {isPastOrArchived || isLaunchedOrCompleted ? null : campaign.status === 'Approved' ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleApproveAndLaunch}
              className="px-6 py-2.5 rounded-[8px] bg-[#FF5C35] hover:bg-[#E04823] text-white font-semibold text-[13px] shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Rocket className="w-4 h-4 text-white" />
              <span>Launch</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleApprove}
              className="px-6 py-2.5 rounded-[8px] bg-[#E8E4DD] hover:bg-[#D5D0C7] text-[#1A1816] font-semibold text-[13px] shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-[#166534]" />
              <span>Approve</span>
            </button>

            <button
              type="button"
              onClick={handleApproveAndLaunch}
              className="px-6 py-2.5 rounded-[8px] bg-[#FF5C35] hover:bg-[#E04823] text-white font-semibold text-[13px] shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Rocket className="w-4 h-4 text-white" />
              <span>Approve &amp; Launch</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

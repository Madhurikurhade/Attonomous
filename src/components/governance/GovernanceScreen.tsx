import React, { useState } from 'react';
import {
  FrequencyLimitRow,
  ChannelConsentRow,
  GovernanceConfig,
} from '../../types';
import {
  DEFAULT_GOVERNANCE_CONFIG,
  getFlagDefinitionsForChannel,
} from '../../data/governanceData';
import { ConsentFlagDropdown } from './ConsentFlagDropdown';
import { CheckCircle2, BookmarkCheck, ShieldCheck, X } from 'lucide-react';

interface GovernanceScreenProps {
  activeTab?: 'frequency_capping' | 'channel_consent';
  onTabChange?: (tab: 'frequency_capping' | 'channel_consent') => void;
  onBackToHome?: () => void;
  onCompleteToDashboard?: () => void;
}

const GOVERNANCE_STORAGE_KEY = 'use_case_governance_config_v1';

export const GovernanceScreen: React.FC<GovernanceScreenProps> = ({
  activeTab = 'frequency_capping',
  onTabChange,
  onCompleteToDashboard,
}) => {
  // Load persisted governance config or defaults
  const [config, setConfig] = useState<GovernanceConfig>(() => {
    try {
      const saved = localStorage.getItem(GOVERNANCE_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_GOVERNANCE_CONFIG;
  });

  // Local fallback if no parent controlled tab
  const [localStep, setLocalStep] = useState<'frequency_capping' | 'channel_consent'>('frequency_capping');
  const currentStep = onTabChange ? activeTab : localStep;

  const setCurrentStep = (tab: 'frequency_capping' | 'channel_consent') => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setLocalStep(tab);
    }
  };

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal popup for Save & Apply
  const [applyModal, setApplyModal] = useState<{
    isOpen: boolean;
    step: 'frequency_capping' | 'channel_consent';
  }>({
    isOpen: false,
    step: 'frequency_capping',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const saveConfig = (newConfig: GovernanceConfig, message: string) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(GOVERNANCE_STORAGE_KEY, JSON.stringify(newConfig));
    } catch {
      // ignore
    }
    showToast(message);
  };

  const handleFrequencyChange = (
    index: number,
    field: keyof Omit<FrequencyLimitRow, 'channel' | 'subtitle'>,
    value: number
  ) => {
    const nextList = [...config.frequencyCapping];
    nextList[index] = {
      ...nextList[index],
      [field]: Math.max(0, value),
    };
    setConfig({
      ...config,
      frequencyCapping: nextList,
    });
  };

  const handleConsentFlagsChange = (channelId: string, values: string[]) => {
    const nextConsent = config.channelConsent.map((item) =>
      item.id === channelId ? { ...item, excludedValues: values } : item
    );
    setConfig({
      ...config,
      channelConsent: nextConsent,
    });
  };

  const handleSaveDraft = () => {
    saveConfig(config, 'Governance draft saved successfully.');
  };

  const handleSaveFrequencyCapping = () => {
    saveConfig(
      config,
      'This governance is applied across all use cases.'
    );
    setApplyModal({
      isOpen: true,
      step: 'frequency_capping',
    });
  };

  const handleSaveAndApply = () => {
    saveConfig(
      config,
      'This governance is applied across all use cases.'
    );
    setApplyModal({
      isOpen: true,
      step: 'channel_consent',
    });
  };

  const handleProceedFromFrequencyCapping = () => {
    setApplyModal({ isOpen: false, step: 'frequency_capping' });
    setCurrentStep('channel_consent');
  };

  const handleProceedToDashboard = () => {
    setApplyModal({ isOpen: false, step: 'channel_consent' });
    if (onCompleteToDashboard) {
      onCompleteToDashboard();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 sm:px-10 md:px-14 py-8 bg-[#F4F1EB] min-h-full font-body select-none">
      <div className="max-w-6xl mx-auto space-y-7">
        {/* ── Top Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-[#1A1816] tracking-tight">
              Governance
            </h1>
            <p className="text-[13px] text-[#706B62] mt-1 font-medium">
              Enforce governance, compliance, and controls{' '}
              <span className="text-[#FF5C35] font-semibold">
                across all Use Cases
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="self-start px-4 py-2 bg-transparent hover:bg-[#EAE5DD] text-[#FF5C35] border border-transparent rounded-[6px] text-[13px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Save as Draft</span>
          </button>
        </div>

        {/* ── Stepper / Tabs Bar (Directly clickable to switch effortlessly) ── */}
        <div className="w-full bg-[#FAF9F6] border border-[#E5DFD5] rounded-[10px] p-4 flex items-center justify-center shadow-2xs">
          <div className="w-full max-w-3xl flex items-center justify-between relative">
            {/* Step 1: Frequency Capping */}
            <button
              type="button"
              onClick={() => setCurrentStep('frequency_capping')}
              className="flex items-center gap-2.5 z-10 cursor-pointer group transition-transform active:scale-98"
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  currentStep === 'frequency_capping'
                    ? 'border-[#1A1816] bg-[#1A1816]'
                    : 'border-[#807A70] bg-white group-hover:border-[#1A1816]'
                }`}
              >
                {currentStep === 'frequency_capping' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span
                className={`text-[13px] transition-colors ${
                  currentStep === 'frequency_capping'
                    ? 'font-bold text-[#1A1816]'
                    : 'font-medium text-[#706B62] group-hover:text-[#1A1816]'
                }`}
              >
                Frequency Capping
              </span>
            </button>

            {/* Connecting line */}
            <div className="flex-1 mx-6 h-[1.5px] bg-[#DDD7CC]" />

            {/* Step 2: Channel Consent */}
            <button
              type="button"
              onClick={() => setCurrentStep('channel_consent')}
              className="flex items-center gap-2.5 z-10 cursor-pointer group transition-transform active:scale-98"
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  currentStep === 'channel_consent'
                    ? 'border-[#1A1816] bg-[#1A1816]'
                    : 'border-[#807A70] bg-white group-hover:border-[#1A1816]'
                }`}
              >
                {currentStep === 'channel_consent' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span
                className={`text-[13px] transition-colors ${
                  currentStep === 'channel_consent'
                    ? 'font-bold text-[#1A1816]'
                    : 'font-medium text-[#706B62] group-hover:text-[#1A1816]'
                }`}
              >
                Channel Consent
              </span>
            </button>
          </div>
        </div>

        {/* ── Notification Toast ─────────────────────────────────────────── */}
        {toastMessage && (
          <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-[8px] flex items-center gap-2 text-[13px] text-[#065F46] font-medium animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ── STEP 1: Frequency Capping ──────────────────────────────────── */}
        {currentStep === 'frequency_capping' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Container Card matching PDF Page 1 */}
            <div className="bg-[#FAF9F6] border border-[#E5DFD5] rounded-[12px] p-6 sm:p-8 space-y-6 shadow-2xs">
              <div>
                <h2 className="text-[17px] font-bold text-[#1A1816]">
                  Frequency Capping
                </h2>
                <p className="text-[13px] text-[#FF5C35] font-medium mt-0.5">
                  Send maximum communication per user
                </p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-[8px] border border-[#E5DFD5]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#DDD7CC] text-[#2C2824] text-[13px] font-semibold">
                      <th className="py-3 px-6 w-1/4">Channel</th>
                      <th className="py-3 px-4 text-center">Per Day</th>
                      <th className="py-3 px-4 text-center">Per Week</th>
                      <th className="py-3 px-4 text-center">Per 15 Days</th>
                      <th className="py-3 px-4 text-center">Per Month</th>
                      <th className="py-3 px-4 text-center">Per 45 Days</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DD] bg-white text-[13px]">
                    {config.frequencyCapping.map((row, idx) => {
                      const isAll = row.channel === 'All Channel';
                      return (
                        <tr
                          key={row.channel}
                          className={isAll ? 'bg-[#FAF9F6] font-semibold' : 'hover:bg-[#FAF9F6]'}
                        >
                          <td className="py-3.5 px-6">
                            <div className="font-semibold text-[#1A1816]">
                              {row.channel}
                            </div>
                            <div className="text-[11.5px] text-[#807A70] italic">
                              {row.subtitle}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="number"
                              min="0"
                              value={row.perDay}
                              onChange={(e) =>
                                handleFrequencyChange(
                                  idx,
                                  'perDay',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16 h-8 text-center font-semibold text-[#1A1816] bg-transparent border border-transparent hover:border-[#D5D0C7] focus:border-[#FF5C35] focus:bg-white rounded outline-none transition-colors"
                            />
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="number"
                              min="0"
                              value={row.perWeek}
                              onChange={(e) =>
                                handleFrequencyChange(
                                  idx,
                                  'perWeek',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16 h-8 text-center font-semibold text-[#1A1816] bg-transparent border border-transparent hover:border-[#D5D0C7] focus:border-[#FF5C35] focus:bg-white rounded outline-none transition-colors"
                            />
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="number"
                              min="0"
                              value={row.per15Days}
                              onChange={(e) =>
                                handleFrequencyChange(
                                  idx,
                                  'per15Days',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16 h-8 text-center font-semibold text-[#1A1816] bg-transparent border border-transparent hover:border-[#D5D0C7] focus:border-[#FF5C35] focus:bg-white rounded outline-none transition-colors"
                            />
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="number"
                              min="0"
                              value={row.perMonth}
                              onChange={(e) =>
                                handleFrequencyChange(
                                  idx,
                                  'perMonth',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16 h-8 text-center font-semibold text-[#1A1816] bg-transparent border border-transparent hover:border-[#D5D0C7] focus:border-[#FF5C35] focus:bg-white rounded outline-none transition-colors"
                            />
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="number"
                              min="0"
                              value={row.per45Days}
                              onChange={(e) =>
                                handleFrequencyChange(
                                  idx,
                                  'per45Days',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16 h-8 text-center font-semibold text-[#1A1816] bg-transparent border border-transparent hover:border-[#D5D0C7] focus:border-[#FF5C35] focus:bg-white rounded outline-none transition-colors"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Note per PDF */}
              <p className="text-[12.5px] text-[#706B62] leading-relaxed pt-2">
                <span className="text-[#FF5C35] font-semibold">Note :</span> These
                frequency limits are configured at the system level and apply
                across all Use Cases. Any changes made here will be reflected across
                the entire system.
              </p>
            </div>

            {/* Bottom Actions Bar: Replaced "Save & Next" with "Save & Apply" per user request */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveFrequencyCapping}
                className="px-8 py-2 bg-[#DDD8D0] hover:bg-[#D0CBC2] text-[#2C2824] rounded-[6px] text-[13.5px] font-semibold cursor-pointer transition-colors shadow-2xs active:scale-98"
              >
                Save &amp; Apply
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Channel Consent ────────────────────────────────────── */}
        {currentStep === 'channel_consent' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Container Card matching PDF Page 2 */}
            <div className="bg-[#FAF9F6] border border-[#E5DFD5] rounded-[12px] p-6 sm:p-8 space-y-6 shadow-2xs">
              <div>
                <h2 className="text-[17px] font-bold text-[#1A1816]">
                  Channel Consent
                </h2>
                <p className="text-[13px] text-[#FF5C35] font-medium mt-0.5">
                  Ensure communications are sent only through channels with valid user consent.
                </p>
              </div>

              {/* Channel-Specific Exclusion Container */}
              <div className="space-y-4">
                <div className="inline-block px-4 py-1 rounded-[4px] bg-[#FF5C35] text-white text-[12.5px] font-semibold tracking-wide shadow-2xs">
                  Channel-Specific Exclusion
                </div>

                {/* Table */}
                <div className="overflow-visible rounded-[8px] border border-[#E5DFD5]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#DDD7CC] text-[#2C2824] text-[13px] font-semibold">
                        <th className="py-3 px-6 w-1/2">Channel</th>
                        <th className="py-3 px-6 w-1/2">Attributes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE5DD] bg-white text-[13px]">
                      {config.channelConsent.map((item, idx) => {
                        const flags = getFlagDefinitionsForChannel(item.statusField);
                        // Row z-index so top row popover displays above bottom rows
                        const zIndex = (config.channelConsent.length - idx) * 10;

                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-[#FAF9F6] relative"
                            style={{ zIndex }}
                          >
                            <td className="py-3.5 px-6">
                              <div className="font-bold text-[#1A1816] text-[13.5px]">
                                {item.channel}
                              </div>
                              <div className="text-[12px] text-[#807A70] font-mono">
                                {item.statusField}
                              </div>
                            </td>
                            <td className="py-3.5 px-6">
                              <ConsentFlagDropdown
                                channelName={item.channel}
                                statusField={item.statusField}
                                flags={flags}
                                selectedValues={item.excludedValues}
                                onChange={(vals) =>
                                  handleConsentFlagsChange(item.id, vals)
                                }
                                className="max-w-md"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Note per PDF */}
                <p className="text-[12.5px] text-[#706B62] leading-relaxed pt-2">
                  <span className="text-[#FF5C35] font-semibold">Note :</span> Exclude
                  users from the respective channel based on channel-level consent or
                  eligibility flags. These controls are configured at the system
                  level and apply across all Use Cases. Any changes made here will be
                  reflected across the entire system.
                </p>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep('frequency_capping')}
                className="px-8 py-2 bg-[#DDD8D0] hover:bg-[#D0CBC2] text-[#2C2824] rounded-[6px] text-[13.5px] font-semibold cursor-pointer transition-colors shadow-2xs"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleSaveAndApply}
                className="px-8 py-2 bg-[#DDD8D0] hover:bg-[#D0CBC2] text-[#2C2824] rounded-[6px] text-[13.5px] font-semibold cursor-pointer transition-colors shadow-2xs active:scale-98"
              >
                Save &amp; Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Save & Apply Confirmation Modal (Requested: Popup/msg "this governance is applied across all use case") ── */}
      {applyModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-[#FAF9F6] border border-[#E5DFD5] rounded-[16px] p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center">
            <button
              type="button"
              onClick={() => setApplyModal({ ...applyModal, isOpen: false })}
              className="absolute top-4 right-4 text-[#807A70] hover:text-[#1A1816] transition-colors p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-[#EBF8F2] text-[#0E8A55] flex items-center justify-center mx-auto mb-4 border border-[#BDEBD3]">
              <ShieldCheck className="w-7 h-7 stroke-[2]" />
            </div>

            <h3 className="text-[20px] font-serif font-bold text-[#1A1816]">
              Governance Applied
            </h3>

            <div className="mt-3 p-3.5 bg-[#FFF5F2] border border-[#FFD9CF] rounded-[8px]">
              <p className="text-[14.5px] font-semibold text-[#FF5C35]">
                This governance is applied across all use cases.
              </p>
            </div>

            <p className="text-[13px] text-[#5A554E] mt-3 leading-relaxed">
              {applyModal.step === 'frequency_capping'
                ? 'Frequency capping limits have been saved and applied system-wide. Proceed to Channel Consent to configure communication flags.'
                : 'Channel consent and eligibility rules have been saved and applied system-wide across all decisioning workflows.'}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              {applyModal.step === 'frequency_capping' ? (
                <>
                  <button
                    type="button"
                    onClick={handleProceedFromFrequencyCapping}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#FF5C35] hover:bg-[#E04F2E] text-white text-[13.5px] font-semibold rounded-[6px] shadow-sm transition-colors cursor-pointer active:scale-98"
                  >
                    Continue to Channel Consent
                  </button>
                  <button
                    type="button"
                    onClick={() => setApplyModal({ ...applyModal, isOpen: false })}
                    className="w-full sm:w-auto px-4 py-2 text-[13px] text-[#706B62] hover:text-[#1A1816] font-medium cursor-pointer"
                  >
                    Stay on this page
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleProceedToDashboard}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#FF5C35] hover:bg-[#E04F2E] text-white text-[13.5px] font-semibold rounded-[6px] shadow-sm transition-colors cursor-pointer active:scale-98"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => setApplyModal({ ...applyModal, isOpen: false })}
                    className="w-full sm:w-auto px-4 py-2 text-[13px] text-[#706B62] hover:text-[#1A1816] font-medium cursor-pointer"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1816] text-white px-5 py-3 rounded-[8px] shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#2ECC71] flex-shrink-0" />
          <span className="text-[13px] font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { UseCaseState, WeeklyAllocation } from '../../types';
import { CalendarPicker } from '../CalendarPicker';
import {
  formatIndianCurrency,
  parseRawNumber,
  parseDDMMYYYY,
  calculateDurationDays,
  calculateNumWeeks,
  generateWeeklyAllocations,
} from '../../utils/formatters';
import { AlertCircle } from 'lucide-react';

interface Step2Props {
  state: UseCaseState;
  updateState: (updates: Partial<UseCaseState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2BudgetSchedule: React.FC<Step2Props> = ({
  state,
  updateState,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [constraintNotice, setConstraintNotice] = useState<string | null>(null);

  // Recalculate duration and number of weeks whenever dates change
  useEffect(() => {
    if (state.startDate && state.endDate) {
      const days = calculateDurationDays(state.startDate, state.endDate);
      const numWeeks = calculateNumWeeks(days);
      const updates: Partial<UseCaseState> = {};

      if (days !== state.durationDays) {
        updates.durationDays = days;
      }

      // If number of weeks changed or uninitialized, regenerate weekly allocations
      if (state.weeklyAllocations.length !== numWeeks) {
        updates.weeklyAllocations = generateWeeklyAllocations(numWeeks, state.overallBudget);
      }

      if (Object.keys(updates).length > 0) {
        updateState(updates);
      }
    }
  }, [state.startDate, state.endDate]);

  // Update weekly amount calculations when overall budget changes
  useEffect(() => {
    const overallNum = parseRawNumber(state.overallBudget);
    const updated = state.weeklyAllocations.map((w) => ({
      ...w,
      amount: (overallNum * (parseFloat(w.percent) || 0)) / 100,
    }));
    updateState({ weeklyAllocations: updated });
  }, [state.overallBudget]);

  // Calculate sum of weekly percentages (rounded to 1 decimal)
  const totalWeeklyPercent = useMemo(() => {
    const sum = state.weeklyAllocations.reduce((acc, w) => acc + (parseFloat(w.percent) || 0), 0);
    return Math.round(sum * 10) / 10;
  }, [state.weeklyAllocations]);

  // Date validation helper
  const validateDates = (): string | null => {
    if (!state.startDate) return 'Start date is required';
    if (!state.endDate) return 'End date is required';

    const start = parseDDMMYYYY(state.startDate);
    const end = parseDDMMYYYY(state.endDate);

    if (!start) return 'Start date must be in DD/MM/YYYY format';
    if (!end) return 'End date must be in DD/MM/YYYY format';

    // Month-End Rule: End date MUST be the last day of its month (30th or 31st, or 28/29)
    const lastDayOfMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();
    if (end.getDate() !== lastDayOfMonth) {
      return 'You cannot change this because of constraints.';
    }

    // In Edit mode: Timeline can only be increased (extended)
    if (state.isEditMode && state.originalEndDate) {
      const origEnd = parseDDMMYYYY(state.originalEndDate);
      if (origEnd && end.getTime() < origEnd.getTime()) {
        return 'You cannot change this because of constraints.';
      }
    }

    // End date must be at least 2 days after start date
    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 2) {
      return 'You cannot change this because of constraints.';
    }

    return null;
  };

  // Memoized date objects for calendar limits
  const parsedStartDate = useMemo(() => parseDDMMYYYY(state.startDate), [state.startDate]);

  const todayDate = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const endDateLimits = useMemo(() => {
    if (!parsedStartDate) return { min: undefined, max: undefined, lock: undefined };
    
    // In edit mode: min date is original end date so timeline can only be increased
    let min = new Date(parsedStartDate);
    min.setDate(min.getDate() + 2);

    if (state.isEditMode && state.originalEndDate) {
      const origEnd = parseDDMMYYYY(state.originalEndDate);
      if (origEnd && origEnd > min) {
        min = origEnd;
      }
    }

    return {
      min,
      max: undefined, // allow increasing forward across months
      lock: undefined, // allow navigating forward to future months
    };
  }, [parsedStartDate, state.isEditMode, state.originalEndDate]);

  // Handle Timeline changes
  const handleStartDateChange = (val: string) => {
    const newStart = parseDDMMYYYY(val);
    const updates: Partial<UseCaseState> = { startDate: val };

    if (newStart) {
      const endMonthEnd = new Date(newStart.getFullYear(), newStart.getMonth() + 1, 0);
      const currentEnd = parseDDMMYYYY(state.endDate);

      // If end date is missing or earlier than start + 2 days, set to month end
      if (
        !currentEnd ||
        currentEnd.getTime() < newStart.getTime() + 2 * 86400000
      ) {
        const dStr = String(endMonthEnd.getDate()).padStart(2, '0');
        const mStr = String(endMonthEnd.getMonth() + 1).padStart(2, '0');
        updates.endDate = `${dStr}/${mStr}/${endMonthEnd.getFullYear()}`;
      }
    }

    updateState(updates);
    if (errors.timeline) setErrors((prev) => ({ ...prev, timeline: '' }));
    setConstraintNotice(null);
  };

  const handleEndDateChange = (val: string) => {
    updateState({ endDate: val });
    if (errors.timeline) setErrors((prev) => ({ ...prev, timeline: '' }));
    setConstraintNotice(null);
  };

  // Handle Budget changes
  const handleOverallBudgetChange = (val: string) => {
    const raw = val.replace(/[^0-9]/g, '');
    updateState({ overallBudget: raw });
    if (errors.overallBudget) setErrors((prev) => ({ ...prev, overallBudget: '' }));
  };

  // Handle Weekly percentage changes
  const handleWeeklyPercentChange = (weekIndex: number, newPercentStr: string) => {
    const clean = newPercentStr.replace(/[^0-9.]/g, '');
    const overallNum = parseRawNumber(state.overallBudget);
    const updated = [...state.weeklyAllocations];
    const pct = parseFloat(clean) || 0;
    updated[weekIndex] = {
      ...updated[weekIndex],
      percent: clean,
      amount: (overallNum * pct) / 100,
    };
    updateState({ weeklyAllocations: updated });
    if (errors.weekly) setErrors((prev) => ({ ...prev, weekly: '' }));
  };

  const overallBudgetNum = parseRawNumber(state.overallBudget);

  // Validate Step 2 before proceeding
  const validateAndProceed = () => {
    const newErrors: Record<string, string> = {};

    // 1. Timeline validation
    const timelineErr = validateDates();
    if (timelineErr) newErrors.timeline = timelineErr;

    // 2. Overall budget validation
    if (!overallBudgetNum || overallBudgetNum <= 0) {
      newErrors.overallBudget = 'Please enter a valid Overall Budget';
    }

    // 3. Weekly allocations validation (must total 100%, every week > 0)
    for (const w of state.weeklyAllocations) {
      const p = parseFloat(w.percent);
      if (isNaN(p) || p <= 0) {
        newErrors.weekly = `Week ${w.week} allocation must be greater than 0%`;
        break;
      }
    }

    if (!newErrors.weekly && Math.abs(totalWeeklyPercent - 100) > 0.1) {
      newErrors.weekly = `Total weekly allocation must equal 100% (currently ${totalWeeklyPercent}%)`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-body">
      {/* ── The White Form Card Container ─────────────────────────────────── */}
      <div className="w-full bg-white rounded-[12px] p-6 sm:p-8 md:p-10 border border-[#E2DDD5] shadow-xs space-y-9">
        {/* ── Section 1: Timeline ───────────────────────────────────────────── */}
        <div className="space-y-3">
          <h2 className="text-[15px] font-bold text-[#1A1816] tracking-tight">Timeline</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Start Date */}
            <div
              className="flex flex-col"
              onClick={() => {
                if (state.isEditMode) {
                  setConstraintNotice('You cannot change this because of constraints.');
                }
              }}
            >
              <CalendarPicker
                label="Start Date"
                required
                value={state.startDate}
                onChange={handleStartDateChange}
                minDate={todayDate}
                disabled={Boolean(state.isEditMode)}
                placeholder="DD/MM/YYYY"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col">
              <CalendarPicker
                label="End Date"
                required
                value={state.endDate}
                onChange={handleEndDateChange}
                minDate={endDateLimits.min}
                maxDate={endDateLimits.max}
                lockToMonthYear={endDateLimits.lock}
                onlyMonthEnd={true}
                disabled={!state.startDate}
                placeholder="DD/MM/YYYY"
              />
            </div>

            {/* Duration (Read-only, auto calculated) */}
            <div className="flex flex-col justify-end">
              <label className="text-[13px] font-medium text-[#1A1816] mb-1.5">
                <span>Duration</span>
              </label>
              <input
                type="text"
                readOnly
                value={state.durationDays > 0 ? `${state.durationDays} days` : '—'}
                className="w-full h-[42px] px-3.5 bg-[#F7F5F2] border border-[#DCD5C8] rounded-[8px] text-[14px] font-data font-medium text-[#1A1816] outline-none cursor-default"
              />
            </div>
          </div>

          {(errors.timeline || constraintNotice) && (
            <div className="flex items-center gap-1.5 text-[12.5px] text-[#DC2626] font-medium mt-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.timeline || constraintNotice}</span>
            </div>
          )}
        </div>

        {/* ── Section 2: Budget (Image 3: Daily Min & Daily Max removed, only Overall) ── */}
        <div className="space-y-3">
          <h2 className="text-[15px] font-bold text-[#1A1816] tracking-tight">Budget</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Overall */}
            <div className="flex flex-col">
              <label className="text-[13px] font-medium text-[#1A1816] mb-1.5 flex items-center gap-1">
                <span>Overall</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={state.overallBudget ? formatIndianCurrency(state.overallBudget, false) : ''}
                  onChange={(e) => handleOverallBudgetChange(e.target.value)}
                  placeholder="4,00,00,000"
                  className="w-full h-[42px] pl-7 pr-3 bg-white border border-[#DCD5C8] rounded-[8px] text-[14px] font-data font-medium text-[#1A1816] outline-none hover:border-[#807A70] focus:border-[#1A1816]"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px] text-[#807A70] font-data">
                  ₹
                </span>
              </div>
              {/* Small orange line + spent metric in Edit Mode */}
              {state.isEditMode && (
                <div className="flex items-center gap-1.5 mt-1.5 animate-in fade-in duration-150">
                  <span className="w-3 h-[2px] bg-[#FF5C35] rounded-full shrink-0" />
                  <span className="text-[12px] font-medium text-[#C2410C]">
                    ₹{state.alreadySpentBudget || '10,00,000'} already spent
                  </span>
                </div>
              )}
              {errors.overallBudget && (
                <span className="text-[11px] text-[#DC2626] mt-1 font-medium">{errors.overallBudget}</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Section 3: Weekly Budget ──────────────────────────────────────── */}
        <div className="space-y-3">
          <div>
            <h2 className="text-[15px] font-bold text-[#1A1816] tracking-tight">Weekly Budget</h2>
            <p className="text-[12px] text-[#807A70]">
              Allocated across execution timeline (total must equal 100%)
            </p>
          </div>

          {/* Weekly columns */}
          <div className={`grid gap-4 ${
            state.weeklyAllocations.length === 5
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-5'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
          }`}>
            {state.weeklyAllocations.map((w, idx) => (
              <div
                key={w.week}
                className="p-3.5 bg-white border border-[#DCD5C8] rounded-[8px] space-y-2"
              >
                <div className="text-[13px] font-semibold text-[#1A1816]">Week {w.week}</div>
                <div className="relative">
                  <input
                    type="text"
                    value={w.percent}
                    onChange={(e) => handleWeeklyPercentChange(idx, e.target.value)}
                    placeholder="25.0"
                    className="w-full h-[38px] pl-3 pr-7 bg-white border border-[#DCD5C8] rounded-[6px] text-[14px] font-data outline-none hover:border-[#807A70] focus:border-[#1A1816]"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[13px] text-[#807A70] font-data font-semibold">
                    %
                  </span>
                </div>
                <div className="text-[12px] text-[#807A70] font-data">
                  {w.amount > 0 ? formatIndianCurrency(Math.round(w.amount)) : '₹0'}
                </div>
              </div>
            ))}
          </div>

          {/* Validation error banner - only appears after clicking Next button */}
          {errors.weekly && (
            <div className="flex items-center gap-2 p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-[8px] text-[13px] text-[#991B1B] font-medium animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-[#DC2626] flex-shrink-0" />
              <span>{errors.weekly}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Actions Bar ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-4 pb-12">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-2 rounded-[8px] text-[13.5px] font-medium bg-[#E8E4DD] text-[#4A453E] hover:bg-[#DDD8D0] transition-colors cursor-pointer"
        >
          Back
        </button>

        <button
          type="button"
          onClick={validateAndProceed}
          className="px-8 py-2 rounded-[8px] text-[13.5px] font-medium bg-[#E8E4DD] text-[#4A453E] hover:bg-[#DDD8D0] hover:text-[#1A1816] transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { UseCaseState, AudienceFilterBox, AudienceFilterRow } from '../../types';
import { formatNumberWithCommas } from '../../utils/formatters';
import {
  SUPPRESSION_PROPERTIES,
  INCLUDE_SUPPRESSION_PROPERTIES,
  EXCLUDE_SUPPRESSION_PROPERTIES,
  getSuppressionProperty,
  SuppressionPropertyItem,
} from '../../data/campaignMockData';
import { CustomConfigDropdown } from '../campaigns/CustomConfigDropdown';
import { Trash2 } from 'lucide-react';

interface Step3Props {
  state: UseCaseState;
  updateState: (updates: Partial<UseCaseState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CLAUSE_OPTIONS = [
  { value: 'Where Property', label: 'Where Property' },
  { value: 'Where Event', label: 'Where Event' },
  { value: 'Where Aggregate', label: 'Where Aggregate' },
];

export const Step3Audience: React.FC<Step3Props> = ({
  state,
  updateState,
  onNext,
  onBack,
}) => {
  // Initialize Include filter boxes (Image 2 shows 1 box with 2 rows)
  const [includeBoxes, setIncludeBoxes] = useState<AudienceFilterBox[]>(() => {
    if (state.audienceIncludeBoxes && state.audienceIncludeBoxes.length > 0) {
      return state.audienceIncludeBoxes;
    }
    return [
      {
        id: 'box-inc-1',
        connector: 'AND',
        rows: [
          {
            id: 'row-inc-1',
            clauseType: 'Where Property',
            property: 'ETP_NTP_FLAG',
            operator: 'is',
            value: '1',
            connector: 'AND',
          },
          {
            id: 'row-inc-2',
            clauseType: 'Where Property',
            property: 'BFL_DECILE_TAGGING',
            operator: 'greater than equal',
            value: '2',
            connector: 'AND',
          },
        ],
      },
    ];
  });

  // Exclude state & boxes (Image 3)
  const [hasExclude, setHasExclude] = useState<boolean>(() => {
    return (
      state.hasExcludeFilter ||
      (state.audienceExcludeBoxes && state.audienceExcludeBoxes.length > 0) ||
      false
    );
  });

  const [excludeBoxes, setExcludeBoxes] = useState<AudienceFilterBox[]>(() => {
    if (state.audienceExcludeBoxes && state.audienceExcludeBoxes.length > 0) {
      return state.audienceExcludeBoxes;
    }
    return [
      {
        id: 'box-exc-1',
        connector: 'AND',
        rows: [
          {
            id: 'row-exc-1',
            clauseType: 'Where Property',
            property: 'UNSEC_MODEL_FLAG',
            operator: 'is',
            value: '1',
            connector: 'AND',
          },
        ],
      },
    ];
  });

  // Audience Count display state: 'xxxxx' initially as in Image 2 & 3, or formatted number when clicked
  const [hasCalculated, setHasCalculated] = useState<boolean>(() => {
    return typeof state.audienceCount === 'number' && state.audienceCount > 0;
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  // Helper to get property configuration
  const getPropConfig = (propertyName: string): SuppressionPropertyItem => {
    return getSuppressionProperty(propertyName);
  };

  // Swapped functionality per user requirement:
  // "+ Nested Filter" adds a new property row WITHIN the current box.
  // "+ Property" adds a NEW BOX (group).
  const handleAddNestedFilter = (boxIndex: number, isExclude: boolean) => {
    const updateFn = isExclude ? setExcludeBoxes : setIncludeBoxes;
    updateFn((prev) => {
      const next = [...prev];
      const targetBox = { ...next[boxIndex] };
      const newRowId = `row-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const defaultProp = SUPPRESSION_PROPERTIES[0];
      targetBox.rows = [
        ...targetBox.rows,
        {
          id: newRowId,
          clauseType: 'Where Property',
          property: defaultProp.name,
          operator: defaultProp.operators[0] || 'is',
          value: defaultProp.allowedValues[0] || '1',
          connector: 'AND',
        },
      ];
      next[boxIndex] = targetBox;
      return next;
    });
  };

  const handleAddPropertyBox = (isExclude: boolean) => {
    const updateFn = isExclude ? setExcludeBoxes : setIncludeBoxes;
    updateFn((prev) => {
      const newBoxId = `box-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newRowId = `row-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const defaultProp = SUPPRESSION_PROPERTIES[1] || SUPPRESSION_PROPERTIES[0];
      return [
        ...prev,
        {
          id: newBoxId,
          connector: 'AND',
          rows: [
            {
              id: newRowId,
              clauseType: 'Where Property',
              property: defaultProp.name,
              operator: defaultProp.operators[0] || 'is',
              value: defaultProp.allowedValues[0] || '1',
              connector: 'AND',
            },
          ],
        },
      ];
    });
  };

  const handleRemoveRow = (boxIndex: number, rowIndex: number, isExclude: boolean) => {
    const updateFn = isExclude ? setExcludeBoxes : setIncludeBoxes;
    updateFn((prev) => {
      const next = [...prev];
      const targetBox = { ...next[boxIndex] };
      if (targetBox.rows.length <= 1) {
        if (next.length > 1) {
          return next.filter((_, idx) => idx !== boxIndex);
        }
        return prev;
      }
      targetBox.rows = targetBox.rows.filter((_, idx) => idx !== rowIndex);
      next[boxIndex] = targetBox;
      return next;
    });
  };

  const handleRemoveBox = (boxIndex: number, isExclude: boolean) => {
    const updateFn = isExclude ? setExcludeBoxes : setIncludeBoxes;
    updateFn((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, idx) => idx !== boxIndex);
    });
  };

  const handleClauseChange = (
    boxIndex: number,
    rowIndex: number,
    newClause: string,
    isExclude: boolean
  ) => {
    const updateFn = isExclude ? setExcludeBoxes : setIncludeBoxes;
    updateFn((prev) => {
      const next = [...prev];
      const targetBox = { ...next[boxIndex] };
      const targetRows = [...targetBox.rows];
      targetRows[rowIndex] = {
        ...targetRows[rowIndex],
        clauseType: newClause,
      };
      targetBox.rows = targetRows;
      next[boxIndex] = targetBox;
      return next;
    });
  };

  const handlePropertyChange = (
    boxIndex: number,
    rowIndex: number,
    newPropertyName: string,
    isExclude: boolean
  ) => {
    const propConfig = getPropConfig(newPropertyName);
    const validOperators = propConfig.operators;
    const defaultOperator = validOperators[0] || 'is';
    const defaultValue =
      propConfig.type === 'decile' && defaultOperator === 'is between'
        ? '1 - 5'
        : propConfig.allowedValues[0] || '1';

    const updateFn = isExclude ? setExcludeBoxes : setIncludeBoxes;
    updateFn((prev) => {
      const next = [...prev];
      const targetBox = { ...next[boxIndex] };
      const targetRows = [...targetBox.rows];
      targetRows[rowIndex] = {
        ...targetRows[rowIndex],
        property: newPropertyName,
        operator: defaultOperator,
        value: defaultValue,
      };
      targetBox.rows = targetRows;
      next[boxIndex] = targetBox;
      return next;
    });
  };

  const handleOperatorChange = (
    boxIndex: number,
    rowIndex: number,
    newOperator: string,
    isExclude: boolean
  ) => {
    const updateFn = isExclude ? setExcludeBoxes : setIncludeBoxes;
    updateFn((prev) => {
      const next = [...prev];
      const targetBox = { ...next[boxIndex] };
      const targetRows = [...targetBox.rows];
      const currentRow = targetRows[rowIndex];
      const propConfig = getPropConfig(currentRow.property);

      let newValue = currentRow.value;
      const isMulti =
        newOperator === 'contains' ||
        newOperator === 'does not contain' ||
        newOperator.toLowerCase().includes('contain');

      if (newOperator === 'is empty') {
        newValue = 'Blank / Empty';
      } else if (propConfig.type === 'decile' && newOperator === 'is between') {
        newValue = '1 - 5';
      } else if (isMulti) {
        // Multi-select default: keep existing value if valid, or default to first allowed value
        if (!currentRow.value || currentRow.value === 'Blank / Empty') {
          newValue = propConfig.allowedValues[0] || '1';
        }
      } else if (
        !propConfig.allowedValues.includes(currentRow.value) &&
        !currentRow.value.includes(',')
      ) {
        newValue = propConfig.allowedValues[0] || '1';
      } else if (currentRow.value.includes(',')) {
        // If switching from multi-select back to single-select, pick the first selected value
        const firstVal = currentRow.value.split(',')[0].trim();
        newValue = propConfig.allowedValues.includes(firstVal)
          ? firstVal
          : propConfig.allowedValues[0] || '1';
      }

      targetRows[rowIndex] = {
        ...currentRow,
        operator: newOperator,
        value: newValue,
      };
      targetBox.rows = targetRows;
      next[boxIndex] = targetBox;
      return next;
    });
  };

  const handleValueChange = (
    boxIndex: number,
    rowIndex: number,
    newValue: string,
    isExclude: boolean
  ) => {
    const updateFn = isExclude ? setExcludeBoxes : setIncludeBoxes;
    updateFn((prev) => {
      const next = [...prev];
      const targetBox = { ...next[boxIndex] };
      const targetRows = [...targetBox.rows];
      targetRows[rowIndex] = {
        ...targetRows[rowIndex],
        value: newValue,
      };
      targetBox.rows = targetRows;
      next[boxIndex] = targetBox;
      return next;
    });
  };

  const handleRangeChange = (
    boxIndex: number,
    rowIndex: number,
    fromVal: string,
    toVal: string,
    isExclude: boolean
  ) => {
    handleValueChange(boxIndex, rowIndex, `${fromVal} - ${toVal}`, isExclude);
  };

  const handleToggleRowConnector = (
    boxIndex: number,
    rowIndex: number,
    connector: 'AND' | 'OR',
    isExclude: boolean
  ) => {
    const updateFn = isExclude ? setExcludeBoxes : setIncludeBoxes;
    updateFn((prev) => {
      const next = [...prev];
      const targetBox = { ...next[boxIndex] };
      const targetRows = [...targetBox.rows];
      targetRows[rowIndex] = { ...targetRows[rowIndex], connector };
      targetBox.rows = targetRows;
      next[boxIndex] = targetBox;
      return next;
    });
  };

  const handleToggleBoxConnector = (
    boxIndex: number,
    connector: 'AND' | 'OR',
    isExclude: boolean
  ) => {
    const updateFn = isExclude ? setExcludeBoxes : setIncludeBoxes;
    updateFn((prev) => {
      const next = [...prev];
      next[boxIndex] = { ...next[boxIndex], connector };
      return next;
    });
  };

  // Calculate realistic audience count on "Show Count"
  const handleShowCount = () => {
    let base = 68420;
    const totalIncludeRows = includeBoxes.reduce((acc, b) => acc + b.rows.length, 0);
    if (totalIncludeRows > 2) {
      base = Math.max(25000, base - (totalIncludeRows - 2) * 4300);
    }
    if (hasExclude) {
      const totalExcludeRows = excludeBoxes.reduce((acc, b) => acc + b.rows.length, 0);
      const excluded = Math.min(base - 10000, 18500 + totalExcludeRows * 3200);
      base = Math.max(12000, base - excluded);
    }

    setHasCalculated(true);
    setValidationError(null);
    updateState({
      audienceIncludeBoxes: includeBoxes,
      audienceExcludeBoxes: hasExclude ? excludeBoxes : [],
      hasExcludeFilter: hasExclude,
      audienceCount: base,
      finalAudienceCount: base,
    });
  };

  // Next button click
  const handleNext = () => {
    let finalCount = state.audienceCount;
    if (!hasCalculated || !finalCount) {
      finalCount = hasExclude ? 46200 : 68420;
      setHasCalculated(true);
    }

    updateState({
      audienceIncludeBoxes: includeBoxes,
      audienceExcludeBoxes: hasExclude ? excludeBoxes : [],
      hasExcludeFilter: hasExclude,
      audienceCount: finalCount,
      finalAudienceCount: finalCount,
    });
    onNext();
  };

  // Count box string (initially 'xxxxx' as in Image 2 & 3)
  const displayCount =
    hasCalculated && state.audienceCount
      ? formatNumberWithCommas(state.audienceCount)
      : 'xxxxx';

  // Render a filter box (the card containing rows + bottom buttons)
  const renderFilterBox = (
    box: AudienceFilterBox,
    boxIndex: number,
    isExclude: boolean
  ) => {
    return (
      <div
        key={box.id}
        className="bg-[#F6F4EE] rounded-[10px] p-5 sm:p-6 border border-[#E2DDD5] space-y-4 shadow-2xs relative"
      >
        {/* Box Delete Button (if more than 1 box) */}
        {(isExclude ? excludeBoxes : includeBoxes).length > 1 && (
          <button
            type="button"
            onClick={() => handleRemoveBox(boxIndex, isExclude)}
            title="Remove group"
            className="absolute top-3 right-3 text-[#807A70] hover:text-[#DC2626] p-1 cursor-pointer transition-colors z-20"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Rows inside this box */}
        <div className="space-y-4">
          {box.rows.map((row, rowIndex) => {
            const propConfig = getPropConfig(row.property);
            const operators = propConfig.operators || ['is', 'is not'];
            const allowedValues = propConfig.allowedValues || [];
            const isMultiSelect =
              row.operator === 'contains' ||
              row.operator === 'does not contain' ||
              row.operator.toLowerCase().includes('contain');

            // Stacking context so upper rows don't get covered by lower rows when popover opens
            const rowZIndex = (box.rows.length - rowIndex) * 10;

            return (
              <React.Fragment key={row.id}>
                {/* AND / OR toggle between rows within the same box */}
                {rowIndex > 0 && (
                  <div className="flex justify-center my-1.5">
                    <div className="inline-flex rounded-[4px] overflow-hidden border border-[#DCD5C8]">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleRowConnector(boxIndex, rowIndex, 'AND', isExclude)
                        }
                        className={`px-4 py-1 text-[12px] font-bold transition-colors cursor-pointer ${
                          row.connector === 'AND'
                            ? 'bg-[#FCE8E2] text-[#C2410C]'
                            : 'bg-[#E5DFD5] text-[#5A554E] hover:bg-[#DDD8D0]'
                        }`}
                      >
                        AND
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleRowConnector(boxIndex, rowIndex, 'OR', isExclude)
                        }
                        className={`px-4 py-1 text-[12px] font-bold transition-colors cursor-pointer ${
                          row.connector === 'OR'
                            ? 'bg-[#FCE8E2] text-[#C2410C]'
                            : 'bg-[#E5DFD5] text-[#5A554E] hover:bg-[#DDD8D0]'
                        }`}
                      >
                        OR
                      </button>
                    </div>
                  </div>
                )}

                {/* Filter Row: Where Property | Property | Operator / Aggregate | Attributes */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end relative"
                  style={{ zIndex: rowZIndex }}
                >
                  {/* Column 1: Clause / Where Selector */}
                  <div className="sm:col-span-3">
                    <CustomConfigDropdown
                      value={row.clauseType || 'Where Property'}
                      onChange={(val) =>
                        handleClauseChange(boxIndex, rowIndex, val, isExclude)
                      }
                      options={CLAUSE_OPTIONS}
                      withSearch={false}
                      placeholder="Select Clause"
                      triggerClassName="h-[38px]"
                    />
                  </div>

                  {/* Column 2: Property Selector (Themed Dropdown per Image 1) */}
                  <div className="sm:col-span-4">
                    {(() => {
                      const propList = isExclude
                        ? EXCLUDE_SUPPRESSION_PROPERTIES
                        : INCLUDE_SUPPRESSION_PROPERTIES;
                      return (
                        <CustomConfigDropdown
                          value={row.property}
                          onChange={(val) =>
                            handlePropertyChange(boxIndex, rowIndex, val, isExclude)
                          }
                          options={propList.map((p) => ({
                            value: p.name,
                            label: p.name,
                          }))}
                          withSearch={true}
                          placeholder="Select Property"
                          searchPlaceholder="Search property..."
                          triggerClassName="h-[38px]"
                        />
                      );
                    })()}
                  </div>

                  {/* Column 3: Operator / Aggregate Selector (Themed Dropdown per Image 1) */}
                  <div className="sm:col-span-2">
                    <CustomConfigDropdown
                      value={row.operator}
                      onChange={(val) =>
                        handleOperatorChange(boxIndex, rowIndex, val, isExclude)
                      }
                      options={operators.map((op) => ({
                        value: op,
                        label: op,
                      }))}
                      withSearch={operators.length > 4}
                      placeholder="Select Operator"
                      searchPlaceholder="Search operator..."
                      triggerClassName="h-[38px]"
                    />
                  </div>

                  {/* Column 4: Attributes Input / Allowed Values (Multi-select when contains/does not contain) */}
                  <div className="sm:col-span-3">
                    <span className="text-[10px] text-[#807A70] font-normal block mb-0.5 leading-none pl-0.5">
                      Attributes
                      {isMultiSelect && (
                        <span className="ml-1 text-[#FF5C35] font-medium">
                          (Multi-select)
                        </span>
                      )}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Sub-case A: Operator is "is empty" */}
                      {row.operator === 'is empty' ? (
                        <div className="w-full h-[38px] px-3 bg-[#EFECE6] border border-[#DCD5C8] rounded-[6px] flex items-center text-[12px] text-[#706B62] italic select-none shadow-2xs">
                          Blank / Empty
                        </div>
                      ) : propConfig.type === 'decile' && row.operator === 'is between' ? (
                        /* Sub-case B: Decile range operator "is between" */
                        (() => {
                          const parts = (row.value || '1 - 5')
                            .split(/[-to]/)
                            .map((s) => s.trim());
                          const fromVal = parts[0] || '1';
                          const toVal = parts[1] || '5';

                          return (
                            <div className="flex items-center gap-1 w-full h-[38px]">
                              <div className="flex-1">
                                <CustomConfigDropdown
                                  value={fromVal}
                                  onChange={(v) =>
                                    handleRangeChange(
                                      boxIndex,
                                      rowIndex,
                                      v,
                                      toVal,
                                      isExclude
                                    )
                                  }
                                  options={allowedValues.map((v) => ({
                                    value: v,
                                    label: v,
                                  }))}
                                  withSearch={false}
                                  triggerClassName="h-[38px] px-2 text-[12px]"
                                />
                              </div>
                              <span className="text-[11px] text-[#807A70] font-semibold shrink-0">
                                to
                              </span>
                              <div className="flex-1">
                                <CustomConfigDropdown
                                  value={toVal}
                                  onChange={(v) =>
                                    handleRangeChange(
                                      boxIndex,
                                      rowIndex,
                                      fromVal,
                                      v,
                                      isExclude
                                    )
                                  }
                                  options={allowedValues.map((v) => ({
                                    value: v,
                                    label: v,
                                  }))}
                                  withSearch={false}
                                  triggerClassName="h-[38px] px-2 text-[12px]"
                                />
                              </div>
                            </div>
                          );
                        })()
                      ) : allowedValues && allowedValues.length > 0 ? (
                        /* Sub-case C: Themed Dropdown (Multi-select when contains/does not contain, Single-select otherwise) */
                        <div className="w-full">
                          <CustomConfigDropdown
                            value={row.value}
                            onChange={(val) =>
                              handleValueChange(boxIndex, rowIndex, val, isExclude)
                            }
                            multiSelect={isMultiSelect}
                            options={allowedValues.map((val) => ({
                              value: val,
                              label: val,
                            }))}
                            withSearch={allowedValues.length > 4}
                            placeholder={
                              isMultiSelect
                                ? 'Select attributes...'
                                : 'Select attribute'
                            }
                            searchPlaceholder="Search attribute..."
                            triggerClassName="h-[38px]"
                          />
                        </div>
                      ) : (
                        /* Sub-case D: Text Input fallback */
                        <input
                          type="text"
                          value={row.value}
                          onChange={(e) =>
                            handleValueChange(
                              boxIndex,
                              rowIndex,
                              e.target.value,
                              isExclude
                            )
                          }
                          placeholder="Value"
                          className="w-full h-[38px] bg-white border border-[#DCD5C8] rounded-[6px] px-3 text-[13px] text-[#1A1816] outline-none hover:border-[#807A70] focus:border-[#1A1816] shadow-2xs"
                        />
                      )}

                      {box.rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(boxIndex, rowIndex, isExclude)}
                          title="Remove row"
                          className="text-[#807A70] hover:text-[#DC2626] p-1 cursor-pointer transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom Actions of this Box: + Nested Filter and + Property (Swapped per user instructions) */}
        <div className="flex items-center gap-4 pt-1">
          <button
            type="button"
            onClick={() => handleAddNestedFilter(boxIndex, isExclude)}
            className="text-[13px] font-bold text-[#FF5C35] hover:underline cursor-pointer"
          >
            + Nested Filter
          </button>
          <button
            type="button"
            onClick={() => handleAddPropertyBox(isExclude)}
            className="text-[13px] font-bold text-[#FF5C35] hover:underline cursor-pointer"
          >
            + Property
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-body">
      {/* ── Main White Form Container ───────────────────────────────────── */}
      <div className="w-full bg-white rounded-[12px] p-6 sm:p-8 md:p-10 border border-[#E2DDD5] shadow-xs space-y-7">
        {/* ── Heading ──────────────────────────────────────────────────────── */}
        <div>
          <h2 className="text-[18px] font-bold text-[#1A1816] tracking-tight">
            Customer Group Setup
          </h2>
          <p className="text-[13px] text-[#807A70] mt-0.5">
            Define the customers eligible for this use case.
          </p>
        </div>

        {/* ── Include Section Enclosed in Outline Box (Grey border with 10% opacity) ── */}
        <div className="border border-gray-500/10 rounded-[12px] p-5 sm:p-6 bg-white space-y-4 shadow-2xs">
          <div className="inline-block px-4 py-1 rounded-[4px] bg-[#FF5C35] text-white text-[12.5px] font-semibold tracking-wide shadow-2xs">
            Include
          </div>

          <div className="space-y-4">
            {includeBoxes.map((box, boxIdx) => (
              <React.Fragment key={box.id}>
                {/* Connector between boxes inside Include */}
                {boxIdx > 0 && (
                  <div className="flex justify-center my-2">
                    <div className="inline-flex rounded-[4px] overflow-hidden border border-[#DCD5C8]">
                      <button
                        type="button"
                        onClick={() => handleToggleBoxConnector(boxIdx, 'AND', false)}
                        className={`px-4 py-1 text-[12px] font-bold transition-colors cursor-pointer ${
                          box.connector === 'AND'
                            ? 'bg-[#FCE8E2] text-[#C2410C]'
                            : 'bg-[#E5DFD5] text-[#5A554E] hover:bg-[#DDD8D0]'
                        }`}
                      >
                        AND
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleBoxConnector(boxIdx, 'OR', false)}
                        className={`px-4 py-1 text-[12px] font-bold transition-colors cursor-pointer ${
                          box.connector === 'OR'
                            ? 'bg-[#FCE8E2] text-[#C2410C]'
                            : 'bg-[#E5DFD5] text-[#5A554E] hover:bg-[#DDD8D0]'
                        }`}
                      >
                        OR
                      </button>
                    </div>
                  </div>
                )}
                {renderFilterBox(box, boxIdx, false)}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── + Exclude Button (when inactive) OR Exclude Outline Box (when active) ── */}
        {!hasExclude ? (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setHasExclude(true)}
              className="text-[13.5px] font-bold text-[#FF5C35] hover:underline cursor-pointer flex items-center gap-1"
            >
              + Exclude
            </button>
          </div>
        ) : (
          <div className="border border-gray-500/10 rounded-[12px] p-5 sm:p-6 bg-white space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="inline-block px-4 py-1 rounded-[4px] bg-[#FF5C35] text-white text-[12.5px] font-semibold tracking-wide shadow-2xs">
                Exclude
              </div>
              <button
                type="button"
                onClick={() => setHasExclude(false)}
                className="text-[12px] text-[#807A70] hover:text-[#DC2626] font-medium cursor-pointer transition-colors"
              >
                Remove Exclude
              </button>
            </div>

            <div className="space-y-4">
              {excludeBoxes.map((box, boxIdx) => (
                <React.Fragment key={box.id}>
                  {/* Connector between boxes inside Exclude */}
                  {boxIdx > 0 && (
                    <div className="flex justify-center my-2">
                      <div className="inline-flex rounded-[4px] overflow-hidden border border-[#DCD5C8]">
                        <button
                          type="button"
                          onClick={() => handleToggleBoxConnector(boxIdx, 'AND', true)}
                          className={`px-4 py-1 text-[12px] font-bold transition-colors cursor-pointer ${
                            box.connector === 'AND'
                              ? 'bg-[#FCE8E2] text-[#C2410C]'
                              : 'bg-[#E5DFD5] text-[#5A554E] hover:bg-[#DDD8D0]'
                          }`}
                        >
                          AND
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleBoxConnector(boxIdx, 'OR', true)}
                          className={`px-4 py-1 text-[12px] font-bold transition-colors cursor-pointer ${
                            box.connector === 'OR'
                              ? 'bg-[#FCE8E2] text-[#C2410C]'
                              : 'bg-[#E5DFD5] text-[#5A554E] hover:bg-[#DDD8D0]'
                          }`}
                        >
                          OR
                        </button>
                      </div>
                    </div>
                  )}
                  {renderFilterBox(box, boxIdx, true)}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* ── Count & Show Count Bar (Matching Image 2 & 3) ──────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-3 border-t border-[#EFECE6]">
          {/* Audience Count Box on the Left */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#1A1816] block">
              {hasExclude ? 'Final Audience Count' : 'Audience Count'}
            </label>
            <div className="w-56 h-[40px] bg-white border border-[#DCD5C8] rounded-[6px] flex items-center justify-center font-data font-semibold text-[14px] text-[#1A1816] shadow-2xs">
              {displayCount}
            </div>
          </div>

          {/* Show Count Button on the Right */}
          <div>
            <button
              type="button"
              onClick={handleShowCount}
              className="bg-[#DDD8D0] hover:bg-[#D2CDC4] text-[#2C2824] px-6 py-2 rounded-[6px] font-semibold text-[13px] cursor-pointer transition-colors shadow-2xs"
            >
              Show Count
            </button>
          </div>
        </div>

        {validationError && (
          <div className="p-3 bg-[#FEE2E2] border border-[#DC2626]/30 rounded-[8px] text-[12px] text-[#7F1D1D] font-medium">
            {validationError}
          </div>
        )}
      </div>

      {/* ── Bottom Actions Bar ───────────────────────────────────────────── */}
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
          onClick={handleNext}
          className="px-8 py-2 rounded-[8px] text-[13.5px] font-medium bg-[#E8E4DD] text-[#4A453E] hover:bg-[#DDD8D0] hover:text-[#1A1816] transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

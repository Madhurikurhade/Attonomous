import React from 'react';
import { ArrowLeft, Construction } from 'lucide-react';

interface UnderConstructionScreenProps {
  title: string;
  onBackToDashboard: () => void;
}

export const UnderConstructionScreen: React.FC<UnderConstructionScreenProps> = ({
  title,
  onBackToDashboard,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 sm:px-10 md:px-14 py-8 bg-[#F4F1EB] min-h-full font-body select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[#706B62] hover:text-[#1A1816] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-[16px] p-10 sm:p-14 border border-[#E5DFD5] shadow-xs text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FFF2ED] flex items-center justify-center text-[#FF5C35]">
            <Construction className="w-7 h-7 stroke-[2]" />
          </div>

          <h1 className="text-[26px] font-serif font-bold text-[#1A1816]">
            {title}
          </h1>

          <p className="text-[15px] text-[#706B62] font-medium max-w-md mx-auto">
            under the construction
          </p>

          <div className="pt-4">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="px-6 py-2 bg-[#FF5C35] hover:bg-[#E04F2E] text-white text-[13px] font-semibold rounded-[6px] shadow-2xs transition-colors cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

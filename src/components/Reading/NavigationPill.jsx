import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NavigationPill = ({ paragraphNumber, onPrevious, onNext }) => {
  return (
    <div className="mb-8 mt-10 flex justify-center sm:mt-12">
      <div className="flex w-full max-w-[300px] items-center justify-between rounded-[1.35rem] border border-gold-border/22 bg-white/72 px-3 py-2.5 shadow-[0_20px_50px_rgba(120,93,48,0.08)] backdrop-blur-xl dark:border-dark-border/60 dark:bg-dark-surface/58 sm:max-w-[340px] sm:px-4">
        <button
          onClick={onPrevious}
          disabled={!onPrevious}
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-gold-surface/35 hover:text-gold-primary disabled:opacity-30 disabled:hover:bg-transparent dark:text-slate-500 dark:hover:text-gold-light"
          aria-label="이전 문단"
        >
          <ChevronLeft size={18} strokeWidth={1.75} />
        </button>

        <div className="text-center">
          <p className="font-inter text-[9px] font-semibold uppercase tracking-[0.26em] text-gold-deep/70 dark:text-gold-light/65">
            Continue Reading
          </p>
          <span className="mt-1 block font-korean text-[16px] font-semibold tracking-[0.01em] text-slate-700 dark:text-gray-200 sm:text-[17px]">
            {`문단 ${paragraphNumber ?? ''}`}
          </span>
        </div>

        <button
          onClick={onNext}
          disabled={!onNext}
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-gold-surface/35 hover:text-gold-primary disabled:opacity-30 disabled:hover:bg-transparent dark:text-slate-500 dark:hover:text-gold-light"
          aria-label="다음 문단"
        >
          <ChevronRight size={18} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(NavigationPill);

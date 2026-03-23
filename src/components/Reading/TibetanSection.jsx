import React from 'react';

/**
 * @param {{
 *   tibetan: string,
 *   pronunciation: string
 * }} props
 */
function TibetanSection({ tibetan, pronunciation }) {
  if (!tibetan && !pronunciation) return null;

  return (
    <>
      <section
        id="primary-translation"
        className="relative mb-8 mt-6 overflow-hidden rounded-[2rem] border border-gold-border/20 bg-white/55 px-5 py-8 text-center shadow-[0_25px_60px_rgba(120,93,48,0.08)] backdrop-blur-xl dark:border-dark-border/60 dark:bg-dark-surface/45 sm:px-10 sm:py-12"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-gold-surface/25 to-transparent dark:from-gold-primary/10" />
        <div className="relative mx-auto max-w-4xl">
          <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.42em] text-gold-deep/70 dark:text-gold-light/70">
            Dagli Translation
          </p>

          {pronunciation ? (
            <p className="mt-4 font-inter text-[11px] uppercase tracking-[0.18em] text-gold-muted dark:text-gold-light/75">
              {pronunciation}
            </p>
          ) : null}

          {tibetan ? (
            <p className="mx-auto mt-5 max-w-[92%] text-left font-korean text-[1rem] leading-[1.95] tracking-[-0.01em] text-[#4A0404] antialiased drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] dark:text-[#F0D8BF] sm:text-[1.18rem] sm:leading-[2]">
              {tibetan.replace(/[\r\n]+/g, ' ')}
            </p>
          ) : null}
        </div>
      </section>

      <div className="mx-auto my-8 flex w-full max-w-md items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-border/40 to-transparent" />
        <span className="font-serif text-sm text-gold-primary/60 dark:text-gold-light/60">III</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-border/40 to-transparent" />
      </div>
    </>
  );
}

export default React.memo(TibetanSection);

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
    <section className="mb-10 space-y-8 sm:space-y-10">
      <div className="rounded-[1.8rem] border border-gold-border/18 bg-white/55 px-5 py-6 shadow-[0_20px_50px_rgba(120,93,48,0.05)] backdrop-blur-lg dark:border-dark-border/55 dark:bg-dark-surface/35 sm:px-8 sm:py-8">
        <div className="space-y-2">
          <p className="font-inter text-[12px] font-semibold tracking-[0.01em] text-gold-deep/82 dark:text-gold-light/78">
            The Ringstones of Wisdom (Fusus al-Hikam)
          </p>
          <p className="font-inter text-[11px] font-semibold tracking-[0.16em] text-gold-muted dark:text-gold-light/70">
            Caner Dagli Translation
          </p>
        </div>

        {tibetan ? (
          <div className="mx-auto mt-4 max-w-4xl space-y-5">
            <div className="rounded-[1.25rem] border border-gold-border/12 bg-white/55 px-4 py-4 dark:border-dark-border/45 dark:bg-dark-bg/25">
              <p className="mt-0 whitespace-pre-line text-left font-korean text-[17px] leading-[1.9] tracking-[-0.01em] text-text-primary/92 dark:text-dark-text-primary/92 sm:text-[19px] sm:leading-[1.95]">
                {tibetan.replace(/[\r\n]+/g, ' ')}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default React.memo(TibetanSection);

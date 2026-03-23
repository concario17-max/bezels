import React from 'react';

/**
 * @param {{
 *   chapterStr: string,
 *   verseStr: string,
 *   globalIndex: number,
 *   verseId: string,
 *   chapterTitle?: string,
 *   paragraphTitle?: string
 * }} props
 */
function ReadingHeader({
  chapterStr,
  verseStr,
  globalIndex,
  verseId,
  chapterTitle,
  paragraphTitle,
}) {
  const sectionLabel = chapterTitle || (verseStr ? `Chapter ${chapterStr}` : 'Text');
  const entryLabel = paragraphTitle || `Section ${globalIndex || `${chapterStr}-${verseStr}` || verseId}`;
  const sectionIndexLabel = `SECTION ${globalIndex || verseId}`;
  const readingLabel = sectionLabel === entryLabel ? sectionLabel : `${sectionLabel} / ${entryLabel}`;

  return (
    <div className="mb-8 pt-2 text-center sm:mb-10 sm:pt-4">
      <p className="font-inter text-[10px] font-semibold tracking-[0.08em] text-gold-deep/70 dark:text-gold-light/65 sm:text-[11px]">
        {`${readingLabel} / ${sectionIndexLabel}`}
      </p>
    </div>
  );
}

export default React.memo(ReadingHeader);

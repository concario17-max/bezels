/** @typedef {import('../types').ReadingChapter} ReadingChapter */
/** @typedef {import('../types').ReadingParagraph} ReadingParagraph */

const BOOK_TITLE = '\uC774\uBE10 \uC54C \uC544\uB77C\uBE44';
const COLLECTION_TITLE = '\uC9C0\uD61C\uC758 \uBCF4\uC11D';

/**
 * @typedef ParsedChapterEntry
 * @property {number} chapterNumber
 * @property {string} englishTitle
 * @property {string} koreanTitle
 * @property {Array<{number: number, dagli: string, austin: string}>} paragraphs
 */

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeWhitespace(value) {
  return value.replace(/\r/g, '').trim();
}

/**
 * @param {string} source
 * @returns {string[]}
 */
export function parseTocEntries(source) {
  return source
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^\d+\.\s*/, '').trim());
}

/**
 * @param {string[]} blockLines
 * @returns {{ dagli: string, austin: string }}
 */
function parseParagraphBlock(blockLines) {
  const lines = blockLines.map((line) => line.trimEnd());
  let mode = null;
  /** @type {string[]} */
  const dagliLines = [];
  /** @type {string[]} */
  const austinLines = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('* Dagli:')) {
      mode = 'dagli';
      const remainder = line.replace(/^\*\s*Dagli:\s*/, '');
      if (remainder) dagliLines.push(remainder);
      continue;
    }

    if (line.startsWith('* Austin:')) {
      mode = 'austin';
      const remainder = line.replace(/^\*\s*Austin:\s*/, '');
      if (remainder) austinLines.push(remainder);
      continue;
    }

    if (mode === 'dagli') dagliLines.push(line);
    if (mode === 'austin') austinLines.push(line);
  }

  return {
    dagli: normalizeWhitespace(dagliLines.join('\n')),
    austin: normalizeWhitespace(austinLines.join('\n')),
  };
}

/**
 * @param {string} source
 * @param {string[]} tocEntries
 * @returns {ParsedChapterEntry[]}
 */
export function parseChapterEntries(source, tocEntries) {
  const lines = source.replace(/\r/g, '').split('\n');
  /** @type {ParsedChapterEntry[]} */
  const chapters = [];
  /** @type {ParsedChapterEntry | null} */
  let currentChapter = null;
  let currentParagraphNumber = null;
  /** @type {string[]} */
  let currentParagraphLines = [];

  /**
   * @returns {void}
   */
  function flushParagraph() {
    if (!currentChapter || currentParagraphNumber === null) return;
    const { dagli, austin } = parseParagraphBlock(currentParagraphLines);
    currentChapter.paragraphs.push({
      number: currentParagraphNumber,
      dagli,
      austin,
    });
    currentParagraphNumber = null;
    currentParagraphLines = [];
  }

  /**
   * @returns {void}
   */
  function flushChapter() {
    flushParagraph();
    if (currentChapter) chapters.push(currentChapter);
    currentChapter = null;
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const chapterMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (chapterMatch) {
      flushChapter();
      const chapterNumber = Number(chapterMatch[1]);
      currentChapter = {
        chapterNumber,
        englishTitle: chapterMatch[2].trim(),
        koreanTitle: tocEntries[chapterNumber - 1] ?? chapterMatch[2].trim(),
        paragraphs: [],
      };
      continue;
    }

    const paragraphMatch = line.match(/^\[\uBB38\uB2E8\s+(\d+)\]$/);
    if (paragraphMatch) {
      flushParagraph();
      currentParagraphNumber = Number(paragraphMatch[1]);
      continue;
    }

    if (currentParagraphNumber !== null) {
      currentParagraphLines.push(rawLine);
    }
  }

  flushChapter();

  return chapters;
}

/**
 * @param {ParsedChapterEntry[]} chapters
 * @returns {ReadingChapter}
 */
export function createBookGroup(chapters) {
  return {
    id: 'book',
    chapterName: COLLECTION_TITLE,
    title: COLLECTION_TITLE,
    isGroup: true,
    subchapters: chapters.map((chapter) => ({
      id: String(chapter.chapterNumber),
      chapterName: chapter.koreanTitle,
      title: chapter.koreanTitle,
      tocHeadings:
        chapter.englishTitle === 'THE WISDOM OF SUBLIMITY IN THE WORD OF ISHMAEL' ? [] : [chapter.englishTitle],
      tocActionLabel: chapter.koreanTitle,
      paragraphs: chapter.paragraphs.map((paragraph) => ({
        id: `book.${chapter.chapterNumber}.${paragraph.number}`,
        title: `\uBB38\uB2E8 ${paragraph.number}`,
        paragraphNumber: paragraph.number,
        chapterTitle: chapter.koreanTitle,
        sourceHeading: chapter.englishTitle,
        text: {
          tibetan: paragraph.dagli,
          pronunciation: chapter.englishTitle,
          english: `Austin\n${paragraph.austin}`,
          korean: '',
        },
      })),
    })),
  };
}

/**
 * @param {ReadingChapter[]} chapters
 * @returns {ReadingParagraph[]}
 */
export function flattenParagraphs(chapters) {
  return chapters.flatMap((chapter) =>
    chapter.isGroup && chapter.subchapters
      ? chapter.subchapters.flatMap((subchapter) => subchapter.paragraphs ?? [])
      : chapter.paragraphs ?? [],
  );
}

export { BOOK_TITLE, COLLECTION_TITLE };

import sourceText from '../../1. \uC774\uBE10 \uC54C \uC544\uB77C\uBE44 \uC601-\uC601 (1).txt?raw';
import tocSource from '../../2 \uC774\uBE10 \uC54C \uC544\uB77C\uBE44 \uBAA9\uCC28.txt?raw';
import {
  createBookGroup,
  flattenParagraphs,
  parseChapterEntries,
  parseTocEntries,
} from './parseThreeBodiesCore';

export { createBookGroup, flattenParagraphs, parseChapterEntries, parseTocEntries } from './parseThreeBodiesCore';

export function buildReadingData() {
  const tocEntries = parseTocEntries(tocSource);
  const chapterEntries = parseChapterEntries(sourceText, tocEntries);

  return [createBookGroup(chapterEntries)];
}

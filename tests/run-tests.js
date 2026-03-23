import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DESKTOP_FRAME_COLUMNS_DEFAULT,
  DESKTOP_FRAME_COLUMNS_FULL_WIDTH,
  DESKTOP_FRAME_COLUMNS_LEFT_CLOSED,
  DESKTOP_FRAME_COLUMNS_RIGHT_CLOSED,
  getDesktopFrameColumns,
} from '../src/components/ui/desktopFrame.js';
import {
  BOOK_TITLE,
  COLLECTION_TITLE,
  createBookGroup,
  flattenParagraphs,
  parseChapterEntries,
  parseTocEntries,
} from '../src/lib/parseThreeBodiesCore.js';
import { resolveStoredActiveParagraph } from '../src/lib/readingState.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

async function loadFixture(name) {
  return readFile(path.join(projectRoot, name), 'utf8');
}

function runDesktopFrameTests() {
  assert.equal(getDesktopFrameColumns(true, true), DESKTOP_FRAME_COLUMNS_DEFAULT);
  assert.equal(getDesktopFrameColumns(false, true), DESKTOP_FRAME_COLUMNS_LEFT_CLOSED);
  assert.equal(getDesktopFrameColumns(true, false), DESKTOP_FRAME_COLUMNS_RIGHT_CLOSED);
  assert.equal(getDesktopFrameColumns(false, false), DESKTOP_FRAME_COLUMNS_FULL_WIDTH);
}

async function runParserTests() {
  const source = await loadFixture('1. 이븐 알 아라비 영-영 (1).txt');
  const tocSource = await loadFixture('2 이븐 알 아라비 목차.txt');

  const tocEntries = parseTocEntries(tocSource);
  const chapterEntries = parseChapterEntries(source, tocEntries);
  const bookGroup = createBookGroup(chapterEntries);
  const flatParagraphs = flattenParagraphs([bookGroup]);

  assert.equal(BOOK_TITLE, '이븐 알 아라비');
  assert.equal(COLLECTION_TITLE, '지혜의 보석');
  assert.equal(tocEntries.length, 27);
  assert.equal(chapterEntries.length, 27);
  assert.equal(chapterEntries[0].englishTitle, 'THE WISDOM OF DIVINITY IN THE WORD OF ADAM');
  assert.equal(chapterEntries[0].koreanTitle, '아담(ADAM)의 말씀 안에 나타난 신성(DIVINITY)의 지혜');
  assert.equal(chapterEntries[0].paragraphs[0].number, 1);
  assert.equal(chapterEntries[0].paragraphs[0].dagli.startsWith('The Real willed'), true);
  assert.equal(chapterEntries[0].paragraphs[0].austin.startsWith('The Reality wanted'), true);
  assert.equal(chapterEntries.at(-1)?.englishTitle, 'THE WISDOM OF SINGULARITY IN THE WORD OF MUHAMMAD');
  assert.equal(bookGroup.title, COLLECTION_TITLE);
  assert.equal(bookGroup.isGroup, true);
  assert.equal(bookGroup.subchapters?.length, 27);
  assert.deepEqual(bookGroup.subchapters?.[0]?.tocHeadings, ['THE WISDOM OF DIVINITY IN THE WORD OF ADAM']);
  assert.equal(bookGroup.subchapters?.[0]?.paragraphs?.[0]?.title, '문단 1');
  assert.equal(bookGroup.subchapters?.[0]?.paragraphs?.[0]?.text.english.startsWith('Austin\n'), true);
  assert.equal(flatParagraphs[0]?.id, 'book.1.1');
  assert.equal(flatParagraphs[0]?.chapterTitle, '아담(ADAM)의 말씀 안에 나타난 신성(DIVINITY)의 지혜');
  assert.equal(flatParagraphs[0]?.text.tibetan.startsWith('The Real willed'), true);
  assert.equal(flatParagraphs.at(-1)?.id, `book.27.${chapterEntries.at(-1)?.paragraphs.at(-1)?.number}`);
}

function runReadingStateTests() {
  const paragraphs = [
    {
      id: 'book.1.1',
      title: '문단 1',
      paragraphNumber: 1,
      chapterTitle: '아담(ADAM)의 말씀 안에 나타난 신성(DIVINITY)의 지혜',
      text: {
        tibetan: 'a',
        pronunciation: 'THE WISDOM OF DIVINITY IN THE WORD OF ADAM',
        english: 'Austin\na',
        korean: '',
      },
    },
    {
      id: 'book.1.2',
      title: '문단 2',
      paragraphNumber: 2,
      chapterTitle: '아담(ADAM)의 말씀 안에 나타난 신성(DIVINITY)의 지혜',
      text: {
        tibetan: 'b',
        pronunciation: 'THE WISDOM OF DIVINITY IN THE WORD OF ADAM',
        english: 'Austin\nb',
        korean: '',
      },
    },
  ];

  assert.equal(
    resolveStoredActiveParagraph(JSON.stringify('book.1.2'), paragraphs[0], paragraphs)?.id,
    'book.1.2',
  );
  assert.equal(
    resolveStoredActiveParagraph('{bad json', paragraphs[0], paragraphs)?.id,
    'book.1.1',
  );
}

async function main() {
  runDesktopFrameTests();
  await runParserTests();
  runReadingStateTests();
  console.log('All tests passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

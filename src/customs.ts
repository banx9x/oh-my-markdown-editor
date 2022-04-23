import { styleTags, Tag, tags as defaultTags } from '@codemirror/highlight';
import { MarkdownConfig } from '@lezer/markdown';

export const tags = {
  highlight: Tag.define(),
  underline: Tag.define(),
  subscript: Tag.define(),
  superscript: Tag.define(),
  inlineCode: Tag.define(),
  blockCode: Tag.define(),
};

const HighlightDelim = { resolve: 'Highlight', mark: 'HighlightMark' };
export const Highlight = {
  defineNodes: ['Highlight', 'HighlightMark'],
  parseInline: [
    {
      name: 'Highlight',
      parse(cx, next, pos) {
        if (next != 61 /* '=' */ || cx.char(pos + 1) != 61) {
          return -1;
        }
        return cx.addDelimiter(HighlightDelim, pos, pos + 2, true, true);
      },
      after: 'Emphasis',
    },
  ],
  props: [
    styleTags({
      HighlightMark: defaultTags.processingInstruction,
      'Highlight/...': tags.highlight,
    }),
  ],
} as MarkdownConfig;

const UnderlineDelim = { resolve: 'Underline', mark: 'UnderlineMark' };
export const Underline = {
  defineNodes: ['Underline', 'UnderlineMark'],
  parseInline: [
    {
      name: 'Underline',
      parse(cx, next, pos) {
        if (next != 43 /* '+' */ || cx.char(pos + 1) != 43) {
          return -1;
        }
        return cx.addDelimiter(UnderlineDelim, pos, pos + 2, true, true);
      },
      after: 'Emphasis',
    },
  ],
  props: [
    styleTags({
      UnderlineMark: defaultTags.processingInstruction,
      'Underline/...': tags.underline,
    }),
  ],
} as MarkdownConfig;

const SubScriptDelim = { resolve: 'SubScript', mark: 'SubScriptMark' };
export const SubScript = {
  defineNodes: ['SubScript', 'SubScriptMark'],
  parseInline: [
    {
      name: 'SubScript',
      parse(cx, next, pos) {
        if (next != 126 /* '~' */ || cx.char(pos + 1) == 126) {
          return -1;
        }
        return cx.addDelimiter(SubScriptDelim, pos, pos + 1, true, true);
      },
      after: 'Emphasis',
    },
  ],
  props: [
    styleTags({
      SubScriptMark: defaultTags.processingInstruction,
      'SubScript/...': tags.subscript,
    }),
  ],
} as MarkdownConfig;

const SuperScriptDelim = { resolve: 'SuperScript', mark: 'SuperScriptMark' };
export const SuperScript = {
  defineNodes: ['SuperScript', 'SuperScriptMark'],
  parseInline: [
    {
      name: 'SuperScript',
      parse(cx, next, pos) {
        if (next != 94 /* '^' */) {
          return -1;
        }
        return cx.addDelimiter(SuperScriptDelim, pos, pos + 1, true, true);
      },
      after: 'Emphasis',
    },
  ],
  props: [
    styleTags({
      SuperScriptMark: defaultTags.processingInstruction,
      'SuperScript/...': tags.superscript,
    }),
  ],
} as MarkdownConfig;

const InlineCodeDelim = { resolve: 'InlineCode', mark: 'InlineCodeMark' };
export const InlineCode = {
  defineNodes: ['InlineCode', 'InlineCodeMark'],
  parseInline: [
    {
      name: 'InlineCode',
      parse(cx, next, pos) {
        // console.log(next, pos);
        if (next != 96 /* '`' */) {
          return -1;
        }

        if (cx.char(pos - 1) == 96) {
          return -1;
        }

        return cx.addDelimiter(InlineCodeDelim, pos, pos + 1, true, true);
      },
      after: 'BlockQuote',
    },
  ],
  props: [
    styleTags({
      InlineCodeMark: defaultTags.processingInstruction,
      'InlineCode/...': tags.inlineCode,
    }),
  ],
} as MarkdownConfig;

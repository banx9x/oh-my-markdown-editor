import { EditorView } from '@codemirror/basic-setup';
import { Extension } from '@codemirror/state';
import { HighlightStyle, tags as t } from '@codemirror/highlight';

import { tags } from './customs';

// Using https://github.com/atom/one-light-syntax as reference for the colors
// Config ...
const syntaxHue = '230';
const syntaxSaturation = '1%';
const syntaxBrightness = '98%';
// Monochrome ...
const mono1 = `hsl(${syntaxHue},8%,24%)`;
const mono2 = `hsl(${syntaxHue},6%,44%)`;
const mono3 = `hsl(${syntaxHue},4%,64%)`;
// Colors
const hue1 = 'hsl(198, 99%, 37%)'; // <-cyan
const hue2 = 'hsl(221, 87%, 60%)'; // <-blue
const hue3 = 'hsl(301, 63%, 40%)'; // <-purple
const hue4 = 'hsl(119, 34%, 47%)'; // <-green
const hue5 = 'hsl(  5, 74%, 59%)'; // <-red 1
const hue5_2 = 'hsl(344, 84%, 43%)'; // <-red 2
const hue6 = 'hsl(41, 99%, 30%)'; // <-orange 1
const hue6_2 = 'hsl(41, 99%, 38%)'; // <-orange 2
// Base colors ________
const syntaxFg = `${mono1}`;
const syntaxBg = `hsl(${syntaxHue},${syntaxSaturation},${syntaxBrightness})`;
const syntaxGutter = `darken(${syntaxBg},36%)`;
const syntaxGuide = `fade${syntaxFg},20%`;
const syntaxAccent = `hsl${syntaxHue},100%,66%`;

// Using https://github.com/one-dark/vscode-one-dark-theme/ as reference for the colors
const chalky = '#e5c07b';
const coral = '#1d1d1d';
const cyan = '#56b6c2';
const invalid = '#ffffff';
const ivory = '#222222';
const stone = '#7d8799';
const malibu = '#1478fc';
const sage = '#98c379';
const whiskey = '#d19a66';
const violet = '#c678dd';
// highlightBackground = '#eeeeee';
const highlightBackground = hue2;

const background = '#ffffff';
const font =
  'Mono, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica,Mono, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji';
const color = '#222222';
const cursor = hue2;
const highlight = '#eeeeee';
const selection = '#eeeeee';
const selectionMatch = '#eeeeee';
const lineNumber = '#999999';
const matchingBracket = '#b7ccfa';
const tooltipBackground = '#e3e3e3';

export const customTheme = EditorView.theme(
  {
    '&': {
      color: font,
      backgroundColor: background,
      height: '100%',
    },

    '.cm-content': {
      caretColor: cursor,
      whiteSpace: 'break-spaces',
    },

    '&.cm-editor.cm-focused': {
      outline: 'none',
    },

    '& .cm-scroller': {
      fontFamily:
        'Helvetica, -apple-system, BlinkMacSystemFont, Segoe UI, Mono, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
      fontSize: '16px',
    },

    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: cursor,
      borderLeft: `2px solid ${cursor}`,
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      {
        backgroundColor: selection,
        color: 'unset',
      },

    '.cm-panels': { backgroundColor: background, color: color },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': {
      border: '1px solid #e3e3e3',
      borderLeft: 0,
      borderTop: 0,
      minHeight: '1em',
      padding: '3px',
    },

    '.cm-searchMatch': {
      backgroundColor: '#72a1ff59',
      outline: '1px solid #457dff',
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: '#6199ff2f',
    },

    '.cm-activeLine': { backgroundColor: highlight },
    '.cm-selectionMatch': { backgroundColor: selectionMatch },

    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
      backgroundColor: matchingBracket,
    },

    '.cm-gutters': {
      backgroundColor: background,
      color: lineNumber,
      border: 'none',
    },

    '.cm-activeLineGutter': {
      backgroundColor: highlight,
    },

    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ddd',
    },

    '.cm-tooltip': {
      border: 'none',
      padding: '3px 0',
      backgroundColor: tooltipBackground,
    },
    '.cm-tooltip .cm-tooltip-arrow:before': {
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
    },
    '.cm-tooltip .cm-tooltip-arrow:after': {
      borderTopColor: tooltipBackground,
      borderBottomColor: tooltipBackground,
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: highlightBackground,
        color: ivory,
      },
    },
    '.cm-scroller': { overflowY: 'scroll' },
  },
  { dark: true }
);

export const customHighlight = HighlightStyle.define([
  // * Chú thích
  // keyword: const , let, interface
  // operatorKeyword: như of ở trong loop
  //  name: các thể loại tên của biến, nhưng không phải trong lúc khai báo
  // character: theo doc là dấu backslash , test không ra
  // labelName: thường dùng để đặt tên cho luồng for loop, dùng kèm với các keyword esc để thoát khỏi các nested loop phức tạp
  //proppertyName: tên props trong obj
  //nameSpace: name để tránh trùng tên , vd: import {something as anotherthing}
  // tagName: tag html
  // definitiTionOperator: =, (), {},
  // definition(t.name): tên lúc khai báo
  // className: có thể là className trong html tag
  // t.separator: dấu câu
  // typeName: type ,ví dụ trong ts
  // modifier: trong js: private, public, protected
  // self: ^this^.obj
  // processingInstruction: các dấu xử lý của markdown như #, * và đồng bọn
  // TODO bổ sung thêm danh sách nếu biết được thêm các tag
  {
    tag: [t.keyword, t.operatorKeyword],
    color: hue3,
    fontFamily: 'Menlo,Helvetica, Mono,monospace',
    fontSize: '14px',
  },
  {
    tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
    color: syntaxFg,
    fontFamily: 'Menlo,Helvetica, Mono,monospace',
    fontSize: '14px',
  },
  {
    // đoạn này để test
    tag: [t.deleted, t.character, t.propertyName, t.macroName],
    color: 'oragne',
  },
  {
    tag: [t.labelName, t.propertyName, t.namespace, t.tagName],
    color: hue5,
    fontFamily: 'Menlo,Helvetica, Mono,monospace',
    fontSize: '14px',
  },
  {
    tag: [t.color, t.constant(t.variableName), t.standard(t.name)],
    color: hue6,
  },
  {
    tag: [t.definitionOperator],
    color: hue1,
  },
  {
    tag: [t.definition(t.variableName), t.className],
    color: hue6_2, // chưa ổn
    fontFamily: 'Menlo,Helvetica, Mono,monospace',
    fontSize: '14px',
  },
  {
    tag: [t.separator],
    color: syntaxFg,
  },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.modifier,
      t.function(t.variableName),
    ],
    color: hue1,
    fontFamily: 'Menlo,Helvetica, Mono,monospace',
    fontSize: '14px',
  },
  {
    tag: [t.className],
    color: hue6_2,
    fontFamily: 'Menlo,Helvetica, Mono,monospace',
    fontSize: '14px',
  },
  {
    tag: [t.number],
    color: hue6,
    fontFamily: 'Menlo,Helvetica, Mono,monospace',
    fontSize: '14px',
  },
  {
    tag: [t.self, t.namespace],
    color: hue5_2,
    fontFamily: 'Menlo,Helvetica, Mono,monospace',
    fontSize: '14px',
  },
  {
    tag: [t.url, t.escape, t.regexp, t.link, t.special(t.string), t.string],
    color: hue4,
    fontFamily: 'Menlo,Helvetica, Mono,monospace',
  },
  {
    tag: [t.operator],
    color: hue2,
  },
  {
    tag: [t.meta, t.comment],
    color: stone,
  },
  {
    tag: t.strong,
    fontWeight: '600',
  },
  {
    tag: t.emphasis,
    fontStyle: 'italic',
  },
  {
    tag: t.strikethrough,
    textDecoration: 'line-through',
  },
  {
    tag: t.link,
    color: stone,
    textDecoration: 'none',
    fontFamily: font,
  },
  { tag: t.heading, fontWeight: 'bold', color: syntaxFg },
  {
    tag: t.heading1,
    fontSize: '32px',
    fontWeight: '600',
    lineHeight: '40px',
    paddingBottom: '0.3em',
  },
  {
    tag: t.heading2,
    fontSize: '1.5em',
    fontWeight: '600',
    lineHeight: '1.25',
  },
  {
    tag: t.heading3,
    fontSize: '1.25em',
    fontWeight: '600',
    lineHeight: '1.25',
  },
  {
    tag: [t.atom, t.bool, t.special(t.variableName), t.null, t.number],
    color: hue6,
    fontFamily: 'Menlo,Helvetica, Mono,monospace',
    fontSize: '14px',
  },
  {
    tag: [t.squareBracket, t.paren, t.brace],
    color: syntaxAccent,
  },
  {
    tag: t.atom,
    color: hue1,
  },
  {
    tag: [t.processingInstruction, t.string, t.inserted],
    color: mono2,
  },
  {
    tag: t.invalid,
    color: hue5_2,
  },
  {
    tag: [t.attributeName],
    color: hue2,
  },
  {
    tag: [t.punctuation],
    color: hue1,
  },
  {
    tag: [t.bracket],
    color: syntaxFg,
  },
  {
    tag: [t.function(t.propertyName)],
    color: hue2,
  },
  {
    tag: [t.quote],
    color: '#57606a',
  },
  {
    tag: [t.monospace],
    display: 'inline-block',
    padding: '0.2em 0.4em',
    fontSize: '85%',
    margin: 0,
    backgroundColor: 'rgba(229, 83, 75, 0.15)',
    borderRadius: '6px',
    color: '#e5534b',
  },
  {
    tag: [t.changed],
    textDecoration: 'line-throuh',
    color: 'red',
  },
  {
    tag: tags.highlight,
    backgroundColor: 'yellow',
  },
  {
    tag: tags.underline,
    textDecoration: 'underline',
  },
  {
    tag: tags.superscript,
    display: 'inline-block',
    position: 'relative',
    bottom: '4px',
    fontSize: '70%',
    background: highlight,
  },
  {
    tag: tags.subscript,
    display: 'inline-block',
    position: 'relative',
    top: '4px',
    fontSize: '70%',
    background: highlight,
  },
  {
    tag: tags.inlineCode,
    fontSize: '85%',
    margin: 0,
    backgroundColor: 'rgba(229, 83, 75, 0.15)',
    color: '#e5534b',
  },
  {
    tag: t.special(tags.inlineCode),
    backgroundColor: 'blue',
  },
]);

export const editorTheme: Extension = [customTheme, customHighlight];

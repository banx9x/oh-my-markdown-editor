import { EditorView } from "@codemirror/basic-setup";
import { Extension } from "@codemirror/state";
import { HighlightStyle, tags as t } from "@codemirror/highlight";

// Using https://github.com/one-dark/vscode-one-dark-theme/ as reference for the colors
const chalky = "#e5c07b",
    coral = "#1d1d1d",
    cyan = "#56b6c2",
    invalid = "#ffffff",
    ivory = "#222222",
    stone = "#7d8799",
    malibu = "#1478fc",
    sage = "#98c379",
    whiskey = "#d19a66",
    violet = "#c678dd",
    highlightBackground = "#eeeeee";

const background = "#ffffff",
    font =
        "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
    color = "#222222",
    cursor = "#666666",
    highlight = "#eeeeee",
    selection = "#eeeeee",
    selectionMatch = "#99FFCD",
    lineNumber = "#999999",
    matchingBracket = "#D9534F",
    tooltipBackground = "#e3e3e3";

export const customTheme = EditorView.theme(
    {
        "&": {
            color: font,
            backgroundColor: background,
            height: "100%",
        },

        ".cm-content": {
            caretColor: cursor,
        },

        "&.cm-editor": {
            borderLeft: "1px solid #e3e3e3",
        },

        "&.cm-editor.cm-focused": {
            outline: "none",
        },

        "& .cm-scroller": {
            fontFamily: font,
        },

        ".cm-cursor, .cm-dropCursor": { borderLeftColor: cursor },
        "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
            {
                backgroundColor: selection,
                color: "unset",
            },

        ".cm-panels": { backgroundColor: background, color: color },
        ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
        ".cm-panels.cm-panels-bottom": {
            border: "1px solid #e3e3e3",
            borderLeft: 0,
            borderTop: 0,
            minHeight: "1em",
            padding: "3px",
        },

        ".cm-searchMatch": {
            backgroundColor: "#72a1ff59",
            outline: "1px solid #457dff",
        },
        ".cm-searchMatch.cm-searchMatch-selected": {
            backgroundColor: "#6199ff2f",
        },

        ".cm-activeLine": { backgroundColor: highlight },
        ".cm-selectionMatch": { backgroundColor: selectionMatch },

        "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket":
            {
                backgroundColor: matchingBracket,
            },

        ".cm-gutters": {
            backgroundColor: background,
            color: lineNumber,
            border: "none",
        },

        ".cm-activeLineGutter": {
            backgroundColor: highlight,
        },

        ".cm-foldPlaceholder": {
            backgroundColor: "transparent",
            border: "none",
            color: "#ddd",
        },

        ".cm-tooltip": {
            border: "none",
            padding: "3px 0",
            backgroundColor: tooltipBackground,
        },
        ".cm-tooltip .cm-tooltip-arrow:before": {
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
        },
        ".cm-tooltip .cm-tooltip-arrow:after": {
            borderTopColor: tooltipBackground,
            borderBottomColor: tooltipBackground,
        },
        ".cm-tooltip-autocomplete": {
            "& > ul > li[aria-selected]": {
                backgroundColor: highlightBackground,
                color: ivory,
            },
        },
        ".cm-scroller": { overflow: "scroll" },
    },
    { dark: false }
);

export const customHighlight = HighlightStyle.define([
    {
        tag: t.keyword,
        color: violet,
        fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace",
        fontSize: "14px",
    },
    {
        tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
        color: coral,
        fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace",
        fontSize: "14px",
    },
    {
        tag: [t.function(t.variableName), t.labelName],
        color: malibu,
        fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace",
        fontSize: "14px",
    },
    { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: whiskey },
    {
        tag: [t.definition(t.name), t.separator],
        color: ivory,
        fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace",
        fontSize: "14px",
    },
    {
        tag: [
            t.typeName,
            t.className,
            t.number,
            t.changed,
            t.annotation,
            t.modifier,
            t.self,
            t.namespace,
        ],
        color: chalky,
        fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace",
        fontSize: "14px",
    },
    {
        tag: [
            t.operator,
            t.operatorKeyword,
            t.url,
            t.escape,
            t.regexp,
            t.link,
            t.special(t.string),
        ],
        color: cyan,
        fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace",
    },
    { tag: [t.meta, t.comment], color: stone },
    { tag: t.strong, fontWeight: "600" },
    { tag: t.emphasis, fontStyle: "italic" },
    { tag: t.strikethrough, textDecoration: "line-through" },
    {
        tag: t.link,
        color: stone,
        textDecoration: "none",
        fontFamily: font,
    },
    { tag: t.heading, fontWeight: "bold", color: coral },
    {
        tag: t.heading1,
        fontSize: "32px",
        fontWeight: "600",
        lineHeight: "40px",
        paddingBottom: "0.3em",
    },
    {
        tag: t.heading2,
        fontSize: "1.5em",
        fontWeight: "600",
        lineHeight: "1.25",
    },
    {
        tag: t.heading3,
        fontSize: "1.25em",
        fontWeight: "600",
        lineHeight: "1.25",
    },
    {
        tag: [t.atom, t.bool, t.special(t.variableName)],
        color: whiskey,
        fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace",
        fontSize: "14px",
    },
    { tag: [t.processingInstruction, t.string, t.inserted], color: sage },
    { tag: t.invalid, color: invalid },
    // Style cho #
    { tag: t.processingInstruction, color: "red" },
    // Unknow
    { tag: t.inserted },
    // String Literal
    { tag: t.string, color: "green" },
]);

export const editorTheme: Extension = [customTheme, customHighlight];

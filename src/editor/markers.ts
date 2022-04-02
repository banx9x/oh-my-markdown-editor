import { EditorView as CMEditorView } from "@codemirror/basic-setup";
import { Text as CMText } from "@codemirror/text";
import { EditorSelection as CMEditorSelection } from "@codemirror/state";

const bold = (view: CMEditorView) => {
    view.dispatch(
        view.state.changeByRange((range) => {
            return {
                changes: [
                    {
                        from: range.from,
                        insert: CMText.of(["**"]),
                    },
                    {
                        from: range.to,
                        insert: CMText.of(["**"]),
                    },
                ],
                range: CMEditorSelection.range(range.from + 2, range.to + 2),
            };
        })
    );
};

const italic = (view: CMEditorView) => {
    view.dispatch(
        view.state.changeByRange((range) => {
            return {
                changes: [
                    {
                        from: range.from,
                        insert: CMText.of(["*"]),
                    },
                    {
                        from: range.to,
                        insert: CMText.of(["*"]),
                    },
                ],
                range: CMEditorSelection.range(range.from + 1, range.to + 1),
            };
        })
    );
};

const strikethrough = (view: CMEditorView) => {
    view.dispatch(
        view.state.changeByRange((range) => {
            return {
                changes: [
                    {
                        from: range.from,
                        insert: CMText.of(["~"]),
                    },
                    {
                        from: range.to,
                        insert: CMText.of(["~"]),
                    },
                ],
                range: CMEditorSelection.range(range.from + 1, range.to + 1),
            };
        })
    );
};

const link = (view: CMEditorView, text?: string, url?: string) => {
    view.dispatch(
        view.state.changeByRange((range) => {
            const selectionText = view.state.sliceDoc(range.from, range.to);
            const anchor = text || selectionText;
            const link = `[${anchor}](${url ?? "https://"})`;
            const backspace = url ? 0 : 1;

            return {
                changes: [
                    {
                        from: range.from,
                        to: range.to,
                        insert: CMText.of([link]),
                    },
                ],
                range: CMEditorSelection.range(
                    range.from + link.length - backspace,
                    range.to + link.length - anchor.length - backspace
                ),
            };
        })
    );
};

const image = (view: CMEditorView, alt?: string, url?: string) => {
    const img = `![${alt ?? "text"}](${url ?? "https://"})`;

    view.dispatch(
        view.state.changeByRange((range) => {
            return {
                changes: [
                    {
                        from: range.from,
                        insert: CMText.of([img]),
                    },
                ],
                range: CMEditorSelection.range(
                    range.from + (url ? img.length : img.length - 1),
                    range.to + (url ? img.length : img.length - 1)
                ),
            };
        })
    );
};

export interface Markers {
    bold: (view: CMEditorView) => void;
    italic: (view: CMEditorView) => void;
    strikethrough: (view: CMEditorView) => void;
    link: (view: CMEditorView, text?: string, url?: string) => void;
    image: (view: CMEditorView, alt?: string, url?: string) => void;
}

export default { bold, italic, strikethrough, link, image } as Markers;

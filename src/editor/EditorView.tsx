import {
    EditorState as CMEditorState,
    EditorView as CMEditorView,
    basicSetup,
} from "@codemirror/basic-setup";
import { keymap, ViewUpdate } from "@codemirror/view";
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
} from "react";
import styled, { css } from "styled-components";
import {
    markdown,
    markdownLanguage,
    markdownKeymap,
} from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { indentWithTab } from "@codemirror/commands";
import { editorTheme } from "./EditorTheme";
import { EditorContext } from "./Editor";

const View = styled.div<{
    isPreview: boolean;
    editorHeight: number;
}>`
    ${({ isPreview }) =>
        isPreview
            ? css`
                  & {
                      width: 50%;
                  }
              `
            : css`
                  width: 100%;
              `}

    ${({ editorHeight }) => css`
        & {
            height: ${editorHeight}px;
        }
    `}
`;

const EditorView: React.FC = () => {
    const editorRef = useRef<HTMLDivElement>(null);
    const {
        initialDoc,
        doc,
        editorHeight,
        editorView,
        setEditorView,
        showFullScreen,
        setShowFullScreen,
        currentActive,
        setCurrentActive,
        scrollPosition,
        setScrollPosition,
        showPreview,
        setShowPreview,
        acceptTypes,
        validateFile,
        uploadFunction,
        onChange,
        onSave,
        markers,
    } = useContext(EditorContext);

    const boldCommand = useCallback((view: CMEditorView): boolean => {
        markers.bold(view);
        return false;
    }, []);

    const italicCommand = useCallback((view: CMEditorView): boolean => {
        markers.italic(view);
        return true;
    }, []);

    const saveCommand = useCallback((view: CMEditorView): boolean => {
        onSave && onSave(view.state.doc.toString());
        return true;
    }, []);

    const commands = useMemo(
        () =>
            keymap.of([
                {
                    mac: "cmd-b",
                    win: "ctrl-b",
                    run: boldCommand,
                },
                {
                    mac: "cmd-i",
                    win: "ctrl-i",
                    run: italicCommand,
                },
                {
                    mac: "cmd-s",
                    win: "ctrl-s",
                    run: saveCommand,
                },
            ]),
        []
    );

    useEffect(() => {
        if (!editorRef.current) return;

        const editorState = CMEditorState.create({
            doc: initialDoc,
            extensions: [
                commands,
                basicSetup,
                markdown({
                    base: markdownLanguage,
                    codeLanguages: languages,
                    addKeymap: true,
                }),
                editorTheme,
                keymap.of([indentWithTab, ...markdownKeymap]),
                CMEditorView.updateListener.of((update) => {
                    if (update.changes) {
                        onChange && onChange(update.state.doc.toString());
                    }
                }),
                CMEditorView.domEventHandlers({
                    scroll(e, view) {
                        setScrollPosition(
                            view.scrollDOM.scrollTop /
                                view.scrollDOM.scrollHeight
                        );
                    },
                    paste(e, view) {
                        if (!uploadFunction) return;

                        const file = e.clipboardData?.files[0];

                        if (!file) return;

                        if (validateFile(file))
                            uploadFunction(
                                file,
                                (url) => {
                                    markers.image(view, file.name, url);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                    },
                    drop(e, view) {
                        if (!uploadFunction) return;

                        const file = e.dataTransfer?.files[0];

                        if (!file) return;

                        if (validateFile(file))
                            uploadFunction(
                                file,
                                (url) => {
                                    markers.image(view, file.name, url);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                    },
                }),
            ],
        });

        const editorView =
            editorRef.current &&
            new CMEditorView({
                state: editorState,
                parent: editorRef.current,
            });

        setEditorView(editorView);
    }, [editorRef]);

    useEffect(() => {
        if (!editorView) return;
        if (currentActive == "editor") return;

        editorView.scrollDOM.scrollTop =
            editorView.scrollDOM.scrollHeight * scrollPosition;
    });

    const onMouseEnter = useCallback(() => {
        if (currentActive != "editor") setCurrentActive("editor");
    }, [currentActive]);

    return (
        <View
            className="editor-view"
            ref={editorRef}
            isPreview={showPreview}
            editorHeight={editorHeight}
            onMouseEnter={onMouseEnter}
        />
    );
};

export default EditorView;

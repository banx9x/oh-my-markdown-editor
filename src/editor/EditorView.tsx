import {
  EditorState as CMEditorState,
  EditorView as CMEditorView,
  basicSetup,
} from '@codemirror/basic-setup';
import { keymap } from '@codemirror/view';
import { commentKeymap } from '@codemirror/comment';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  markdown,
  markdownLanguage,
  markdownKeymap,
} from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { indentWithTab } from '@codemirror/commands';
import { editorTheme } from './EditorTheme';
import { image } from './markers';
import { commands } from './commands';

import {
  Highlight,
  Underline,
  SubScript,
  SuperScript,
  InlineCode,
} from './customs';

interface EditorViewProps {
  initialDoc: string;
  editorHeight: number;
  view?: CMEditorView;
  setEditorView: React.Dispatch<React.SetStateAction<CMEditorView | undefined>>;
  currentActive: 'editor' | 'preview';
  setCurrentActive: React.Dispatch<React.SetStateAction<'editor' | 'preview'>>;
  scrollPosition: number;
  setScrollPosition: React.Dispatch<React.SetStateAction<number>>;
  preview: boolean;
  fullscreen: boolean;
  acceptTypes: string;
  uploadFunction?: (file: File, success: (url: string) => void) => void;
  onChange: (doc: string) => void;
  onSave: (doc: string) => void;
}

const EditorView: React.FC<EditorViewProps> = ({
  initialDoc,
  editorHeight,
  view,
  setEditorView,
  currentActive,
  setCurrentActive,
  scrollPosition,
  setScrollPosition,
  preview,
  fullscreen,
  acceptTypes,
  uploadFunction,
  onChange,
  onSave,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

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
          extensions: [
            Highlight,
            Underline,
            SubScript,
            SuperScript,
            InlineCode,
          ],
        }),
        editorTheme,
        keymap.of([indentWithTab, ...markdownKeymap, ...commentKeymap]),
        CMEditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
        CMEditorView.domEventHandlers({
          scroll(e, view) {
            setScrollPosition(
              view.scrollDOM.scrollTop / view.scrollDOM.scrollHeight
            );
          },
          paste(e, view) {
            if (
              !uploadFunction ||
              !e.clipboardData ||
              !e.clipboardData.files ||
              !e.clipboardData.files[0]
            )
              return;

            const file = e.clipboardData.files[0];
            const fileTypes = acceptTypes.split(',');

            if (!fileTypes.includes(file.type)) return;

            uploadFunction(file, (url) => {
              image(view, file.name, url);
            });
          },
          drop(e, view) {
            if (
              !uploadFunction ||
              !e.dataTransfer ||
              !e.dataTransfer.files ||
              !e.dataTransfer.files[0]
            )
              return;

            const file = e.dataTransfer.files[0];
            const fileTypes = acceptTypes.split(',');

            if (!fileTypes.includes(file.type)) return;

            uploadFunction(file, (url) => {
              image(view, file.name, url);
            });
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

    return () => {
      editorView.destroy();
    };
  }, [editorRef]);

  useEffect(() => {
    if (!view) return;
    if (currentActive == 'editor') return;

    view.scrollDOM.scrollTop = view.scrollDOM.scrollHeight * scrollPosition;
  });

  const onMouseEnter = useCallback(() => {
    if (currentActive != 'editor') setCurrentActive('editor');
  }, [currentActive]);

  return (
    <div
      className='editor-view'
      ref={editorRef}
      onMouseEnter={onMouseEnter}
      style={{
        width: preview ? '50%' : '100%',
        height: fullscreen ? '100%' : editorHeight,
      }}></div>
  );
};

export default React.memo(EditorView);

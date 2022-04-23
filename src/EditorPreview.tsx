import 'github-markdown-css/github-markdown-light.css';
import React, { useCallback, useEffect, useRef } from 'react';
import './EditorPreview.css';
import 'highlight.js/styles/atom-one-light.css';
import { BiCopy } from 'react-icons/bi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import rehypeFigure from 'rehype-figure';
import rehypeVideo from 'rehype-video';

interface EditorPreviewProps {
  doc: string;
  editorHeight: number;
  currentActive: 'editor' | 'preview';
  setCurrentActive: React.Dispatch<React.SetStateAction<'editor' | 'preview'>>;
  fullscreen: boolean;
  scrollPosition: number;
  setScrollPosition: React.Dispatch<React.SetStateAction<number>>;
}

const EditorPreview: React.FC<EditorPreviewProps> = ({
  doc,
  editorHeight,
  currentActive,
  setCurrentActive,
  fullscreen,
  scrollPosition,
  setScrollPosition,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const onMouseEnter = useCallback(() => {
    if (currentActive !== 'preview') setCurrentActive('preview');
  }, [currentActive]);

  const onScroll = useCallback(() => {
    if (!previewRef || !previewRef.current) return;

    setScrollPosition(
      previewRef.current.scrollTop / previewRef.current.scrollHeight
    );
  }, [previewRef]);

  useEffect(() => {
    if (!previewRef.current) return;
    if (currentActive == 'preview') return;

    previewRef.current.scrollTop =
      previewRef.current.scrollHeight * scrollPosition;
  });

  return (
    <div
      className={'markdown-body editor-preview'}
      ref={previewRef}
      style={{ height: fullscreen ? '100%' : editorHeight }}
      onMouseEnter={onMouseEnter}
      onScroll={onScroll}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[
          rehypeStringify,
          rehypeRaw,
          rehypeSlug,
          [rehypeHighlight, { ignoreMissing: true }],
          [rehypeFigure, { className: 'figure' }],
          [rehypeVideo, { details: false }],
        ]}
        components={{
          pre: (props) => {
            const pre = useRef<HTMLPreElement>(null);

            return (
              <div style={{ position: 'relative' }}>
                <button
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: '#ffffff',
                    padding: '4px 8px 0px',
                    borderRadius: 4,
                    border: '1px solid grey',
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(pre.current?.textContent);
                  }}>
                  <BiCopy />
                </button>
                <pre ref={pre}>{props.children}</pre>
              </div>
            );
          },
        }}
        disallowedElements={['script']}
        remarkRehypeOptions={{
          footnoteLabel: 'Chú thích',
        }}>
        {doc}
      </ReactMarkdown>
    </div>
  );
};

export default React.memo(EditorPreview);

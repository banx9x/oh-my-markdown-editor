import 'github-markdown-css/github-markdown-light.css';
import { defaultSchema } from 'hast-util-sanitize';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkReact from 'remark-react';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import style from './EditorPreview.module.css';
import RemarkCode from './RemarkCode';

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), 'className'],
  },
};

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

  const md = useMemo(
    () =>
      unified()
        .use(remarkParse)
        .use(remarkGfm, {
          singleTilde: false,
        })
        .use(remarkStringify)
        .use(remarkReact, {
          createElement: React.createElement,
          sanitize: schema,
          remarkReactComponents: {
            code: RemarkCode,
          },
        })
        .processSync(doc).result,
    [doc]
  );

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
      className={'markdown-body ' + style.container}
      ref={previewRef}
      style={{ height: fullscreen ? '100%' : editorHeight }}
      onMouseEnter={onMouseEnter}
      onScroll={onScroll}>
      {md}
    </div>
  );
};

export default React.memo(EditorPreview);

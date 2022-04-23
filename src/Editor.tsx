/* eslint-disable spaced-comment */
import { EditorView as CMEditorView } from '@codemirror/basic-setup';
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import EditorPreview from './EditorPreview';
import EditorToolbar from './EditorToolbar';
import EditorView from './EditorView';
import classNames from 'classnames';
import './Editor.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import rehypeFigure from 'rehype-figure';
import rehypeVideo from 'rehype-video';

interface EditorProps {
  /** Giá trị content khởi tạo */
  initialDoc?: string;
  /** Chiều cao trình soạn thảo, mặc định là 500 */
  height?: number;
  /** Hàm chạy mỗi khi content thay đổi */
  onChange?: (doc: string) => void;
  /** Hàm chạy mỗi khi lưu bằng tổ hợp phím `Ctrl-S` hoặc `Cmd-S` */
  onSave?: (doc: string) => void;
  /**  Hàm chạy khi có lỗi gì đó, ví dụ lỗi xác thực file, ..., dùng để push thông báo */
  onError?: (error: string) => void;
  /** Định dạng file chấp nhận tải lên */
  acceptTypes?: string;
  /** Hàm chạy khi kéo thả/copy pate file vào editor */
  uploadFunction?: (file: File, onSuccess: (url: string) => void) => void;
}

const CMEditor: React.FC<EditorProps> = ({
  initialDoc = '',
  height = 500,
  onChange,
  onSave,
  acceptTypes = 'image/jpg,image/jpeg,image/png',
  uploadFunction,
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState(initialDoc);
  const [editorView, setEditorView] = useState<CMEditorView>();
  const [showPreview, setShowPreview] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [currentActive, setCurrentActive] = useState<'editor' | 'preview'>(
    'editor'
  );
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleChange = useCallback((doc) => {
    setDoc(doc);
    onChange && onChange(doc);
  }, []);

  const handleSave = useCallback((doc) => {
    onSave && onSave(doc);
  }, []);

  const editorHeight = useMemo(() => {
    if (!toolbarRef.current) return height;

    const toolbarHeight = toolbarRef.current.clientHeight;
    const screenHeight = document.documentElement.clientHeight;

    return showFullScreen
      ? screenHeight - toolbarHeight
      : height - toolbarHeight;
  }, [toolbarRef.current, showFullScreen]);

  return (
    <div
      className={classNames({
        container: true,
        fullscreen: showFullScreen,
      })}
      style={{ height }}>
      <EditorToolbar
        ref={toolbarRef}
        view={editorView}
        fullscreen={showFullScreen}
        showFullscreen={setShowFullScreen}
        preview={showPreview}
        showPreview={setShowPreview}
        acceptTypes={acceptTypes}
        uploadFunction={uploadFunction}
      />

      <div
        className='editor'
        style={{ height: editorHeight }}>
        <EditorView
          initialDoc={initialDoc}
          editorHeight={editorHeight}
          view={editorView}
          setEditorView={setEditorView}
          currentActive={currentActive}
          setCurrentActive={setCurrentActive}
          scrollPosition={scrollPosition}
          setScrollPosition={setScrollPosition}
          preview={showPreview}
          fullscreen={showFullScreen}
          acceptTypes={acceptTypes}
          uploadFunction={uploadFunction}
          onChange={handleChange}
          onSave={handleSave}
        />
        {showPreview && (
          <EditorPreview
            editorHeight={editorHeight}
            doc={doc}
            currentActive={currentActive}
            setCurrentActive={setCurrentActive}
            fullscreen={showFullScreen}
            scrollPosition={scrollPosition}
            setScrollPosition={setScrollPosition}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(CMEditor);

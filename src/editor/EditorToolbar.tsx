import React, { useCallback, useRef } from 'react';
import {
  BiBold,
  BiItalic,
  BiStrikethrough,
  BiLink,
  BiCode,
  BiCodeBlock,
  BiListOl,
  BiListUl,
  BiImageAdd,
  BiShow,
  BiHide,
  BiFullscreen,
  BiExitFullscreen,
} from 'react-icons/bi';
import style from './EditorToolbar.module.css';
import { EditorView } from '@codemirror/basic-setup';
import {
  bold,
  italic,
  strikethrough,
  link,
  image,
  code,
  blockCode,
  bulletList,
  numberList,
} from './markers';

interface EditorToolbarProps {
  view?: EditorView;
  fullscreen: boolean;
  showFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  preview: boolean;
  showPreview: React.Dispatch<React.SetStateAction<boolean>>;
  acceptTypes: string;
  uploadFunction?: (file: File, success: (url: string) => void) => void;
}

const EditorToolbar: React.ForwardRefExoticComponent<
  EditorToolbarProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(
  (
    {
      view,
      fullscreen,
      showFullscreen,
      preview,
      showPreview,
      acceptTypes,
      uploadFunction,
    },
    ref
  ) => {
    const fileRef = useRef<HTMLInputElement>(null);

    const handleBoldMarker = useCallback(() => {
      if (!view) return;

      bold(view);
    }, [view]);

    const handleItalicMarker = useCallback(() => {
      if (!view) return;

      italic(view);
    }, [view]);

    const handleStrikethroughMarker = useCallback(() => {
      if (!view) return;

      strikethrough(view);
    }, [view]);

    const handleImageMarker = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!view || !uploadFunction || !e.target.files || !e.target.files[0])
          return;

        const file = e.target.files[0];
        const fileTypes = acceptTypes.split(',');

        if (!fileTypes.includes(file.type)) return;

        uploadFunction(file, (url) => image(view, file.name, url));
      },
      [view]
    );

    const handleLinkMarker = useCallback(() => {
      if (!view) return;

      link(view);
      view.focus();
    }, [view]);

    const handleCodeMarker = useCallback(() => {
      if (!view) return;

      code(view);
    }, [view]);

    const handleBlockCodeMarker = useCallback(() => {
      if (!view) return;

      blockCode(view);
    }, [view]);

    const handleBulletList = useCallback(() => {
      if (!view) return;

      bulletList(view);
    }, [view]);

    const handleNubmerList = useCallback(() => {
      if (!view) return;

      numberList(view);
    }, [view]);

    const handleChangePreview = useCallback(() => {
      showPreview(!preview);
    }, [preview]);

    const handleChangeFullScreen = useCallback(() => {
      showFullscreen(!fullscreen);
    }, [fullscreen]);

    const openFileChooser = useCallback(() => {
      if (!fileRef.current || !uploadFunction) return;

      fileRef.current.click();
    }, [fileRef]);

    return (
      <div
        className={style.container}
        ref={ref}>
        <div className={style.left}>
          <button
            className={style.button}
            onClick={handleBoldMarker}>
            <BiBold />
          </button>
          <button
            className={style.button}
            onClick={handleItalicMarker}>
            <BiItalic />
          </button>
          <button
            className={style.button}
            onClick={handleStrikethroughMarker}>
            <BiStrikethrough />
          </button>
          <button
            className={style.button}
            onClick={handleLinkMarker}>
            <BiLink />
          </button>
          <button
            className={style.button}
            onClick={handleCodeMarker}>
            <BiCode />
          </button>
          <button
            className={style.button}
            onClick={handleBlockCodeMarker}>
            <BiCodeBlock />
          </button>
          <button
            className={style.button}
            onClick={handleBulletList}>
            <BiListUl />
          </button>
          <button
            className={style.button}
            onClick={handleNubmerList}>
            <BiListOl />
          </button>
          <button
            className={style.button}
            onClick={openFileChooser}>
            <BiImageAdd />
          </button>
        </div>

        <div className={style.right}>
          <button
            className={style.button}
            onClick={handleChangePreview}>
            {preview ? <BiHide /> : <BiShow />}
          </button>
          <button
            className={style.button}
            onClick={handleChangeFullScreen}>
            {fullscreen ? <BiExitFullscreen /> : <BiFullscreen />}
          </button>
        </div>

        {/* Hidden input dùng cho icon tải ảnh lên */}
        <input
          ref={fileRef}
          hidden
          type='file'
          accept={acceptTypes}
          multiple={false}
          onChange={handleImageMarker}
        />
      </div>
    );
  }
);

export default React.memo(EditorToolbar);

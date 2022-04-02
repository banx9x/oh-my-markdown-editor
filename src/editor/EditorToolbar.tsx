import { EditorView as CMEditorView } from "@codemirror/basic-setup";
import React, { ReactElement, useCallback, useContext, useRef } from "react";
import { Upload, Button } from "antd";
import {
    BoldOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    FileImageOutlined,
    FullscreenExitOutlined,
    FullscreenOutlined,
    ItalicOutlined,
    LinkOutlined,
    PictureOutlined,
    StrikethroughOutlined,
} from "@ant-design/icons";

import styled from "styled-components";
import { RcFile } from "antd/lib/upload";
import { EditorContext } from "./Editor";
const Toolbar = styled.div`
    border: 1px solid #e3e3e3;
    display: flex;
    justify-content: space-between;
`;

const LeftToolbar = styled.div``;
const RightToolbar = styled.div``;

const EditorToolbar: React.FC = () => {
    const fileRef = useRef<HTMLInputElement>(null);
    const {
        initialDoc,
        doc,
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

    const handleBoldMarker = useCallback(() => {
        if (!editorView) return;

        markers.bold(editorView);
        editorView.focus();
    }, [editorView]);

    const handleItalicMarker = useCallback(() => {
        if (!editorView) return;

        markers.italic(editorView);
        editorView.focus();
    }, [editorView]);

    const handleStrikethroughMarker = useCallback(() => {
        if (!editorView) return;

        markers.strikethrough(editorView);
        editorView.focus();
    }, [editorView]);

    const handleImageMarker = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!editorView || !uploadFunction) return;

            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];

                if (validateFile(file))
                    uploadFunction(
                        file,
                        (url) => markers.image(editorView, file.name, url),
                        () => {}
                    );
            }
        },
        [editorView]
    );

    const handleLinkMarker = useCallback(() => {
        if (!editorView) return;

        markers.link(editorView);
        editorView.focus();
    }, [editorView]);

    const handleChangePreview = useCallback(() => {
        setShowPreview(!showPreview);
    }, [showPreview]);

    const handleChangeFullScreen = useCallback(() => {
        setShowFullScreen(!showFullScreen);
    }, [showFullScreen]);

    const openFileChooser = useCallback(() => {
        if (!fileRef.current || !uploadFunction) return;

        fileRef.current.click();
    }, [fileRef]);

    return (
        <Toolbar>
            <LeftToolbar>
                <Button
                    icon={<BoldOutlined />}
                    type="text"
                    onClick={handleBoldMarker}
                />
                <Button
                    icon={<ItalicOutlined />}
                    type="text"
                    onClick={handleItalicMarker}
                />
                <Button
                    icon={<StrikethroughOutlined />}
                    type="text"
                    onClick={handleStrikethroughMarker}
                />
                <Button
                    icon={<LinkOutlined />}
                    type="text"
                    onClick={handleLinkMarker}
                />
                <Button
                    icon={<PictureOutlined />}
                    type="text"
                    onClick={openFileChooser}
                />
            </LeftToolbar>

            <RightToolbar>
                <Button
                    icon={
                        showPreview ? <EyeInvisibleOutlined /> : <EyeOutlined />
                    }
                    type="text"
                    onClick={handleChangePreview}
                />
                <Button
                    icon={
                        showFullScreen ? (
                            <FullscreenExitOutlined />
                        ) : (
                            <FullscreenOutlined />
                        )
                    }
                    type="text"
                    onClick={handleChangeFullScreen}
                />
            </RightToolbar>

            {/* Hidden input dùng cho icon tải ảnh lên */}
            <input
                ref={fileRef}
                hidden
                type="file"
                accept={acceptTypes}
                multiple={false}
                onChange={handleImageMarker}
            />
        </Toolbar>
    );
};

export default EditorToolbar;

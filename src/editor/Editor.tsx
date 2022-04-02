import { EditorView as CMEditorView } from "@codemirror/basic-setup";
import "antd/dist/antd.css";
import React, {
    createContext,
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";
import styled, { css } from "styled-components";
import EditorPreview from "./EditorPreview";
import EditorToolbar from "./EditorToolbar";
import EditorView from "./EditorView";
import markers, { Markers } from "./markers";

interface Props {
    /** Giá trị content khởi tạo */
    value?: string;
    /** Chiều cao trình soạn thảo, mặc định là 500 */
    height?: number;
    /**
     * Hàm chạy mỗi khi content thay đổi
     */
    onChange?: (doc: string) => void;
    /**
     * Hàm chạy mỗi khi lưu bằng tổ hợp phím `Ctrl-S` hoặc `Cmd-S`
     */
    onSave?: (doc: string) => void;
    /**
     * Hàm chạy khi có lỗi gì đó, ví dụ lỗi xác thực file, ..., dùng để push thông báo
     */
    onError?: (error: string) => void;
    /** Định dạng file chấp nhận tải lên */
    acceptTypes?: string;
    /**
     * Hàm chạy khi kéo thả/copy pate file vào editor
     */
    uploadFunction?: (
        file: File,
        onSuccess: (url: string) => void,
        onError: (error: string) => void
    ) => void;
    /**
     * Hàm lấy instance của CM, cho phép thao tác trực tiếp
     */
    getCMInstance?: (editorView: CMEditorView) => void;
}

interface Context {
    /** Văn bản ban đầu */
    initialDoc: string;
    /** Văn bản hiện tại */
    doc: string;
    /** Chiều cao trình soạn thảo */
    height: number;
    /** Container wrapper ref */
    wrapperRef: React.MutableRefObject<HTMLDivElement | null>;
    /** Editor View */
    editorView?: CMEditorView;
    /** Thiết lập CM instance */
    setEditorView: React.Dispatch<
        React.SetStateAction<CMEditorView | undefined>
    >;
    /** Trạng thái ẩn/hiện preview */
    showPreview: boolean;
    /** Chuyển trạng thái ẩn/hiện preview */
    setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
    /** Trạng thái focus, dùng cho đồng bộ cuộn 2 bên */
    currentActive: "editor" | "preview";
    /** Thiết lập vùng focus, đồng bộ bên còn lại khi cuộn */
    setCurrentActive: React.Dispatch<
        React.SetStateAction<"editor" | "preview">
    >;
    /** Ví trí cuộn hiện tại (tính theo tỉ lệ %) */
    scrollPosition: number;
    /** Thiết lập trạng thái cuộn của phần tử đang focus */
    setScrollPosition: React.Dispatch<React.SetStateAction<number>>;
    /** Trạng thái bật/tắt soạn thảo toàn màn hình */
    showFullScreen: boolean;
    /** Chuyển trạng thái bật/tắt soạn thảo toàn màn hình */
    setShowFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
    /**
     * Định dạng file chấp nhận tải lên, mặc định là `image/*`
     *
     * Tham khảo: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
     */
    acceptTypes: string;
    validateFile: (file: File) => boolean;
    /** Hàm chạy khi kéo thả/copy pate file vào editor */
    uploadFunction?: (
        file: File,
        onSuccess: (url: string) => void,
        onError: (error: string) => void
    ) => void;
    /** Hàm chạy mỗi khi content thay đổi */
    onChange?: (doc: string) => void;
    /** Hàm chạy mỗi khi lưu bằng tổ hợp phím `Ctrl-S` hoặc `Cmd-S` */
    onSave?: (doc: string) => void;
    /** Hàm chạy khi có lỗi gì đó, ví dụ lỗi xác thực file, ..., dùng để push thông báo */
    onError?: (error: string) => void;
    /** Chứa các hàm đánh dấu tùy chỉnh, ví dụ bold, italic, ... */
    markers: Markers;
}

export const EditorContext = createContext<Context>({} as Context);

const Editor = styled.div<{
    isFullScreen: boolean;
    height: number | string;
}>`
    & {
        display: flex;
        flex-direction: column;
    }

    ${({ isFullScreen, height }) =>
        isFullScreen
            ? css`
                  position: fixed !important;
                  top: 0;
                  left: 0;
                  bottom: 0;
                  width: 100%;
                  height: 100%;
                  z-index: 9999;
              `
            : css`
                  height: ${height}px;
              `}
`;

const Wrapper = styled.div`
    & {
        display: flex;
        flex: 1;
    }
`;

const CMEditor: React.FC<Props> = ({
    value = "",
    height = 500,
    onChange,
    onSave,
    acceptTypes = "image/jpg,image/jpeg,image/png",
    uploadFunction,
    getCMInstance,
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [editorView, setEditorView] = useState<CMEditorView>();
    const [showPreview, setShowPreview] = useState(false);
    const [showFullScreen, setShowFullScreen] = useState(false);
    const [currentActive, setCurrentActive] = useState<"editor" | "preview">(
        "editor"
    );
    const [scrollPosition, setScrollPosition] = useState(0);

    useMemo(() => {
        if (!editorView) return;

        getCMInstance && getCMInstance(editorView);
    }, [editorView]);

    const fileTypes = useMemo(() => acceptTypes.split(","), []);

    const validateFile = useCallback((file: File) => {
        return fileTypes.includes(file.type);
    }, []);

    return (
        <Editor isFullScreen={showFullScreen} height={height}>
            <EditorContext.Provider
                value={{
                    initialDoc: value,
                    doc: editorView?.state.doc.toString() || value,
                    height,
                    wrapperRef,
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
                }}
            >
                <EditorToolbar />

                <Wrapper ref={wrapperRef}>
                    <EditorView />
                    {showPreview && <EditorPreview />}
                </Wrapper>
            </EditorContext.Provider>
        </Editor>
    );
};

export default CMEditor;

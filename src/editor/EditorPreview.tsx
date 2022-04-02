import "github-markdown-css/github-markdown-light.css";
import { defaultSchema } from "hast-util-sanitize";
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
} from "react";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkReact from "remark-react";
import styled, { css } from "styled-components";
import { unified } from "unified";
import { EditorContext } from "./Editor";
import RemarkCode from "./RemarkCode";

const schema = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        code: [...(defaultSchema.attributes?.code || []), "className"],
    },
};

const Preview = styled.div<{
    previewHeight: number;
}>`
    & {
        width: 50%;
    }

    ${({ previewHeight }) => css`
        & {
            height: ${previewHeight}px;
        }
    `}

    & {
        overflow: scroll;
        padding: 5px 10px;
    }

    & h1,
    & h2,
    & h3,
    & h4 {
        border-bottom: 0;
        margin-top: 0;
    }

    & pre {
        overflow: unset !important;
    }
`;

const EditorPreview: React.FC = () => {
    const previewRef = useRef<HTMLDivElement>(null);
    const {
        initialDoc,
        doc,
        editorHeight,
        editorView,
        showFullScreen,
        setShowFullScreen,
        currentActive,
        setCurrentActive,
        scrollPosition,
        setScrollPosition,
        showPreview,
        setShowPreview,
        uploadFunction,
    } = useContext(EditorContext);

    const md = useMemo(
        () =>
            unified()
                .use(remarkParse)
                .use(remarkGfm)
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
        if (currentActive !== "preview") setCurrentActive("preview");
    }, [currentActive]);

    const onScroll = useCallback(() => {
        if (!previewRef || !previewRef.current) return;

        setScrollPosition(
            previewRef.current.scrollTop / previewRef.current.scrollHeight
        );
    }, [previewRef]);

    useEffect(() => {
        if (!previewRef.current) return;
        if (currentActive == "preview") return;

        previewRef.current.scrollTop =
            previewRef.current.scrollHeight * scrollPosition;
    });

    return (
        <Preview
            className="markdown-body"
            ref={previewRef}
            previewHeight={editorHeight}
            onMouseEnter={onMouseEnter}
            onScroll={onScroll}
        >
            {md}
        </Preview>
    );
};

export default EditorPreview;

import { useCallback, useState } from "react";
import Editor from "./editor/Editor";

function App() {
    const [doc, setDoc] = useState(
        `# Hello World\n\n- [x] Custom style cho editor\n- [x] Highlight code trong editor\n- [x] Preview\n- [x] Soạn thảo full màn hình\n- [x] Command tùy chỉnh cho phím\n- [x] Drag drop/copy paste hình ảnh/upload qua button trên toolbar\n- [x] Thực hiện một số tối ưu hóa với \`useCallback\`, \`useMemo\`\n- [x] Đồng bộ cuộn 2 bên\n- [x] Refactor code, sử dụng Context\n- [ ] Custom Language (để bổ sung thêm một số cú pháp markdown)\n- [ ] ... \n\nDùng thử miễn phí, nếu có lỗi, hay góp ý để cải thiện hơn hãy nói nhẹ nhàng, đừng chửi =]]`
    );

    const handleUploadImage = useCallback(
        (
            file: File,
            onSuccess: (url: string) => void,
            onError: (error: string) => void
        ): void => {
            const form = new FormData();
            form.append("upload", file);

            fetch("http://localhost:8087/api/upload-image", {
                method: "POST",
                body: form,
            })
                .then((res) => res.json())
                .then((json) => {
                    onSuccess(json.url);
                })
                .catch((error) => {
                    onError(error);
                });
        },
        []
    );

    const handleSave = useCallback((doc: string): void => {
        console.log("Saved!");
    }, []);

    return (
        <div className="App" style={{ padding: "10px" }}>
            <Editor
                value={doc}
                onChange={setDoc}
                onSave={handleSave}
                uploadFunction={handleUploadImage}
            />
        </div>
    );
}

export default App;

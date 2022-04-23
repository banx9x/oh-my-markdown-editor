import { useCallback, useState } from 'react';
import CMEditor from './Editor';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    other: '000',
    doc: ``,
  });

  const handleUploadImage = useCallback(
    (file: File, onSuccess: (url: string) => void): void => {
      const form = new FormData();
      form.append('upload', file);

      fetch('http://localhost:8087/api/upload-image', {
        method: 'POST',
        body: form,
      })
        .then((res) => res.json())
        .then((json) => {
          onSuccess(json.url);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    []
  );

  const handleSave = useCallback((doc: string): void => {
    console.log('Saved!', doc);
  }, []);

  return (
    <div
      className='App'
      style={{ padding: '10px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => {
            setIsLoading(true);

            setTimeout(() => {
              setState({ other: '123', doc: '# Hello World' });
              setIsLoading(false);
            }, 1000);
          }}>
          Hello World
        </button>
        <button
          onClick={() => {
            setIsLoading(true);

            setTimeout(() => {
              setState({ other: '456', doc: '# Goodbye World' });
              setIsLoading(false);
            }, 1000);
          }}>
          Goodbye World
        </button>
      </div>

      {!isLoading && (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor=''>Title</label>
            <input
              value={state.other}
              onChange={(e) => setState({ ...state, other: e.target.value })}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid #e3e3e3',
                padding: '6px',
              }}
            />
          </div>

          <div>
            <label htmlFor=''>Content</label>
            <CMEditor
              initialDoc={state.doc}
              onChange={(doc: string) => setState({ ...state, doc })}
              onSave={handleSave}
              uploadFunction={handleUploadImage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

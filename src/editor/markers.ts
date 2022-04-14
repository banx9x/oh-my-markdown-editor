import { EditorView as CMEditorView } from '@codemirror/basic-setup';
import { Text as CMText } from '@codemirror/text';
import { EditorSelection as CMEditorSelection } from '@codemirror/state';

const bold = (view: CMEditorView) => {
  view.dispatch(
    view.state.changeByRange((range) => {
      return {
        changes: [
          {
            from: range.from,
            insert: CMText.of(['**']),
          },
          {
            from: range.to,
            insert: CMText.of(['**']),
          },
        ],
        range: CMEditorSelection.range(range.from + 2, range.to + 2),
      };
    })
  );

  view.focus();
};

const italic = (view: CMEditorView) => {
  view.dispatch(
    view.state.changeByRange((range) => {
      return {
        changes: [
          {
            from: range.from,
            insert: CMText.of(['*']),
          },
          {
            from: range.to,
            insert: CMText.of(['*']),
          },
        ],
        range: CMEditorSelection.range(range.from + 1, range.to + 1),
      };
    })
  );

  view.focus();
};

const strikethrough = (view: CMEditorView) => {
  view.dispatch(
    view.state.changeByRange((range) => {
      return {
        changes: [
          {
            from: range.from,
            insert: CMText.of(['~~']),
          },
          {
            from: range.to,
            insert: CMText.of(['~~']),
          },
        ],
        range: CMEditorSelection.range(range.from + 2, range.to + 2),
      };
    })
  );

  view.focus();
};

const link = (view: CMEditorView, text?: string, url?: string) => {
  view.dispatch(
    view.state.changeByRange((range) => {
      const selectionText = view.state.sliceDoc(range.from, range.to);
      const anchor = text || selectionText;
      const link = `[${anchor}](${url ?? 'https://'})`;
      const backspace = url ? 0 : 1;

      return {
        changes: [
          {
            from: range.from,
            to: range.to,
            insert: CMText.of([link]),
          },
        ],
        range: CMEditorSelection.range(
          range.from + link.length - backspace,
          range.to + link.length - anchor.length - backspace
        ),
      };
    })
  );

  view.focus();
};

const image = (view: CMEditorView, alt?: string, url?: string) => {
  const img = `![${alt ?? 'text'}](${url ?? 'https://'})`;

  view.dispatch(
    view.state.changeByRange((range) => {
      return {
        changes: [
          {
            from: range.from,
            insert: CMText.of([img]),
          },
        ],
        range: CMEditorSelection.range(
          range.from + (url ? img.length : img.length - 1),
          range.to + (url ? img.length : img.length - 1)
        ),
      };
    })
  );

  view.focus();
};

const code = (view: CMEditorView) => {
  view.dispatch(
    view.state.changeByRange((range) => {
      return {
        changes: [
          {
            from: range.from,
            insert: CMText.of(['`']),
          },
          {
            from: range.to,
            insert: CMText.of(['`']),
          },
        ],
        range: CMEditorSelection.range(range.from + 1, range.to + 1),
      };
    })
  );

  view.focus();
};

const blockCode = (view: CMEditorView, text?: string) => {
  const currentLine = view.state.doc.lineAt(
    view.state.selection.main.head
  ).number;
  const line = view.state.doc.lineAt(view.state.selection.main.head);
  const lineText = view.state.doc.line(currentLine).text;
  const somethingSelected = view.state.selection.ranges.some((r) => !r.empty);
  const getSelections = () =>
    view.state.selection.ranges.map((r) => view.state.sliceDoc(r.from, r.to));
  const setCursor = (pos: number) =>
    view.dispatch({ selection: { anchor: pos } });

  if (lineText.length) {
    if (somethingSelected) {
      view.dispatch(
        view.state.changeByRange((range) => {
          return {
            changes: [
              {
                from: range.from,
                to: range.to,
                insert: CMText.of([
                  '```',
                  ...getSelections()[0].split('\n'),
                  '```',
                ]),
              },
            ],
            range: CMEditorSelection.range(range.from + 4, range.to + 4),
          };
        })
      );
      setCursor(line.from + 3);
    } else {
      view.dispatch(
        view.state.changeByRange((range) => {
          console.log(range);
          return {
            changes: [
              {
                from: range.from,
                insert: CMText.of(['', '```', '']),
              },
              {
                from: range.to,
                insert: CMText.of(['', '```']),
              },
            ],
            range: CMEditorSelection.range(range.from + 4, range.to + 4),
          };
        })
      );
    }
  } else {
    view.dispatch(
      view.state.changeByRange((range) => {
        return {
          changes: [
            {
              from: range.from,
              insert: CMText.of(['```', '', '```']),
            },
          ],
          range: CMEditorSelection.range(range.from + 3, range.to + 3),
        };
      })
    );
  }

  view.focus();
};

const bulletList = (view: CMEditorView, text?: string) => {
  const line = view.state.doc.lineAt(view.state.selection.main.head);
  const lineNumber = line.number;
  const lineText = view.state.doc.line(lineNumber).text;
  const somethingSelected = view.state.selection.ranges.some((r) => !r.empty);
  const listSelection = view.state.selection.ranges;
  const setCursor = (pos: number) =>
    view.dispatch({ selection: { anchor: pos } });
  const getSelections = () =>
    view.state.selection.ranges.map((r) => view.state.sliceDoc(r.from, r.to));
  const textList = getSelections()[0]
    .split('\n')
    .map((string: string) => `* ${string}`);

  if (lineText.length) {
    setCursor(line.from);
  }
  if (!somethingSelected) {
    view.dispatch(
      view.state.changeByRange((range) => {
        return {
          changes: [
            {
              from: range.from,
              to: range.to,
              insert: CMText.of(['* ']),
            },
          ],
          range: CMEditorSelection.range(range.from + 2, range.to + 2),
        };
      })
    );
    setCursor(line.to + 2);
  } else {
    view.dispatch(
      view.state.changeByRange((range) => {
        const selectionText = view.state.sliceDoc(range.from, range.to);
        console.log(selectionText);

        return {
          changes: [
            {
              from: listSelection[0].from,
              to: listSelection[0].to,
            },
            {
              from: range.from,
              insert: CMText.of([...textList]),
            },
          ],
          range: CMEditorSelection.range(range.from, range.to),
        };
      })
    );
  }

  view.focus();
};

const numberList = (view: CMEditorView) => {
  const line = view.state.doc.lineAt(view.state.selection.main.head);
  const lineNumber = line.number;
  const lineText = view.state.doc.line(lineNumber).text;
  const somethingSelected = view.state.selection.ranges.some((r) => !r.empty);
  const listSelection = view.state.selection.ranges;
  const setCursor = (pos: number) =>
    view.dispatch({ selection: { anchor: pos } });
  const getSelections = () =>
    view.state.selection.ranges.map((r) => view.state.sliceDoc(r.from, r.to));
  const textList = getSelections()[0]
    .split('\n')
    .map((string: string, index) => `${index + 1}. ${string}`);

  if (lineText.length) {
    // Nếu con trỏ chuột ở trên dòng có chữ , lúc bấm nút sẽ đặt lại vị trí con trỏ ở đầu dong
    setCursor(line.from);
  }
  view.dispatch(
    view.state.changeByRange((range) => {
      if (!somethingSelected) {
        return {
          changes: [
            {
              from: range.from,
              insert: CMText.of(['1. ']),
            },
          ],
          range: CMEditorSelection.range(range.from, range.to),
        };
      } else {
        return {
          changes: [
            {
              from: listSelection[0].from,
              to: listSelection[0].to,
            },
            {
              from: range.from,
              insert: CMText.of([...textList]),
            },
          ],
          range: CMEditorSelection.range(range.from, range.to),
        };
      }
    })
  );
  // sau khi đã thực hiện thay đổi đặt lại con trỏ chuột ở cuối dong
  setCursor(line.to + 3);

  view.focus();
};

export {
  bold,
  italic,
  strikethrough,
  link,
  image,
  code,
  blockCode,
  bulletList,
  numberList,
};

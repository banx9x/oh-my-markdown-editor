import { EditorView } from '@codemirror/basic-setup';
import { keymap } from '@codemirror/view';
import { bold, italic } from './markers';

const boldCommand = (view: EditorView): boolean => {
  bold(view);
  return false;
};

const italicCommand = (view: EditorView): boolean => {
  italic(view);
  return true;
};

const saveCommand = (/* view: EditorView */): boolean => {
  console.log('Saved');
  return true;
};

const commands = keymap.of([
  {
    mac: 'cmd-b',
    win: 'ctrl-b',
    run: boldCommand,
  },
  {
    mac: 'cmd-i',
    win: 'ctrl-i',
    run: italicCommand,
  },
  {
    mac: 'cmd-s',
    win: 'ctrl-s',
    run: saveCommand,
  },
]);

export { commands };

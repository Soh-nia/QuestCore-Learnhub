'use client';

import dynamic from 'next/dynamic';
import { marked } from 'marked';
import TurndownService from 'turndown';
import 'easymde/dist/easymde.min.css';
import Spinner from './Spinner';

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
  loading: () => (
    <div className="bg-white dark:bg-neutral-800 p-4 flex items-center justify-center">
      <Spinner />
    </div>
  ),
});

const Editor = ({ onChange, value }: EditorProps) => {
  return (
    <div className="draft-editor rounded-md">
      <SimpleMDE
        value={new TurndownService().turndown(value || '')}
        onChange={(markdown) => onChange(marked(markdown))}
        className="text-gray-800 dark:text-neutral-200"
      />
    </div>
  );
};

export default Editor;
/**
 * Rich Text Editor Component
 * 
 * What: TipTap-based rich text editor for lesson content
 * Why: Provides WYSIWYG editing for HTML lesson content
 */

'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Undo,
  Redo,
} from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start typing your lesson content...',
  className = '',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-accent underline',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px] p-4 text-brand-black',
      },
    },
  });

  // Inject styles for ProseMirror editor content
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .ProseMirror {
        color: #000000 !important;
        outline: none;
      }
      .ProseMirror p {
        color: #000000 !important;
        margin: 0.5em 0;
      }
      .ProseMirror h1,
      .ProseMirror h2,
      .ProseMirror h3,
      .ProseMirror h4,
      .ProseMirror h5,
      .ProseMirror h6 {
        color: #000000 !important;
        font-weight: bold;
      }
      .ProseMirror ul,
      .ProseMirror ol {
        color: #000000 !important;
      }
      .ProseMirror li {
        color: #000000 !important;
      }
      .ProseMirror blockquote {
        color: #000000 !important;
        border-left: 3px solid #374151;
        padding-left: 1em;
        margin: 1em 0;
      }
      .ProseMirror a {
        color: ${process.env.NEXT_PUBLIC_THEME_COLOR || '#FAB908'} !important;
        text-decoration: underline;
      }
      .ProseMirror p.is-editor-empty:first-child::before {
        color: #9CA3AF !important;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!editor) {
    return null;
  }

  return (
    <div className={`border-2 border-brand-darkGrey rounded-lg bg-brand-white ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-brand-darkGrey/20 bg-brand-darkGrey/5 rounded-t-lg">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-brand-darkGrey/20 transition-colors ${
            editor.isActive('bold') ? 'bg-brand-accent/20' : ''
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4 text-brand-black" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-brand-darkGrey/20 transition-colors ${
            editor.isActive('italic') ? 'bg-brand-accent/20' : ''
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4 text-brand-black" />
        </button>
        <div className="w-px h-6 bg-brand-darkGrey/30 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-brand-darkGrey/20 transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-brand-accent/20' : ''
          }`}
          title="Heading 1"
        >
          <span className="text-sm font-bold text-brand-black">H1</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-brand-darkGrey/20 transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-brand-accent/20' : ''
          }`}
          title="Heading 2"
        >
          <span className="text-sm font-bold text-brand-black">H2</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-brand-darkGrey/20 transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-brand-accent/20' : ''
          }`}
          title="Heading 3"
        >
          <span className="text-sm font-bold text-brand-black">H3</span>
        </button>
        <div className="w-px h-6 bg-brand-darkGrey/30 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-brand-darkGrey/20 transition-colors ${
            editor.isActive('bulletList') ? 'bg-brand-accent/20' : ''
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4 text-brand-black" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-brand-darkGrey/20 transition-colors ${
            editor.isActive('orderedList') ? 'bg-brand-accent/20' : ''
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4 text-brand-black" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-brand-darkGrey/20 transition-colors ${
            editor.isActive('blockquote') ? 'bg-brand-accent/20' : ''
          }`}
          title="Quote"
        >
          <Quote className="w-4 h-4 text-brand-black" />
        </button>
        <div className="w-px h-6 bg-brand-darkGrey/30 mx-1" />
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Enter URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`p-2 rounded hover:bg-brand-darkGrey/20 transition-colors ${
            editor.isActive('link') ? 'bg-brand-accent/20' : ''
          }`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4 text-brand-black" />
        </button>
        <div className="w-px h-6 bg-brand-darkGrey/30 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded hover:bg-brand-darkGrey/20 transition-colors disabled:opacity-50"
          title="Undo"
        >
          <Undo className="w-4 h-4 text-brand-black" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded hover:bg-brand-darkGrey/20 transition-colors disabled:opacity-50"
          title="Redo"
        >
          <Redo className="w-4 h-4 text-brand-black" />
        </button>
      </div>

      {/* Editor Content */}
      <div className="min-h-[300px] max-h-[500px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

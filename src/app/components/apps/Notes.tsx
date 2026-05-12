'use client';
import React from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

const STORAGE_KEY = 'notes-content';

const Notes = () => {
  const savedContent = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;

  const editor = useCreateBlockNote({
    initialContent: savedContent ? JSON.parse(savedContent) : undefined,
  });

  return (
    <div className="min-h-screen">
      <div className="pt-16 px-4">
        <BlockNoteView
          editor={editor}
          onChange={() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(editor.document));
          }}
        />
      </div>
    </div>
  );
};

export default Notes; 
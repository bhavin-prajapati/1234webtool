'use client';
import React from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

const Notes = () => {
  const editor = useCreateBlockNote();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-16 px-4">
        <BlockNoteView editor={editor} />
      </div>
    </div>
  );
};

export default Notes; 
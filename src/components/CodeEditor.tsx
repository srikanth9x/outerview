"use client";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  language?: string;
  code: string;
  onChange: (value: string | undefined) => void;
}

export default function CodeEditor({ language = "javascript", code, onChange }: CodeEditorProps) {
  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-700 shadow-lg">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={code}
        onChange={onChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}

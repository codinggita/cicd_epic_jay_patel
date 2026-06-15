'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({ code, language = 'yaml', showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      addToast('Code copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addToast('Failed to copy code', 'error');
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#0d1117] text-slate-100 font-mono text-xs sm:text-sm shadow-inner group">
      
      {/* Top Header Panel */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#161b22]">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded text-slate-450 hover:text-white hover:bg-slate-800 transition-colors pointer-events-auto cursor-pointer"
          title="Copy Code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Code Container */}
      <div className="overflow-x-auto p-4 flex items-start gap-4 max-h-[480px]">
        
        {/* Line Numbers Column */}
        {showLineNumbers && (
          <div className="flex flex-col text-slate-600 select-none text-right min-w-[20px] font-mono border-r border-slate-800/60 pr-3">
            {lines.map((_, i) => (
              <span key={i} className="block leading-6 h-6">{i + 1}</span>
            ))}
          </div>
        )}

        {/* Raw Code Content */}
        <pre className="flex-1 font-mono leading-6 overflow-x-auto select-text whitespace-pre text-left w-full h-full">
          <code>
            {lines.map((line, index) => {
              // A very simple regex-based syntax highlight for YAML keywords
              const isComment = line.trim().startsWith('#');
              const isKey = line.includes(':') && !line.trim().startsWith('-') && !line.includes('://');
              
              let styledLine = line;
              if (isComment) {
                styledLine = `<span class="text-slate-500">${line}</span>`;
              } else if (isKey) {
                const parts = line.split(/:(.+)/);
                styledLine = `<span class="text-indigo-400 font-medium">${parts[0]}:</span><span class="text-emerald-300">${parts[1] || ''}</span>`;
              } else {
                styledLine = `<span class="text-slate-200">${line}</span>`;
              }

              return (
                <span
                  key={index}
                  className="block h-6 leading-6"
                  dangerouslySetInnerHTML={{ __html: styledLine }}
                />
              );
            })}
          </code>
        </pre>

      </div>
    </div>
  );
}

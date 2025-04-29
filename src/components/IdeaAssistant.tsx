import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

export const IdeaAssistant = () => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed right-0 top-0 h-full w-[400px] bg-[#0c0c0c] flex flex-col justify-end z-30 border-l border-[#1a1a1a] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/greenglow.png" 
          alt="" 
          className="w-full h-full object-cover opacity-100"
        />
      </div>
      <div className="w-full p-6 mt-auto relative z-10">
        <div className={cn(
          "bg-[#0c0c0c] rounded-xl relative flex flex-col border transition-all duration-200",
          isFocused ? "border-[#4ade80] shadow-[0_0_15px_rgba(74,222,128,0.1)]" : "border-[#1a1a1a]"
        )}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="What's your big idea?"
            className="w-full px-5 py-4 bg-transparent text-[#e4e4e7] placeholder-[#404040] focus:outline-none text-[15px] transition-colors duration-200"
          />
          <div className="flex gap-3 px-5 pb-4 justify-start">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-lg w-8 h-8 p-0 hover:bg-[#1a1a1a] hover:text-[#4ade80] text-[#666666] transition-all duration-200"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-lg w-8 h-8 p-0 hover:bg-[#1a1a1a] hover:text-[#4ade80] text-[#666666] transition-all duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v18M3 12h18" />
              </svg>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-lg w-8 h-8 p-0 hover:bg-[#1a1a1a] hover:text-[#4ade80] text-[#666666] transition-all duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              accept="*"
              className="hidden"
            />
          </div>
          {input && (
            <Button 
              className="absolute bottom-3 right-4 bg-[#4ade80] hover:bg-[#4ade80]/90 text-black font-medium rounded-lg h-9 px-4 shadow-sm transition-all duration-200" 
              onClick={() => setInput('')}
            >
              Generate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}; 
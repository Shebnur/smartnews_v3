"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' }
];

const LanguageSelector: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    // Here you can add logic to change the entire UI language
    console.log(`Language changed to: ${language.name}`);
  };

  return (
    <div className="relative">
      {/* Language Button - Compact with only flag */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 backdrop-blur-xl border border-indigo-400/30 rounded-lg text-white transition-all"
      >
        <span className="text-xl">{selectedLanguage.flag}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-44 bg-slate-800/98 backdrop-blur-xl border border-indigo-400/30 rounded-lg shadow-2xl overflow-hidden z-20">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${
                  selectedLanguage.code === language.code
                    ? 'bg-indigo-500/30 text-white border-l-2 border-indigo-400'
                    : 'text-gray-300 hover:bg-indigo-500/10 hover:text-white'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm font-medium">{language.name}</span>
                {selectedLanguage.code === language.code && (
                  <span className="ml-auto text-indigo-400 text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
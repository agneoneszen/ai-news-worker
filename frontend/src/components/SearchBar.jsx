import React, { useState } from 'react';
import { Search } from 'lucide-react';

/**
 * 搜索欄組件
 */
export default function SearchBar({ onSearch, placeholder = "搜尋報告內容..." }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <div className="
          absolute 
          inset-y-0 
          left-0 
          pl-3 
          flex items-center 
          pointer-events-none
        ">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (onSearch) {
              onSearch(e.target.value);
            }
          }}
          placeholder={placeholder}
          className="
            w-full 
            pl-10 pr-4 py-2.5 
            bg-white 
            border border-slate-200 
            rounded-lg 
            text-sm
            text-slate-700 
            placeholder-slate-400 
            focus:outline-none 
            focus:ring-2 focus:ring-blue-500 
            focus:border-transparent
            transition-all duration-200
          "
          aria-label="搜索報告內容"
        />
      </div>
    </form>
  );
}


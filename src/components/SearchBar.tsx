import { Search } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
  value: string
  onChange: (val: string) => void
  onSearch?: () => void
}

export default function SearchBar({ placeholder = 'Search...', value, onChange, onSearch }: SearchBarProps) {
  return (
    <div className="relative max-w-2xl w-full mx-auto group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch && onSearch()}
        className="block w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/10 transition-all text-lg shadow-xl"
        placeholder={placeholder}
      />
      {onSearch && (
        <button 
          onClick={onSearch}
          className="absolute inset-y-2 right-2 px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-colors"
        >
          Search
        </button>
      )}
    </div>
  )
}

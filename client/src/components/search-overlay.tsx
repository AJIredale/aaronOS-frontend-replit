import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, X, MessageSquare } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  content: string;
  date: string;
  relativeDate: string;
}

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "Database connection troubleshooting",
    content: "Setting up PostgreSQL database connections and resolving authentication issues...",
    date: "2025-01-06",
    relativeDate: "Today"
  },
  {
    id: "2", 
    title: "Database migration steps",
    content: "Creating and running database migrations with Drizzle ORM for schema updates...",
    date: "2025-01-06",
    relativeDate: "Today"
  },
  {
    id: "3",
    title: "Chat persistence design",
    content: "Implementing persistent chat storage with encrypted database fields for user data...",
    date: "2025-01-06",
    relativeDate: "Today"
  },
  {
    id: "4",
    title: "AaronOS chat persistence fix",
    content: "Fixing database provisioning issues with Vercel deployment and PostgreSQL setup...",
    date: "2025-01-06", 
    relativeDate: "Today"
  },
  {
    id: "5",
    title: "Check document authenticity",
    content: "Verifying document signatures and implementing authentication workflows...",
    date: "2025-01-05",
    relativeDate: "Yesterday"
  }
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredResults(mockSearchResults);
      return;
    }

    const filtered = mockSearchResults.filter(result =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [searchQuery]);

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="text-blue-600 font-medium">
          {part}
        </span>
      ) : part
    );
  };

  const groupedResults = filteredResults.reduce((groups, result) => {
    const date = result.relativeDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(result);
    return groups;
  }, {} as Record<string, SearchResult[]>);

  const handleResultClick = (result: SearchResult) => {
    // TODO: Navigate to the specific chat
    console.log('Selected chat:', result.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl min-h-[400px] max-h-[600px] h-[500px] p-0 bg-white border border-gray-200 shadow-xl sm:min-h-[500px] sm:h-[580px]" hideCloseButton>
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <Search size={20} className="text-gray-400" />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="flex-1 border-0 bg-transparent text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* New Chat Option */}
        {searchQuery && (
          <div className="p-4 border-b border-gray-100">
            <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <MessageSquare size={18} className="text-gray-500" />
              <span className="text-sm text-gray-700">New chat</span>
            </button>
          </div>
        )}

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {Object.entries(groupedResults).map(([dateGroup, results]) => (
            <div key={dateGroup} className="p-4">
              <div className="mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {dateGroup}
                </span>
              </div>
              
              <div className="space-y-2">
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MessageSquare size={16} className="text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {highlightText(result.title, searchQuery)}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-2">
                          {highlightText(result.content, searchQuery)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filteredResults.length === 0 && searchQuery && (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <div className="text-center">
                <div className="text-gray-400 mb-2">
                  <Search size={24} className="mx-auto" />
                </div>
                <div className="text-sm text-gray-500">
                  No results for "{searchQuery}"
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
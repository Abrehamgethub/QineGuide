import { useState, useEffect } from 'react';
import { tutorApi, ChatHistorySummary } from '../api';
import { 
  History, 
  MessageCircle, 
  Plus, 
  ChevronLeft,
  Loader2,
} from 'lucide-react';

interface ChatHistorySidebarProps {
  currentHistoryId?: string;
  onSelectHistory: (historyId: string, messages: Array<{id: string; role: 'user' | 'assistant'; content: string; timestamp: string}>) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ChatHistorySidebar = ({ 
  currentHistoryId, 
  onSelectHistory, 
  onNewChat,
  isOpen,
  onToggle 
}: ChatHistorySidebarProps) => {
  const [histories, setHistories] = useState<ChatHistorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState<string | null>(null);

  useEffect(() => {
    loadHistories();
  }, []);

  const loadHistories = async () => {
    try {
      setLoading(true);
      const response = await tutorApi.getAllHistories();
      if (response.success && response.data) {
        setHistories(response.data);
      }
    } catch (err) {
      console.error('Failed to load chat histories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = async (historyId: string) => {
    try {
      setLoadingHistory(historyId);
      console.log('Loading history:', historyId);
      const response = await tutorApi.getHistory(historyId);
      console.log('History response:', response);
      
      if (response.success && response.data) {
        const messages = response.data.map((msg, index) => {
          // Handle Firestore timestamp format
          let timestamp = msg.timestamp;
          if (typeof timestamp === 'object' && timestamp !== null) {
            const ts = timestamp as { _seconds?: number; seconds?: number };
            const seconds = ts._seconds || ts.seconds;
            if (seconds) {
              timestamp = new Date(seconds * 1000).toISOString();
            } else {
              timestamp = new Date().toISOString();
            }
          }
          
          return {
            id: msg.id || `msg-${index}`,
            role: msg.role,
            content: msg.content,
            timestamp: timestamp as string
          };
        });
        console.log('Parsed messages:', messages.length);
        onSelectHistory(historyId, messages);
      } else {
        console.error('Failed to get history data:', response);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setLoadingHistory(null);
    }
  };

  const formatDate = (dateString: string | { _seconds?: number; seconds?: number } | undefined | null) => {
    if (!dateString) return 'Just now';
    
    let date: Date;
    
    // Handle Firestore Timestamp objects
    if (typeof dateString === 'object') {
      const seconds = dateString._seconds || dateString.seconds;
      if (seconds) {
        date = new Date(seconds * 1000);
      } else {
        return 'Just now';
      }
    } else {
      date = new Date(dateString);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Just now';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Collapsed state - just show toggle button
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed left-4 top-24 z-30 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors md:hidden"
      >
        <History className="h-5 w-5 text-gray-600" />
      </button>
    );
  }

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">Chat History</h3>
        </div>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-gray-100 rounded md:hidden"
        >
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 text-primary-600 animate-spin" />
          </div>
        ) : histories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No chat history yet</p>
            <p className="text-xs mt-1">Start a conversation!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {histories.map((history) => (
              <button
                key={history.historyId}
                onClick={() => handleSelectHistory(history.historyId)}
                disabled={loadingHistory === history.historyId}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  currentHistoryId === history.historyId
                    ? 'bg-primary-50 border border-primary-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {history.title || 'Untitled Chat'}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {truncateText(history.lastMessage || '', 40)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(history.updatedAt as unknown as string)}
                    </p>
                  </div>
                  {loadingHistory === history.historyId && (
                    <Loader2 className="h-4 w-4 text-primary-600 animate-spin flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistorySidebar;

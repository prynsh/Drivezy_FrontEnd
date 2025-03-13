import  { useState } from 'react';
import { Search, Upload, LogOut } from 'lucide-react';
import axios from 'axios';

interface SearchResult {
  id: string;
  title: string;
  link: string;
  score: number;
}

function Dashboard() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleProcessFiles = async () => {
    try {
      setIsProcessing(true);
      await axios.post('http://localhost:5000/ingest', {}, { withCredentials: true });
      alert('Files processed successfully!');
    } catch (error) {
      console.error('Error processing files:', error);
      alert('Error processing files. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const response = await axios.post('http://localhost:5000/search', 
        { query: searchQuery },
        { withCredentials: true }
      );
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Error searching:', error);
      alert('Error performing search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    window.location.href = 'http://localhost:5000/logout';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Document Search</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Process Files Section */}
        <div className="mb-8">
          <button
            onClick={handleProcessFiles}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Upload size={20} />
            {isProcessing ? 'Processing...' : 'Fetch and Process Files'}
          </button>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-4 mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your documents..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Search size={20} />
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Results</h2>
              {searchResults.map((result) => (
                <div key={result.id} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{result.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Relevance: {Math.round(result.score * 100)}%
                    </span>
                    <a
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      View Document →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchResults.length === 0 && searchQuery && !isSearching && (
            <p className="text-center text-gray-600">No results found</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
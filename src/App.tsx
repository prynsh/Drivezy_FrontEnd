import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [message, setMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [results, setResults] = useState<{ title: string; link: string }[]>([]);

  const handleIngest = async () => {
    setMessage("Ingesting files...");
    try {
      const response = await fetch("http://localhost:5000/ingest", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      setMessage(data.message || "Ingestion completed");
    } catch (error) {
      console.error("Error in ingestion:", error);
      setMessage("Failed to ingest files.");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setMessage("Please enter a search query.");
      return;
    }
    setMessage("Searching...");
    setResults([]); // Clear previous results
    try {
      const response = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setResults(data.results);
        setMessage(null);
      } else {
        setMessage("No relevant files found.");
      }
    } catch (error) {
      console.error("Error in search:", error);
      setMessage("Failed to search.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 w-full">
      <div className="flex space-x-4">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="h-16" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="h-16" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold mt-6">Vite + React</h1>
      <div className="bg-white p-6 rounded-xl shadow-md mt-6 w-full max-w-md text-center">
        <button onClick={handleIngest} className="w-full mb-4 bg-blue-500 text-white py-2 px-4 rounded-md">🔄 Ingest Files</button>

        <div className="flex space-x-2 mt-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter search query"
            className="flex-grow border p-2 rounded-md"
          />
          <button onClick={handleSearch} className="bg-blue-500 text-white py-2 px-4 rounded-md">🔎 Search</button>
        </div>

        {results.length > 0 && (
          <div className="mt-4 text-left">
            <h3 className="text-lg font-semibold mb-2">Search Results:</h3>
            <ul className="bg-gray-200 p-3 rounded-md">
              {results.map((result, index) => (
                <li key={index} className="mb-2">
                  <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {result.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {message && (
          <pre className="mt-4 text-sm bg-gray-200 p-3 rounded-md text-left overflow-auto">
            {message}
          </pre>
        )}
      </div>
      <p className="mt-6 text-gray-600">Click on the Vite and React logos to learn more</p>
    </div>
  );
}

export default App;

import { LogOut } from "lucide-react";
import {  useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [message, setMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [results, setResults] = useState<{ title: string; link: string }[]>([]);
  const navigate = useNavigate();

//   useEffect(() => {
//     fetch("http://localhost:5000/profile", { credentials: "include" })
//       .then((res) => res.text())
//       .then((data) => setUser(data))
//       .catch(() => navigate("/"));
//   }, [navigate]);

  const handleLogout = () => {
    fetch("http://localhost:5000/logout", { credentials: "include" }).then(() =>
      navigate("/signin")
    );
  };

  const handleIngest = async () => {
    setMessage("Ingesting files...");
    try {
      const response = await fetch("http://localhost:5000/ingest", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      setMessage(data.message || "Ingestion completed");
    } catch {
      setMessage("Failed to ingest files.");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setMessage("Please enter a search query.");
      return;
    }
    setMessage("Searching...");
    setResults([]);
    try {
      const response = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      setResults(data.results || []);
      setMessage(data.results?.length ? null : "No relevant files found.");
    } catch {
      setMessage("Failed to search.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="w-full bg-white shadow-md py-4 px-6 flex items-center justify-between fixed top-0 left-0 right-0">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-600 transition flex "
        >
          <LogOut className="mx-2 h-6 w-5" />Logout
        </button>
      </nav>
      <div className="flex flex-col items-center justify-center flex-grow px-6 mt-16">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">Welcome!</h2>

          <button
            onClick={handleIngest}
            className="w-full mb-4 bg-slate-500 text-white py-2 px-4 rounded-md hover:bg-black transition"
          >
            Ingest Files
          </button>

          <div className="flex space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter search query"
              className="flex-grow border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-black transition"
            >
              Search
            </button>
          </div>

          {results.length > 0 && (
            <div className="mt-4 text-left">
              <h3 className="text-lg font-semibold mb-2">Search Results:</h3>
              <ul className="bg-gray-200 p-3 rounded-md">
                {results.map((result, index) => (
                  <li key={index} className="mb-2">
                    <a
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black hover:underline"
                    >
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
      </div>
    </div>
  );
}

export default Dashboard;

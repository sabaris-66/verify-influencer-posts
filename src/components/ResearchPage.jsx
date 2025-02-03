// frontend/ResearchPage.jsx
import { useState } from "react";
import "./ResearchPage.css";

function ResearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState({
    influencer: "",
    topic: "",
    dateRange: "lastMonth",
    claimsToAnalyze: 10,
    journals: [],
  });

  const handleSearch = async () => {
    if (!query.influencer && !query.topic) {
      alert("Please enter an influencer name or topic.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://verify-influencers-api-production.up.railway.app/api/research",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(query),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch research results");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Error fetching research results:", err);
      setError("Failed to fetch research results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="research-page">
      <div className="research-header">
        <h1>Research</h1>
      </div>
      <form className="search-form">
        <input
          type="text"
          placeholder="Influencer Name"
          value={query.influencer}
          onChange={(e) => setQuery({ ...query, influencer: e.target.value })}
        />
        <input
          type="text"
          placeholder="Topic"
          value={query.topic}
          onChange={(e) => setQuery({ ...query, topic: e.target.value })}
        />
        <select
          value={query.dateRange}
          onChange={(e) => setQuery({ ...query, dateRange: e.target.value })}
        >
          <option value="lastWeek">Last Week</option>
          <option value="lastMonth">Last Month</option>
          <option value="lastYear">Last Year</option>
          <option value="allTime">All Time</option>
        </select>
        <input
          type="number"
          placeholder="Number of Claims"
          value={query.claimsToAnalyze}
          onChange={(e) =>
            setQuery({
              ...query,
              claimsToAnalyze: parseInt(e.target.value) || 10,
            })
          }
        />
        <fieldset>
          <legend>Select Journals:</legend>
          {[
            "PubMed Central",
            "Science",
            "The Lancet",
            "JAMA Network",
            "Nature",
            "Cell",
            "New England Journal of Medicine",
          ].map((journal) => (
            <label key={journal}>
              <input
                type="checkbox"
                value={journal}
                checked={query.journals.includes(journal)}
                onChange={(e) => {
                  setQuery((prev) => ({
                    ...prev,
                    journals: e.target.checked
                      ? [...prev.journals, journal]
                      : prev.journals.filter((j) => j !== journal),
                  }));
                }}
              />
              {journal}
            </label>
          ))}
        </fieldset>
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div className="results-list">
        {results.map((result, index) => (
          <div
            key={index}
            style={{ marginBottom: "20px", borderBottom: "1px solid #ccc" }}
          >
            <h3>Claim: {result.content}</h3>
            <p>Status: {result.status}</p>
            <p>Trust Score: {result.trustScore}%</p>
            <h4>Scientific Verification:</h4>
            <p>{result.scientificClaim.content}</p>
            <p>Source: {result.scientificClaim.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResearchPage;

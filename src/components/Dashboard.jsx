// frontend/src/components/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const [filterCategory, setFilterCategory] = useState("");

  const filteredInfluencers = filterCategory
    ? influencers.filter((influencer) => influencer.category === filterCategory)
    : influencers;

  async function fetchInfluencers() {
    try {
      const response = await fetch(
        "https://verify-influencers-api-production.up.railway.app/api/influencers/db"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setInfluencers(data);
    } catch (err) {
      console.error("Error fetching influencers:", err);
      setError("Failed to fetch influencer data");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading influencer data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="header">
        <h1>HealthVerify</h1>
        <p>
          Welcome to HealthVerify! We help you navigate the world of online
          health advice by verifying claims made by influencers using credible
          scientific research. Our leaderboard ranks influencers based on their
          trust scores, so you can easily find evidence-based guidance.
        </p>
        <Link to="/research">
          <button>Research / Search</button>
        </Link>
      </div>
      <div className="controls">
        <button
          onClick={async () => {
            try {
              setLoading(true);
              const response = await fetch(
                "https://verify-influencers-api-production.up.railway.app/api/influencers"
              );
              if (!response.ok) {
                throw new Error("Failed to refresh data");
              }
              await fetchInfluencers(); // Fetch the updated data from the database
            } catch (err) {
              console.error("Error refreshing data:", err);
              setError("Failed to refresh data");
            } finally {
              setLoading(false);
            }
          }}
        >
          Refresh Data
        </button>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Nutrition">Nutrition</option>
          <option value="Fitness">Fitness</option>
          <option value="Mental Health">Mental Health</option>
          <option value="Medical">Medical</option>
        </select>
      </div>
      <h2>Influencer Trust Leaderboard</h2>
      <table className="leaderboard">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Influencer</th>
            <th>Category</th>
            <th>Trust Score</th>
            <th>Followers</th>
            <th>Verified Claims</th>
          </tr>
        </thead>
        <tbody>
          {filteredInfluencers.map((influencer, index) => (
            <tr key={influencer.id}>
              <td>{index + 1}</td>
              <td>
                <Link to={`/influencer/${influencer.id}`}>
                  {influencer.name}
                </Link>
              </td>
              <td>{influencer.category}</td>
              <td>{influencer.trustScore}%</td>
              <td>{influencer.followersCount}</td>
              <td>{influencer.verifiedClaims}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;

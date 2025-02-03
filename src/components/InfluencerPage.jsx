import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./InfluencerPage.css";

function InfluencerPage() {
  const [influencer, setInfluencer] = useState(null); // Initialize as null
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Use `id` instead of `infName`

  useEffect(() => {
    const fetchInfluencer = async () => {
      try {
        const response = await fetch(
          `https://verify-influencers-api-production.up.railway.app/api/influencers/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(`${data.name}, ${data.posts[0]}`);
        setInfluencer(data);
      } catch (err) {
        console.error("Error fetching influencer details:", err);
        setError("Failed to fetch influencer data");
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencer();
  }, [id]);

  let popularClaims = [];
  // let otherPosts = [];

  const handleSearch = async (query) => {
    if (!query) return;
    setSearchLoading(true);
    try {
      const response = await fetch(
        "https://verify-influencers-api-production.up.railway.app/api/search-claims",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ influencerId: id, topic: query }),
        }
      );
      const data = await response.json();
      setSearchResults(data.claims);

      // Refetch influencer data to update the posts list
      // const influencerResponse = await fetch(
      //   `http://ocalhost:3000/api/influencers/${id}`
      // );
      // if (!influencerResponse.ok) {
      //   throw new Error("Network response was not ok");
      // }
      // const influencerData = await influencerResponse.json();
      // setInfluencer(influencerData);
    } catch (err) {
      console.error("Error searching claims:", err);
      setError("Failed to search claims");
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading) {
    return <div>Loading influencer data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!influencer) {
    return <div>Influencer not found</div>;
  }

  // Ensure `influencer.posts` is defined before using `slice`

  const posts = influencer.posts || [];
  popularClaims = [...posts.slice(0, 5)];
  // otherPosts = [...posts.slice(5)];

  return (
    <div className="influencer-page">
      <div className="influencer-header">
        <h1>{influencer.name}</h1>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search claims by topic..."
          id="searchInput"
        />
        <button
          onClick={() =>
            handleSearch(document.getElementById("searchInput").value)
          }
          disabled={searchLoading}
        >
          {searchLoading ? "Searching..." : "Search"}
        </button>
      </div>
      {searchResults.length > 0 && (
        <div className="claims-list">
          <h2>Search Results</h2>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>
                <p>{result.content}</p>
                <p>Status: {result.status}</p>
                <p>Trust Score: {result.trustScore}%</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="claims-list">
        <h2>Popular Claims</h2>
        <ul>
          {popularClaims.map((claim, index) => (
            <li key={index}>
              <p>{claim.content}</p>
              <p>Status: {claim.status}</p>
              <p>Trust Score: {claim.trustScore}%</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default InfluencerPage;

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// function InfluencerPage() {
//   const [influencer, setInfluencer] = useState(); // Initialize with default claims array
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { infName } = useParams();

//   useEffect(() => {
//     const fetchInfluencer = async () => {
//       try {
//         const response = await fetch(
//           `http://ocalhost:3000/api/influencers/:${infName}`
//         );
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         setInfluencer(data);
//       } catch (err) {
//         console.error("Error fetching influencers:", err);
//         setError("Failed to fetch influencer data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInfluencer();
//   }, [infName]);

//   const handleSearch = (query) => {
//     const results = influencer.claims.filter((claim) =>
//       claim.content.includes(query)
//     );
//     setSearchResults(results);
//   };

//   if (loading) {
//     return <div>Loading influencer data...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       <h1>{infName}</h1>
//       <input
//         type="text"
//         placeholder="Search claims..."
//         onChange={(e) => handleSearch(e.target.value)}
//       />
//       {searchResults.length > 0 && (
//         <div>
//           <h2>Search Results</h2>
//           <ul>
//             {searchResults.map((result, index) => (
//               <li key={index}>
//                 <p>{result.content}</p>
//                 <p>Status: {result.status}</p>
//                 <p>Trust Score: {result.trustScore}%</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//       <h2>All Claims</h2>
//       <ul>
//         {influencer &&
//           influencer.map((claim, index) => (
//             <li key={index}>
//               <p>{claim.content}</p>
//               <p>Status: {claim.status}</p>
//               <p>Trust Score: {claim.trustScore}%</p>
//             </li>
//           ))}
//       </ul>
//     </div>
//   );
// }

// export default InfluencerPage;

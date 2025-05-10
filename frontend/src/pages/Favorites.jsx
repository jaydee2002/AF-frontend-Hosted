import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CountryCard from "../components/CountryCard";
import SkeletonCard from "../components/SkeletonCard";
import { useAuth } from "../contexts/AuthContext";
import { getCountryByCode } from "../services/api";

function Favorites() {
  const { user, authLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (authLoading) return; // Wait for auth to complete
      if (!user) {
        setError("Please log in to view favorites");
        setLoading(false);
        return;
      }
      try {
        const favoriteCodes = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        );
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Optional delay
        const favoriteCountries = await Promise.all(
          favoriteCodes.map(async (code) => await getCountryByCode(code))
        );
        setFavorites(favoriteCountries);
        setLoading(false);
      } catch (err) {
        setError("Failed to load favorites");
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user, authLoading]);

  const handleSearch = (query) => {
    console.log("Search:", query);
  };

  const handleFilter = (region) => {
    console.log("Filter:", region);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header onSearch={handleSearch} onFilter={handleFilter} />
      <main
        className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 flex-grow"
        aria-busy={loading}
      >
        {/* Responsive Heading */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mb-4 sm:mb-6">
          Favorites
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {[...Array(window.innerWidth < 640 ? 4 : 8)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <p className="text-center text-red-500 text-sm sm:text-base py-6 sm:py-8">
            {error}
          </p>
        )}

        {/* Not Logged In State */}
        {!user && !loading && (
          <p className="text-center text-gray-600 text-sm sm:text-base py-6 sm:py-8">
            Please log in to view your favorite countries.
          </p>
        )}

        {/* Empty Favorites State */}
        {user && !loading && !error && favorites.length === 0 && (
          <p className="text-center text-gray-600 text-sm sm:text-base py-6 sm:py-8">
            No favorite countries added yet.
          </p>
        )}

        {/* Favorites Grid */}
        {user && !loading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {favorites.map((country) => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Favorites;

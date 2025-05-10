import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CountryCard from "../components/CountryCard";
import SkeletonCard from "../components/SkeletonCard";
import {
  getAllCountries,
  searchCountriesByName,
  getCountriesByRegion,
} from "../services/api";
import CoverSection from "../components/CoverSection";

function Home() {
  const [countries, setCountries] = useState([]);
  const [displayedCountries, setDisplayedCountries] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Responsive initial limit: 6 for mobile (2 columns x 3 rows), 16 for larger screens
  const INITIAL_LIMIT = window.innerWidth < 640 ? 6 : 16;

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // Artificial delay for testing skeleton
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const data = await getAllCountries();
        setCountries(data);
        setDisplayedCountries(data.slice(0, INITIAL_LIMIT));
        setLoading(false);
      } catch (err) {
        setError("Failed to load countries");
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const data = await getAllCountries();
        setCountries(data);
        setDisplayedCountries(data.slice(0, INITIAL_LIMIT));
        setShowAll(false);
        setError(null);
        setLoading(false);
      } catch (err) {
        setError("Failed to load countries");
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const data = await searchCountriesByName(query);
      setCountries(data);
      setDisplayedCountries(data.slice(0, INITIAL_LIMIT));
      setShowAll(false);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError("No countries found");
      setCountries([]);
      setDisplayedCountries([]);
      setShowAll(false);
      setLoading(false);
    }
  };

  const handleFilter = async (region) => {
    if (!region) {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const data = await getAllCountries();
        setCountries(data);
        setDisplayedCountries(data.slice(0, INITIAL_LIMIT));
        setShowAll(false);
        setError(null);
        setLoading(false);
      } catch (err) {
        setError("Failed to load countries");
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const data = await getCountriesByRegion(region);
      setCountries(data);
      setDisplayedCountries(data.slice(0, INITIAL_LIMIT));
      setShowAll(false);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError("No countries found for this region");
      setCountries([]);
      setDisplayedCountries([]);
      setShowAll(false);
      setLoading(false);
    }
  };

  const handleShowAll = () => {
    setDisplayedCountries(countries);
    setShowAll(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header onSearch={handleSearch} onFilter={handleFilter} />
      <main
        className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 flex-grow"
        aria-busy={loading}
      >
        {/* Responsive Cover Section */}
        <section className="w-full h-[60vh] sm:h-[70vh] lg:h-[550px] bg-black mb-6 sm:mb-6">
          <CoverSection />
        </section>

        {/* Responsive Heading */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mb-4 sm:mb-6">
          All Countries
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {[...Array(INITIAL_LIMIT)].map((_, index) => (
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

        {/* Empty State */}
        {!loading && !error && displayedCountries.length === 0 && (
          <p className="text-center text-gray-600 text-sm sm:text-base py-6 sm:py-8">
            No countries match your search or filter.
          </p>
        )}

        {/* Countries Grid */}
        {!loading && !error && displayedCountries.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {displayedCountries.map((country) => (
                <CountryCard key={country.cca3} country={country} />
              ))}
            </div>
            {!showAll && countries.length > INITIAL_LIMIT && (
              <div className="mt-6 sm:mt-8 text-center">
                <button
                  onClick={handleShowAll}
                  className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-sm sm:text-base hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black active:bg-gray-900"
                  aria-label="Show all countries"
                >
                  Show All Countries
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Home;

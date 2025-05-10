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

  // Limit to 16 countries initially
  const INITIAL_LIMIT = 16;

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
        // Artificial delay for testing
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
      // Artificial delay for testing
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
        // Artificial delay for testing
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
      // Artificial delay for testing
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
        className="container max-w-6xl mx-auto pb-12 flex-grow"
        aria-busy={loading}
      >
        <section className="w-full h-[550px] bg-black">
          <CoverSection />
        </section>
        <h1 className="text-3xl font-extrabold text-gray-800 my-6">
          All Countries
        </h1>
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(16)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}
        {error && <p className="text-center text-red-500 py-8">{error}</p>}
        {!loading && !error && displayedCountries.length === 0 && (
          <p className="text-center text-gray-600 py-8">
            No countries match your search or filter.
          </p>
        )}
        {!loading && !error && displayedCountries.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {displayedCountries.map((country) => (
                <CountryCard key={country.cca3} country={country} />
              ))}
            </div>
            {!showAll && countries.length > INITIAL_LIMIT && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleShowAll}
                  className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black"
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

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCountryByCode } from "../services/api";
import { ArrowLeft, AlertCircle } from "lucide-react";
import NewsComponent from "../components/NewsComponent";
import GlobeComponent from "../components/GlobeComponent";

function CountryDetails() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const data = await getCountryByCode(code);
        setCountry(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load country details");
        setLoading(false);
      }
    };
    fetchCountry();
  }, [code]);

  const handleSearch = (query) => {
    console.log("Search:", query);
  };

  const handleFilter = (region) => {
    console.log("Filter:", region);
  };

  return (
    <div className="min-h-screen flex pt-24  flex-col bg-gradient-to-b from-gray-100 to-gray-200">
      <Header onSearch={handleSearch} onFilter={handleFilter} />
      <main className="container max-w-6xl mx-auto py-10 flex-grow">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-8 flex items-center gap-2 rounded-lg px-5 py-3 text-black  transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Go back to previous page"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-base font-semibold">Back</span>
        </button>

        {/* Loading State */}
        {loading && (
          <div
            className="bg-white p-8 rounded-2xl  animate-pulse"
            aria-live="polite"
          >
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2 h-64 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg flex items-center gap-3"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle size={24} className="text-red-500" />
            <p className="text-red-700 text-base">{error}</p>
          </div>
        )}

        {/* Country Details */}
        {country && (
          <article
            className="bg-white p-6 sm:p-8 rounded-2xl  border-2 border-gray-200 transform transition-all duration-500 animate-fade-in"
            aria-labelledby="country-title"
          >
            <div className="w-full">
              <GlobeComponent
                latlng={country.latlng}
                name={country.name.common}
                population={country.population}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Flag Image */}
              <div className="w-full md:w-1/2">
                <img
                  src={country.flags.png}
                  alt={`Flag of ${country.name.common}`}
                  className="w-full h-64 sm:h-80 object-cover rounded-xl border border-gray-200 "
                />
              </div>
              {/* Country Info */}
              <div className="flex-1">
                <h1
                  id="country-title"
                  className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-6"
                >
                  {country.name.common}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Official Name
                    </span>
                    <span className="text-base text-gray-800">
                      {country.name.official}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Capital
                    </span>
                    <span className="text-base text-gray-800">
                      {country.capital?.[0] || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Region
                    </span>
                    <span className="text-base text-gray-800">
                      {country.region}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Subregion
                    </span>
                    <span className="text-base text-gray-800">
                      {country.subregion || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Population
                    </span>
                    <span className="text-base text-gray-800">
                      {country.population.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Area
                    </span>
                    <span className="text-base text-gray-800">
                      {country.area.toLocaleString()} km²
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Languages
                    </span>
                    <span className="text-base text-gray-800">
                      {country.languages
                        ? Object.values(country.languages).join(", ")
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Currencies
                    </span>
                    <span className="text-base text-gray-800">
                      {country.currencies
                        ? Object.values(country.currencies)
                            .map((c) => c.name)
                            .join(", ")
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        )}
      </main>
      <NewsComponent country={code} />
      <Footer />
    </div>
  );
}

export default CountryDetails;

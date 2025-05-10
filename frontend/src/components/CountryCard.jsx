import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Heart } from "lucide-react";

function CountryCard({ country }) {
  const { user } = useAuth();
  const { name, capital, region, population, flags, languages, cca3 } = country;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user) {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(favorites.includes(cca3));
    }
  }, [user, cca3]);

  const toggleFavorite = () => {
    if (!user) {
      alert("Please log in to add favorites");
      return;
    }
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (isFavorite) {
      const updatedFavorites = favorites.filter((code) => code !== cca3);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(cca3);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  return (
    <article
      className="group bg-white rounded-sm border border-gray-100/50 p-3.5 sm:p-3.5 transform transition-all duration-300 ease-in-out"
      role="article"
      aria-labelledby={`country-${cca3}`}
    >
      <Link
        to={`/country/${cca3}`}
        className="block"
        aria-label={`View details for ${name.common}`}
      >
        <div className="relative overflow-hidden rounded-sm mb-2">
          <img
            src={flags.png}
            alt={`Flag of ${name.common}`}
            className="w-full h-16 object-cover transform transition-transform duration-300 ease-in-out"
          />
          <button
            onClick={(e) => {
              e.preventDefault(); // Prevent Link navigation
              toggleFavorite();
            }}
            className={`absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 active:scale-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
              isFavorite ? "bg-red-600/70 hover:bg-red-700/80" : ""
            }`}
            aria-label={
              isFavorite
                ? `Remove ${name.common} from favorites`
                : `Add ${name.common} to favorites`
            }
          >
            <Heart
              size={16}
              className={`transform transition-all duration-200 ease-in-out ${
                isFavorite ? "fill-white scale-110" : "stroke-white scale-100"
              }`}
            />
          </button>
        </div>
        <h2
          id={`country-${cca3}`}
          className="text-lg font-semibold text-gray-900 mb-3 tracking-tight"
        >
          {name.common}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
              Capital
            </span>
            <span className="text-xs text-gray-800">
              {capital?.[0] || "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
              Region
            </span>
            <span className="text-xs text-gray-800">{region}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
              Population
            </span>
            <span className="text-xs text-gray-800">
              {population.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
              Languages
            </span>
            <span className="text-xs text-gray-800">
              {languages ? Object.values(languages).join(", ") : "N/A"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default CountryCard;

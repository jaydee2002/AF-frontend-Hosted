import React from "react";

const SkeletonCard = () => {
  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -468px 0;
            }
            100% {
              background-position: 468px 0;
            }
          }
          .shimmer {
            background: linear-gradient(to right, #f3f4f6 8%, #e5e7eb 18%, #f3f4f6 33%);
            background-size: 800px 104px;
            animation: shimmer 1.5s infinite linear;
            border-radius: 4px;
          }
        `}
      </style>
      <article
        className="group bg-white rounded-sm border border-gray-100/50 p-3.5 sm:p-3.5"
        aria-hidden="true"
      >
        {/* Flag Placeholder with Favorite Button */}
        <div className="relative overflow-hidden rounded-sm mb-2">
          <div className="w-full h-16 shimmer"></div>
          <div className="absolute top-2 right-2 w-8 h-8 shimmer rounded-full"></div>
        </div>

        {/* Country Name Placeholder */}
        <div className="h-5 shimmer rounded w-3/4 mb-3"></div>

        {/* Grid layout for details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-1">
              <div className="h-3 shimmer w-16 rounded"></div> {/* Label */}
              <div className="h-3 shimmer w-24 rounded"></div> {/* Value */}
            </div>
          ))}
        </div>
      </article>
    </>
  );
};

export default SkeletonCard;

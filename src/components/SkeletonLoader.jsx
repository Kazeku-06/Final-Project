const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, index) => index);

  if (type === 'card') {
    return (
      <>
        {skeletons.map((index) => (
          <div key={index} className="card bg-base-200 shadow-xl animate-pulse">
            <div className="h-64 bg-base-300"></div>
            <div className="card-body p-4">
              <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-base-300 rounded w-16"></div>
                <div className="h-4 bg-base-300 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'detail') {
    return (
      <div className="animate-pulse">
        <div className="h-96 bg-base-300 mb-8"></div>
        <div className="container mx-auto px-4 -mt-48 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-64 h-96 bg-base-300 rounded-lg"></div>
            </div>
            <div className="flex-grow space-y-4">
              <div className="h-8 bg-base-300 rounded w-3/4"></div>
              <div className="h-4 bg-base-300 rounded w-1/2"></div>
              <div className="h-4 bg-base-300 rounded w-2/3"></div>
              <div className="h-4 bg-base-300 rounded w-full"></div>
              <div className="h-4 bg-base-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;

const Skeleton = ({height}) => (
    <div className="relative cursor-pointer group overflow-hidden rounded-[6px] shadow-lg animate-pulse">
      <div style={{height:height}} className="w-full bg-gray-300"></div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1 opacity-100 transition-opacity duration-500">
        <div className="h-6 bg-gray-400 rounded-md mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-400 rounded w-1/2"></div>
      </div>
    </div>
  );

  export default Skeleton
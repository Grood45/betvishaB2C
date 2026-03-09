
const RecordSkeleton = ({height}) => (
    <div className="relative cursor-pointer bg-white group overflow-hidden rounded-[6px] border animate-pulse">
      <div style={{height:height}} className="w-full bg-white"></div>
      <div className="absolute bottom-0 left-0 right-0   to-transparent p-1 opacity-100 transition-opacity duration-500">
        {/* <div className="h-6 bg-gray-400 rounded-md mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-400 rounded w-1/2"></div> */}
      </div>
    </div>
  );

  export default RecordSkeleton
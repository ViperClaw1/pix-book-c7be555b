const ShimmerCard = () => (
  <div className="w-[200px] flex-shrink-0">
    <div className="shimmer w-full h-[140px] rounded-xl" />
    <div className="mt-2 space-y-1.5">
      <div className="shimmer h-4 w-3/4 rounded" />
      <div className="shimmer h-3 w-1/2 rounded" />
    </div>
  </div>
);

export default ShimmerCard;

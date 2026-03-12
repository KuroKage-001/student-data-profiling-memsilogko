const CarouselProgressBar = ({ currentSlide, totalSlides }) => {
  return (
    <div className="mt-4 w-full bg-white/20 rounded-full h-1 shadow-inner overflow-hidden">
      <div 
        className="bg-gradient-to-r from-white to-orange-100 h-1 rounded-full transition-all duration-300 ease-out shadow-sm animate-shimmer"
        style={{
          width: `${((currentSlide + 1) / totalSlides) * 100}%`
        }}
      />
    </div>
  );
};

export { CarouselProgressBar };
const CarouselIndicators = ({ slides, currentSlide, onSlideChange }) => {
  return (
    <div className="mt-8 flex items-center justify-center space-x-3">
      {slides.map((_, index) => (
        <button
          key={index}
          onClick={() => onSlideChange(index)}
          className={`relative h-2 rounded-full transition-all duration-500 transform hover:scale-125 ${
            index === currentSlide 
              ? 'bg-white w-8 shadow-lg animate-pulse-gentle' 
              : 'bg-white/60 w-2 hover:bg-white/80'
          }`}
        >
          {index === currentSlide && (
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export { CarouselIndicators };
const CarouselContent = ({ slides, currentSlide }) => {
  return (
    <div className="relative overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`transition-all duration-700 ease-out transform ${
            index === currentSlide 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-4 scale-95 absolute inset-0'
          }`}
        >
          <h2 className="text-3xl font-bold mb-4 drop-shadow-lg animate-slide-in-right">
            {slide.title}
          </h2>
          <p className="text-lg text-orange-50 leading-relaxed drop-shadow-sm animate-slide-in-left delay-200">
            {slide.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export { CarouselContent };
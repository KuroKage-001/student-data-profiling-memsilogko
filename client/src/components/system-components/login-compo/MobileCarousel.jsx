import { useCarousel } from '../../../hooks/useCarousel';
import { carouselSlides } from '../../../utils/system-utils/login-utils/carouselData';
import { CarouselContent } from './CarouselContent';
import { CarouselIndicators } from './CarouselIndicators';
import { CarouselProgressBar } from './CarouselProgressBar';

const MobileCarousel = () => {
  const { currentSlide, goToSlide } = useCarousel(carouselSlides);

  return (
    <div className="lg:hidden relative overflow-hidden rounded-t-4xl">
      {/* Mobile Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 animate-gradient-shift"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-orange-700/30 via-transparent to-orange-300/20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-orange-600/30"></div>
      
      {/* Mobile Content */}
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-sm mx-auto text-center text-white">
          <div className="mb-6 relative">
            <div className="animate-logo-glow">
              <img 
                src="/src/assets/images/ccs-logo.png" 
                alt="CCS Logo" 
                className="w-20 h-20 object-contain mx-auto mb-4 transition-all duration-700 transform hover:scale-110 animate-fade-in-up"
              />
            </div>
          </div>
          
          {/* Mobile Content with Staggered Animation */}
          <div className="relative overflow-hidden min-h-[120px] flex items-center">
            {carouselSlides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ease-out transform w-full ${
                  index === currentSlide 
                    ? 'opacity-100 translate-x-0 scale-100' 
                    : 'opacity-0 translate-x-4 scale-95 absolute inset-0'
                }`}
              >
                <h2 className="text-xl font-bold mb-3 drop-shadow-lg animate-slide-in-right">
                  {slide.title}
                </h2>
                <p className="text-sm text-orange-50 leading-relaxed drop-shadow-sm animate-slide-in-left delay-200">
                  {slide.description}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile Enhanced Slide Indicators */}
          <div className="mt-6 flex items-center justify-center space-x-2">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative h-2 rounded-full transition-all duration-500 transform hover:scale-125 ${
                  index === currentSlide 
                    ? 'bg-white w-6 shadow-lg animate-pulse-gentle' 
                    : 'bg-white/60 w-2 hover:bg-white/80'
                }`}
              >
                {index === currentSlide && (
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30"></div>
                )}
              </button>
            ))}
          </div>

          {/* Mobile Enhanced Progress Bar */}
          <div className="mt-3 w-full bg-white/20 rounded-full h-1 shadow-inner overflow-hidden">
            <div 
              className="bg-gradient-to-r from-white to-orange-100 h-1 rounded-full transition-all duration-300 ease-out shadow-sm animate-shimmer"
              style={{
                width: `${((currentSlide + 1) / carouselSlides.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { MobileCarousel };
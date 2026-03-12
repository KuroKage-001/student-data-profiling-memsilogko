import { useCarousel } from '../../../hooks/useCarousel';
import { useDragAndDrop } from '../../../hooks/useDragAndDrop';
import { carouselSlides } from '../../../utils/system-utils/login-utils/carouselData';
import { CarouselContent } from './CarouselContent';
import { CarouselIndicators } from './CarouselIndicators';
import { CarouselProgressBar } from './CarouselProgressBar';
import { PiggyBank } from './PiggyBank';
import { VideoPlayer } from './VideoPlayer';

const CarouselSection = () => {
  const { currentSlide, goToSlide } = useCarousel(carouselSlides);
  const {
    isDragging,
    showPiggyBank,
    showVideo,
    videoAnimating,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDragOver,
    closeVideo
  } = useDragAndDrop();

  return (
    <div className="hidden lg:flex flex-1 relative overflow-hidden rounded-tl-[3rem] lg:rounded-tl-[4rem]">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 animate-gradient-shift"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-orange-700/30 via-transparent to-orange-300/20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-orange-600/30"></div>
      
      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-center p-12 w-full" onDrop={handleDrop} onDragOver={handleDragOver}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-float-slow"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full animate-float-medium"></div>
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-white rounded-full animate-float-fast"></div>
          <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-white/5 rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 left-20 w-12 h-12 bg-white/5 rounded-full animate-bounce-slow"></div>
        </div>

        {/* Video Display */}
        {showVideo ? (
          <VideoPlayer 
            videoAnimating={videoAnimating}
            onClose={closeVideo}
          />
        ) : (
          /* Carousel Content */
          <div className="max-w-md text-center text-white relative z-20">
            {/* Drag & Drop Indicator */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-orange-200 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  <span className="text-sm font-medium text-white">Drag to Piggy Bank</span>
                  <svg className="w-5 h-5 text-orange-200 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Logo */}
            <div className="mb-8 relative">
              <div className="animate-logo-glow">
                <img 
                  src="/src/assets/images/ccs-logo.png" 
                  alt="CCS Logo" 
                  className={`w-45 h-45 object-contain mx-auto mb-6 transition-all duration-700 transform hover:scale-110 animate-fade-in-up cursor-grab ${isDragging ? 'cursor-grabbing opacity-50' : ''}`}
                  draggable="true"
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              </div>
            </div>
            
            <CarouselContent 
              slides={carouselSlides}
              currentSlide={currentSlide}
            />

            <CarouselIndicators 
              slides={carouselSlides}
              currentSlide={currentSlide}
              onSlideChange={goToSlide}
            />

            <CarouselProgressBar 
              currentSlide={currentSlide}
              totalSlides={carouselSlides.length}
            />
          </div>
        )}

        {/* Cyberpunk Piggy Bank */}
        {showPiggyBank && <PiggyBank />}
      </div>
    </div>
  );
};

export { CarouselSection };
import grokVideo from '../../../assets/images/grok-vid.mp4';

const VideoPlayer = ({ videoAnimating, onClose }) => {
  return (
    <div className={`relative w-full h-full flex items-center justify-center transition-all duration-500 ${videoAnimating ? 'animate-video-in' : 'animate-video-out'}`}>
      <div className="relative max-w-2xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-8 right-0 text-white hover:text-orange-200 transition-colors duration-200 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <video
          className="w-full h-auto rounded-lg shadow-2xl custom-video-player"
          autoPlay
          onEnded={onClose}
        >
          <source src={grokVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export { VideoPlayer };
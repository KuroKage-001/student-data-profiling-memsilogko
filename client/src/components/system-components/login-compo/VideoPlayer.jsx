import grokVideo from '../../../assets/images/grok-vid.mp4';

const VideoPlayer = ({ videoAnimating, onClose }) => {
  return (
    <div className={`relative w-full h-full flex items-center justify-center transition-all duration-500 ${videoAnimating ? 'animate-video-in' : 'animate-video-out'}`}>
      <div className="relative max-w-2xl w-full">

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
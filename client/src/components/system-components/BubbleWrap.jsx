import { useState, useEffect } from 'react';

const BubbleWrap = () => {
  const [ccsElements, setCcsElements] = useState([]);
  const [poppedBubbles, setPoppedBubbles] = useState(new Set());

  useEffect(() => {
    const newElements = [];
    for (let i = 0; i < 25; i++) {
      newElements.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 30 + 20,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.3 + 0.15,
        rotation: Math.random() * 360
      });
    }
    setCcsElements(newElements);
  }, []);

  const handleBubblePop = (id) => {
    setPoppedBubbles(prev => new Set([...prev, id]));
  };

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        {ccsElements.map((element) => (
          <div
            key={element.id}
            className={`absolute flex items-center justify-center cursor-pointer transition-all duration-300 ${
              poppedBubbles.has(element.id) ? 'popped' : ''
            }`}
            style={{
              left: `${element.left}%`,
              top: `${element.top}%`,
              width: `${element.size * 2}px`,
              height: `${element.size * 2}px`,
              opacity: poppedBubbles.has(element.id) ? 0 : element.opacity,
              animation: poppedBubbles.has(element.id) 
                ? 'pop 0.3s ease-out forwards' 
                : `float ${8 + element.delay}s ease-in-out infinite ${element.delay}s`,
              pointerEvents: poppedBubbles.has(element.id) ? 'none' : 'auto',
            }}
            onClick={() => handleBubblePop(element.id)}
          >
            <div
              className="bubble"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 107, 0, 0.4), rgba(255, 107, 0, 0.6))',
                border: '2px solid rgba(255, 107, 0, 0.3)',
                boxShadow: '0 4px 15px rgba(255, 107, 0, 0.3), inset -10px -10px 20px rgba(255, 107, 0, 0.2), inset 10px 10px 20px rgba(255, 255, 255, 0.3)',
              }}
            />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes pop {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.5; }
          100% { transform: scale(0); opacity: 0; }
        }
        .bubble {
          animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }
      `}</style>
    </>
  );
};

export default BubbleWrap;

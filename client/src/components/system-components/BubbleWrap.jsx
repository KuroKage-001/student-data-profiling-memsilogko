import { useState, useEffect } from 'react';

const BubbleWrap = () => {
  const [ccsElements, setCcsElements] = useState([]);

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

  return (
    <>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {ccsElements.map((element) => (
          <div
            key={element.id}
            className="absolute font-bold select-none"
            style={{
              left: `${element.left}%`,
              top: `${element.top}%`,
              fontSize: `${element.size}px`,
              opacity: element.opacity,
              color: '#FF6B00',
              textShadow: '2px 2px 4px rgba(255, 107, 0, 0.3)',
              transform: `rotate(${element.rotation}deg)`,
              animation: `float ${8 + element.delay}s ease-in-out infinite ${element.delay}s`,
            }}
          >
            CCS
          </div>
        ))}
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(30px, -30px) scale(1.1) rotate(10deg); }
          66% { transform: translate(-20px, 20px) scale(0.9) rotate(-10deg); }
        }
      `}</style>
    </>
  );
};

export default BubbleWrap;

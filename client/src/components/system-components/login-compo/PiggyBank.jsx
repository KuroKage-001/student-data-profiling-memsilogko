const PiggyBank = () => {
  return (
    <div 
      id="piggy-bank"
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-32 cursor-pointer transition-all duration-300 z-30 animate-fade-in-up"
    >
      <div className="relative w-full h-full">
        {/* Outer Glow Ring */}
        <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full opacity-40 blur-sm animate-pulse-gentle"></div>
        
        {/* Piggy Bank Body */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-full opacity-90 animate-pulse-gentle shadow-lg shadow-orange-500/50"></div>
        <div className="absolute inset-1 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-full border border-orange-400/30"></div>
        
        {/* Digital Display Screen */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-14 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-md opacity-80 shadow-inner">
            <div className="absolute inset-0.5 bg-black rounded-sm">
              <div className="flex items-center justify-center h-full">
                <div className="text-orange-400 text-sm font-mono animate-pulse">$$$</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cyberpunk Details - LED Lights */}
        <div className="absolute top-2 left-4 w-2 h-2 bg-orange-400 rounded-full animate-ping shadow-lg shadow-orange-400/50"></div>
        <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
        <div className="absolute bottom-4 left-3 w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-400/50"></div>
        <div className="absolute bottom-3 right-5 w-2 h-2 bg-orange-300 rounded-full animate-ping shadow-lg shadow-orange-300/50"></div>
        
        {/* Coin Slot with Glow */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-10 h-2 bg-gray-700 rounded-full shadow-inner">
            <div className="w-full h-full bg-gradient-to-r from-orange-400/50 to-orange-600/50 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Robotic Legs */}
        <div className="absolute -bottom-1 left-4 w-3 h-5 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-lg border border-orange-400/30"></div>
        <div className="absolute -bottom-1 right-4 w-3 h-5 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-lg border border-orange-400/30"></div>
        
        {/* Circuit Pattern */}
        <div className="absolute inset-3 rounded-full overflow-hidden opacity-20">
          <div className="absolute top-3 left-3 w-5 h-0.5 bg-orange-400"></div>
          <div className="absolute top-3 left-3 w-0.5 h-5 bg-orange-400"></div>
          <div className="absolute bottom-3 right-3 w-5 h-0.5 bg-orange-600"></div>
          <div className="absolute bottom-3 right-3 w-0.5 h-5 bg-orange-600"></div>
        </div>
        
        {/* Glowing Border */}
        <div className="absolute inset-0 rounded-full border-2 border-orange-400 opacity-60 animate-pulse shadow-lg shadow-orange-400/30"></div>
        
        {/* Holographic Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      </div>
      
      {/* Drop Zone Indicator */}
      <div className="absolute -inset-8 border-2 border-dashed border-orange-400 rounded-full opacity-60 transition-all duration-300 animate-pulse">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-400 text-sm font-mono whitespace-nowrap font-bold">
          DROP HERE
        </div>
      </div>
      
      {/* Particle Effects */}
      <div className="absolute -inset-6 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-orange-600 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute left-0 top-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute right-0 bottom-1/3 w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse opacity-60"></div>
      </div>
    </div>
  );
};

export { PiggyBank };
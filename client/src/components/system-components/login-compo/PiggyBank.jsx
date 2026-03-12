const PiggyBank = () => {
  return (
    <div 
      id="piggy-bank"
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-36 h-32 cursor-pointer transition-all duration-500 z-30 animate-fade-in-up hover:scale-110 hover:-translate-y-2 group"
    >
      <div className="relative w-full h-full">
        {/* Cyberpunk Pig Body - Oval Shape */}
        <div className="absolute inset-0 bg-linear-to-br from-pink-400 via-pink-500 to-pink-600 rounded-full opacity-90 shadow-2xl shadow-pink-500/60 group-hover:shadow-pink-400/80 transition-all duration-500 animate-pulse transform scale-x-110"></div>
        <div className="absolute inset-1 bg-linear-to-br from-gray-800 via-gray-900 to-black rounded-full border border-pink-400/40 group-hover:border-pink-300/60 transition-all duration-500 transform scale-x-110"></div>
        
        {/* Cyberpunk Pig Snout */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-linear-to-br from-pink-300 via-pink-400 to-pink-500 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
          <div className="absolute inset-0.5 bg-linear-to-br from-gray-700 via-gray-800 to-gray-900 rounded-full border border-pink-400/50">
            {/* Pig Nostrils - Glowing */}
            <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-2 bg-orange-400 rounded-full animate-pulse shadow-lg shadow-orange-400/70"></div>
            <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2 w-1.5 h-2 bg-orange-400 rounded-full animate-pulse shadow-lg shadow-orange-400/70"></div>
            {/* Snout Circuit Lines */}
            <div className="absolute inset-1 rounded-full overflow-hidden opacity-40">
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-pink-400 animate-pulse"></div>
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-pink-300 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Cyberpunk Pig Eyes - Glowing */}
        <div className="absolute top-6 left-6 w-4 h-4 bg-linear-to-br from-cyan-400 to-cyan-600 rounded-full shadow-lg shadow-cyan-400/70 group-hover:shadow-cyan-300/90 transition-all duration-300 animate-pulse">
          <div className="absolute inset-0.5 bg-black rounded-full">
            <div className="absolute top-1 left-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-80"></div>
          </div>
        </div>
        <div className="absolute top-6 right-6 w-4 h-4 bg-linear-to-br from-cyan-400 to-cyan-600 rounded-full shadow-lg shadow-cyan-400/70 group-hover:shadow-cyan-300/90 transition-all duration-300 animate-pulse">
          <div className="absolute inset-0.5 bg-black rounded-full">
            <div className="absolute top-1 left-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-80"></div>
          </div>
        </div>
        
        {/* Cyberpunk Pig Ears - Triangular with Tech Details */}
        <div className="absolute -top-2 left-4 w-6 h-8 bg-linear-to-br from-pink-400 to-pink-600 transform rotate-12 group-hover:rotate-6 transition-transform duration-500" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}>
          <div className="absolute inset-0.5 bg-linear-to-br from-gray-700 to-gray-900" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="absolute -top-2 right-4 w-6 h-8 bg-linear-to-br from-pink-400 to-pink-600 transform -rotate-12 group-hover:-rotate-6 transition-transform duration-500" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}>
          <div className="absolute inset-0.5 bg-linear-to-br from-gray-700 to-gray-900" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Cyberpunk Pig Tail - Curly with Neon */}
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 group-hover:rotate-12 transition-transform duration-500">
          <div className="absolute inset-0 border-4 border-pink-400 rounded-full border-dashed animate-spin shadow-lg shadow-pink-400/50" style={{animation: 'spin 4s linear infinite'}}></div>
          <div className="absolute inset-2 border-2 border-orange-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
        </div>
        
        {/* Digital Display Screen on Belly */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-300">
          <div className="w-16 h-11 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg opacity-90 shadow-inner group-hover:shadow-orange-400/50 transition-all duration-300">
            <div className="absolute inset-0.5 bg-black rounded-md overflow-hidden">
              <div className="flex items-center justify-center h-full relative">
                <div className="text-orange-400 text-sm font-mono animate-pulse group-hover:text-orange-300 transition-colors duration-300">🐷💰</div>
                {/* Scanning Line Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-400/20 to-transparent h-1 animate-bounce opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Coin Slot on Top of Head */}
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 group-hover:scale-110 transition-transform duration-300">
          <div className="w-12 h-3 bg-gray-700 rounded-full shadow-inner relative overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-orange-400/60 to-orange-600/60 rounded-full animate-pulse group-hover:from-orange-300/80 group-hover:to-orange-500/80 transition-all duration-300"></div>
            {/* Coin Insertion Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
        
        {/* Cyberpunk Pig Legs - Four Legs */}
        <div className="absolute -bottom-1 left-2 w-3 h-6 bg-gradient-to-b from-pink-600 to-gray-800 rounded-b-lg border border-pink-400/40 shadow-lg group-hover:border-pink-300/60 transition-all duration-500"></div>
        <div className="absolute -bottom-1 left-8 w-3 h-6 bg-gradient-to-b from-pink-600 to-gray-800 rounded-b-lg border border-pink-400/40 shadow-lg group-hover:border-pink-300/60 transition-all duration-500"></div>
        <div className="absolute -bottom-1 right-8 w-3 h-6 bg-gradient-to-b from-pink-600 to-gray-800 rounded-b-lg border border-pink-400/40 shadow-lg group-hover:border-pink-300/60 transition-all duration-500"></div>
        <div className="absolute -bottom-1 right-2 w-3 h-6 bg-gradient-to-b from-pink-600 to-gray-800 rounded-b-lg border border-pink-400/40 shadow-lg group-hover:border-pink-300/60 transition-all duration-500"></div>
        
        {/* Tech Implants - LED Lights on Body */}
        <div className="absolute top-4 left-8 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/70 group-hover:bg-cyan-300 transition-colors duration-300 animate-ping"></div>
        <div className="absolute top-8 right-8 w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/70 group-hover:bg-yellow-300 transition-colors duration-300 animate-pulse"></div>
        <div className="absolute bottom-6 left-6 w-2 h-2 bg-red-400 rounded-full shadow-lg shadow-red-400/70 group-hover:bg-red-300 transition-colors duration-300 animate-ping"></div>
        <div className="absolute bottom-8 right-6 w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/70 group-hover:bg-green-300 transition-colors duration-300 animate-pulse"></div>
        
        {/* Circuit Pattern on Body */}
        <div className="absolute inset-4 rounded-full overflow-hidden opacity-30 group-hover:opacity-50 transition-opacity duration-500">
          <div className="absolute top-2 left-2 w-6 h-0.5 bg-gradient-to-r from-pink-400 to-transparent animate-pulse"></div>
          <div className="absolute top-2 left-2 w-0.5 h-6 bg-gradient-to-b from-pink-400 to-transparent animate-pulse"></div>
          <div className="absolute bottom-2 right-2 w-6 h-0.5 bg-gradient-to-l from-pink-600 to-transparent animate-pulse"></div>
          <div className="absolute bottom-2 right-2 w-0.5 h-6 bg-gradient-to-t from-pink-600 to-transparent animate-pulse"></div>
          {/* Neural Network Lines */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-ping"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 w-6 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-60 animate-pulse"></div>
        </div>
        
        {/* Glowing Aura */}
        <div className="absolute inset-0 rounded-full border-2 border-pink-400 opacity-70 shadow-lg shadow-pink-400/40 group-hover:border-pink-300 group-hover:opacity-90 group-hover:shadow-pink-300/60 transition-all duration-500 animate-pulse transform scale-x-110"></div>
        
        {/* Holographic Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:via-white/25 transition-all duration-700 transform scale-x-110" style={{animation: 'shimmer 3s ease-in-out infinite'}}></div>
        
        {/* Energy Field */}
        <div className="absolute -inset-2 bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 rounded-full opacity-20 blur-lg animate-pulse group-hover:opacity-40 group-hover:blur-xl transition-all duration-700 transform scale-x-110"></div>
      </div>
      
      
      {/* Enhanced Drop Zone Indicator with Magnetic Field Effect */}
      <div className="absolute -inset-8 border-2 border-dashed border-orange-400 rounded-full opacity-50 transition-all duration-500 group-hover:opacity-80 group-hover:border-orange-300 group-hover:scale-110 animate-pulse">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-400 text-sm font-mono whitespace-nowrap font-bold group-hover:text-orange-300 group-hover:scale-110 transition-all duration-300">
          DROP HERE
        </div>
        {/* Magnetic Field Lines */}
        <div className="absolute inset-0 rounded-full border border-orange-400/10 group-hover:border-orange-300/20 transition-all duration-500" style={{animation: 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite'}}></div>
      </div>
      
      {/* Enhanced Particle Effects with Orbital Motion */}
      <div className="absolute -inset-8 pointer-events-none">
        <div className="absolute top-2 left-1/3 w-2 h-2 bg-orange-400 rounded-full opacity-70 shadow-lg shadow-orange-400/50 group-hover:opacity-100 transition-opacity duration-300" style={{animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'}}></div>
        <div className="absolute bottom-2 right-1/3 w-1.5 h-1.5 bg-orange-600 rounded-full opacity-70 shadow-lg shadow-orange-600/50 group-hover:opacity-100 transition-opacity duration-300" style={{animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
        <div className="absolute left-2 top-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-70 shadow-lg shadow-yellow-400/50 group-hover:opacity-100 transition-opacity duration-300" style={{animation: 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite'}}></div>
        <div className="absolute right-2 bottom-1/3 w-2 h-2 bg-red-400 rounded-full opacity-70 shadow-lg shadow-red-400/50 group-hover:opacity-100 transition-opacity duration-300" style={{animation: 'pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
        
        {/* Floating Energy Orbs */}
        <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" style={{animation: 'bounce 4s ease-in-out infinite'}}></div>
        <div className="absolute bottom-0 right-1/2 w-1 h-1 bg-orange-200 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" style={{animation: 'bounce 3.5s ease-in-out infinite reverse'}}></div>
      </div>
      
      {/* Success Feedback Ring */}
      <div className="absolute -inset-4 border-4 border-green-400 rounded-full opacity-0 scale-75 transition-all duration-300 group-hover:opacity-30 group-hover:scale-100"></div>
    </div>
  );
};

export { PiggyBank };
import { BubbleWrap, PortalCards, FeaturesSection } from '../../components/system-components/home-compo';
import usePageTitle from '../../hooks/usePageTitle';

const HomePage = () => {
  usePageTitle('Home');
  
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 overflow-x-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      <BubbleWrap />
      
      <div className="max-w-6xl w-full relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mb-3">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight inline-block relative" 
                style={{ fontFamily: 'Inter, Montserrat, Poppins, sans-serif' }}>
              <span className="bg-linear-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                CCS
              </span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-linear-to-r from-transparent via-orange-500 to-transparent rounded-full"></div>
            </h1>
          </div>
          
          <h2 className="text-xl md:text-3xl font-semibold mb-3 tracking-wide" 
              style={{ color: '#2C3E50', fontFamily: 'Inter, Montserrat, Poppins, sans-serif' }}>
            Comprehensive Profiling System
          </h2>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-sm md:text-base leading-relaxed px-4 py-2 rounded-lg" 
               style={{ 
                 color: '#5A6A7A',
                 backgroundColor: 'rgba(255, 255, 255, 0.5)',
                 backdropFilter: 'blur(10px)',
                 border: '1px solid rgba(255, 107, 0, 0.1)'
               }}>
              Advanced Student and Faculty Management Platform for comprehensive data management and reporting
            </p>
          </div>
        </div>

        <PortalCards />
        <FeaturesSection />
      </div>
    </div>
  );
};

export default HomePage;
export const carouselSlides = [
  {
    title: "Comprehensive Profiling System",
    description: "Streamline student and faculty data management with our comprehensive profiling platform designed for educational excellence."
  },
  {
    title: "Secure & Reliable",
    description: "Advanced security measures ensure your data is protected with enterprise-grade encryption and secure access controls."
  },
  {
    title: "Lightning Fast",
    description: "Experience blazing-fast performance with optimized data processing and intuitive user interface for seamless workflow."
  },
  {
    title: "Team Collaboration",
    description: "Foster collaboration between administrators, faculty, and students with integrated communication and data sharing tools."
  }
];

export const getSlideByIndex = (index) => {
  return carouselSlides[index] || carouselSlides[0];
};

export const getTotalSlides = () => {
  return carouselSlides.length;
};
import { useState } from 'react';

export const useDragAndDrop = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [showPiggyBank, setShowPiggyBank] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoAnimating, setVideoAnimating] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    setShowPiggyBank(true);
    const rect = e.target.getBoundingClientRect();
    setDragPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    // Add visual feedback
    e.target.classList.add('dragging-logo');
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    setShowPiggyBank(false);
    e.target.classList.remove('dragging-logo');
    const piggyBank = document.getElementById('piggy-bank');
    if (piggyBank) {
      piggyBank.classList.remove('animate-cyberpunk-glow', 'drag-over');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const piggyBank = document.getElementById('piggy-bank');
    if (!piggyBank) return;
    
    const rect = piggyBank.getBoundingClientRect();
    const dropX = e.clientX;
    const dropY = e.clientY;
    
    if (dropX >= rect.left && dropX <= rect.right && 
        dropY >= rect.top && dropY <= rect.bottom) {
      // Add shake animation to piggy bank
      piggyBank.classList.add('animate-piggy-shake');
      setTimeout(() => {
        piggyBank.classList.remove('animate-piggy-shake');
      }, 500);
      
      // Show video after a brief delay
      setTimeout(() => {
        setVideoAnimating(true);
        setTimeout(() => {
          setShowVideo(true);
        }, 50); // Small delay to ensure animation starts
        setShowPiggyBank(false);
      }, 600);
      
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const piggyBank = document.getElementById('piggy-bank');
    if (piggyBank && isDragging) {
      const rect = piggyBank.getBoundingClientRect();
      const dragX = e.clientX;
      const dragY = e.clientY;
      
      if (dragX >= rect.left && dragX <= rect.right && 
          dragY >= rect.top && dragY <= rect.bottom) {
        piggyBank.classList.add('drag-over');
      } else {
        piggyBank.classList.remove('drag-over');
      }
    }
  };

  const closeVideo = () => {
    setVideoAnimating(false);
    setTimeout(() => {
      setShowVideo(false);
    }, 500); // Wait for exit animation to complete
  };

  return {
    isDragging,
    dragPosition,
    showPiggyBank,
    showVideo,
    videoAnimating,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDragOver,
    closeVideo
  };
};
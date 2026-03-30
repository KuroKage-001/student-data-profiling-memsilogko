/**
 * Professional PDF Generator for Faculty Reports
 * Uses jsPDF with optimized full-page layout
 * Color Palette: White (dominant), Orange-600 (#EA580C), Orange-700 (#C2410C)
 * Includes institutional logo
 */

import { jsPDF } from 'jspdf';

/**
 * Load image as base64
 * @param {string} url - Image URL
 * @returns {Promise<string>} Base64 image data
 */
const loadImageAsBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Generate and download a faculty profile PDF report
 * @param {Object} faculty - Faculty data object
 */
export const generateFacultyPDF = async (faculty) => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Professional Color Palette
    const orange600 = [234, 88, 12];
    const orange700 = [194, 65, 12];
    const textDark = [17, 24, 39]; // Gray-900
    const textMedium = [75, 85, 99]; // Gray-600
    const textLight = [156, 163, 175]; // Gray-400
    const white = [255, 255, 255];
    
    // Load logo
    let logoData = null;
    try {
      logoData = await loadImageAsBase64('/ccs-logo.png');
    } catch (error) {
      // Logo loading failed, continue without logo
    }
    
    // Helper functions
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };
    
    const capitalize = (str) => {
      if (!str) return 'N/A';
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    
    // Page margins
    const margin = 12;
    const pageWidth = 210;
    const pageHeight = 297;
    const contentWidth = pageWidth - (margin * 2);
    
    // Header Section - Professional with Logo
    doc.setFillColor(...white);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    // Add logo if available
    if (logoData) {
      doc.addImage(logoData, 'PNG', margin, 8, 20, 20);
    }
    
    // Header text
    doc.setTextColor(...orange600);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FACULTY PROFILE REPORT', logoData ? margin + 25 : margin, 16);
    
    doc.setTextColor(...textMedium);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Faculty Data Management System', logoData ? margin + 25 : margin, 22);
    
    // Date and ID on the right
    doc.setTextColor(...textLight);
    doc.setFontSize(7);
    doc.text(`Generated: ${formatDate(new Date())}`, pageWidth - margin, 14, { align: 'right' });
    
    doc.setTextColor(...textMedium);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`ID: ${faculty.faculty_id || faculty.id}`, pageWidth - margin, 20, { align: 'right' });
    
    // Status badge
    const statusColors = {
      active: [16, 185, 129],
      inactive: [239, 68, 68],
      'on leave': [245, 158, 11]
    };
    const statusColor = statusColors[faculty.status?.toLowerCase()] || [107, 114, 128];
    doc.setFillColor(...statusColor);
    doc.roundedRect(pageWidth - margin - 28, 24, 28, 6, 2, 2, 'F');
    doc.setTextColor(...white);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(capitalize(faculty.status), pageWidth - margin - 14, 28, { align: 'center' });
    
    // Orange accent line
    doc.setDrawColor(...orange600);
    doc.setLineWidth(1.5);
    doc.line(margin, 35, pageWidth - margin, 35);
    
    let yPos = 42;
    
    // Faculty Name Section - Compact
    doc.setTextColor(...textDark);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(faculty.name || 'N/A', margin, yPos);
    
    // Email next to name
    doc.setTextColor(...textMedium);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(faculty.email || 'N/A', margin, yPos + 5);
    yPos += 12;
    
    // Four column layout for maximum space utilization
    const col1X = margin;
    const col2X = margin + 48;
    const col3X = margin + 96;
    const col4X = margin + 144;
    const colWidth = 45;
    
    // Helper function to add section header - more compact
    const addSectionHeader = (title, x, y, width = colWidth) => {
      doc.setFillColor(...orange600);
      doc.rect(x, y - 3, 1.5, 5, 'F');
      
      doc.setTextColor(...orange700);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(title, x + 3, y);
      
      return y + 6;
    };
    
    // Helper function to add field - more compact
    const addField = (label, value, x, y, maxWidth = colWidth) => {
      doc.setTextColor(...textLight);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'bold');
      doc.text(label.toUpperCase(), x, y);
      
      doc.setTextColor(...textDark);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(value || 'N/A', maxWidth);
      doc.text(lines, x, y + 3.5);
      
      return y + 3.5 + (lines.length * 3.5);
    };
    
    // Column 1 - Personal Information
    let col1Y = yPos;
    col1Y = addSectionHeader('PERSONAL', col1X, col1Y);
    col1Y = addField('Phone', faculty.phone, col1X, col1Y);
    col1Y = addField('Address', faculty.address, col1X, col1Y + 1);
    
    // Column 2 - Professional Information
    let col2Y = yPos;
    col2Y = addSectionHeader('PROFESSIONAL', col2X, col2Y);
    col2Y = addField('Department', faculty.department, col2X, col2Y);
    col2Y = addField('Position', faculty.position, col2X, col2Y + 1);
    col2Y = addField('Specialization', faculty.specialization, col2X, col2Y + 1);
    
    // Column 3 - Office Information
    let col3Y = yPos;
    col3Y = addSectionHeader('OFFICE', col3X, col3Y);
    col3Y = addField('Location', faculty.office, col3X, col3Y);
    col3Y = addField('Hire Date', formatDate(faculty.hire_date || faculty.hireDate), col3X, col3Y + 1);
    
    // Column 4 - Status Highlight
    let col4Y = yPos;
    col4Y = addSectionHeader('STATUS', col4X, col4Y);
    
    // Status Card - Compact
    doc.setDrawColor(...orange600);
    doc.setLineWidth(0.8);
    doc.roundedRect(col4X, col4Y, colWidth, 18, 2, 2, 'S');
    
    doc.setTextColor(...textLight);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('CURRENT', col4X + 22.5, col4Y + 6, { align: 'center' });
    
    // Status text
    const statusText = capitalize(faculty.status);
    doc.setTextColor(...orange600);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(statusText, col4X + 22.5, col4Y + 14, { align: 'center' });
    
    col4Y += 22;
    
    // Calculate max Y position from all columns
    const maxColY = Math.max(col1Y, col2Y, col3Y, col4Y);
    yPos = maxColY + 6;
    
    // Full width sections - Enhanced Design
    const remainingSpace = 270 - yPos;
    
    // Notes Section - Enhanced with icon-like design
    if (faculty.notes && yPos < 270) {
      // Section header with background
      doc.setFillColor(255, 247, 237); // Orange-50
      doc.roundedRect(margin, yPos, contentWidth, 7, 1, 1, 'F');
      
      doc.setFillColor(...orange600);
      doc.circle(margin + 2.5, yPos + 3.5, 1.5, 'F');
      
      doc.setTextColor(...orange700);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('ADDITIONAL NOTES', margin + 6, yPos + 4.5);
      
      yPos += 9;
      
      const notesHeight = Math.min(remainingSpace - 9, 270 - yPos);
      
      // Content box with subtle background
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...orange600);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, yPos, contentWidth, notesHeight, 2, 2, 'FD');
      
      // Add decorative left border
      doc.setFillColor(...orange600);
      doc.rect(margin + 1, yPos + 1, 1, notesHeight - 2, 'F');
      
      doc.setTextColor(...textDark);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const notesLines = doc.splitTextToSize(faculty.notes, contentWidth - 8);
      doc.text(notesLines, margin + 4, yPos + 4);
      
      yPos += notesHeight + 3;
    }
    
    // Footer - Professional and minimal
    const footerY = pageHeight - 12;
    doc.setDrawColor(...orange600);
    doc.setLineWidth(1);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    
    doc.setTextColor(...textLight);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('© Faculty Data Management System', margin, footerY + 4);
    
    doc.setTextColor(...orange700);
    doc.setFont('helvetica', 'bold');
    doc.text('CONFIDENTIAL DOCUMENT', pageWidth - margin, footerY + 4, { align: 'right' });
    
    // Save PDF
    const filename = `faculty_report_${faculty.faculty_id || faculty.id}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    return filename;
  } catch (error) {
    throw new Error('Failed to generate PDF report');
  }
};

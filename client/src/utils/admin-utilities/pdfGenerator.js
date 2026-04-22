/**
 * Professional PDF Generator for Student Reports
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
 * Generate and download a student profile PDF report
 * @param {Object} student - Student data object
 */
export const generateStudentPDF = async (student) => {
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
      console.warn('Logo could not be loaded');
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
    
    const formatGPA = (gpa) => {
      if (!gpa && gpa !== 0) return 'N/A';
      const gpaNumber = parseFloat(gpa);
      if (isNaN(gpaNumber)) return 'N/A';
      return gpaNumber.toFixed(2);
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
    doc.text('STUDENT PROFILE REPORT', logoData ? margin + 25 : margin, 16);
    
    doc.setTextColor(...textMedium);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Student Data Profiling System', logoData ? margin + 25 : margin, 22);
    
    // Date and ID on the right
    doc.setTextColor(...textLight);
    doc.setFontSize(7);
    doc.text(`Generated: ${formatDate(new Date())}`, pageWidth - margin, 14, { align: 'right' });
    
    doc.setTextColor(...textMedium);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`ID: ${student.student_id || student.id}`, pageWidth - margin, 20, { align: 'right' });
    
    // Status badge
    const statusColors = {
      active: [16, 185, 129],
      inactive: [239, 68, 68],
      suspended: [245, 158, 11]
    };
    const statusColor = statusColors[student.status?.toLowerCase()] || [107, 114, 128];
    doc.setFillColor(...statusColor);
    doc.roundedRect(pageWidth - margin - 28, 24, 28, 6, 2, 2, 'F');
    doc.setTextColor(...white);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(capitalize(student.status), pageWidth - margin - 14, 28, { align: 'center' });
    
    // Orange accent line
    doc.setDrawColor(...orange600);
    doc.setLineWidth(1.5);
    doc.line(margin, 35, pageWidth - margin, 35);
    
    let yPos = 42;
    
    // Student Name Section - Compact
    doc.setTextColor(...textDark);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(student.name || 'N/A', margin, yPos);
    
    // Email next to name
    doc.setTextColor(...textMedium);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(student.email || 'N/A', margin, yPos + 5);
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
    col1Y = addField('Phone', student.phone, col1X, col1Y);
    col1Y = addField('Address', student.address, col1X, col1Y + 1);
    
    // Column 2 - Guardian Information
    let col2Y = yPos;
    col2Y = addSectionHeader('GUARDIAN', col2X, col2Y);
    col2Y = addField('Name', student.guardian_name, col2X, col2Y);
    col2Y = addField('Phone', student.guardian_phone, col2X, col2Y + 1);
    
    // Column 3 - Academic Information
    let col3Y = yPos;
    col3Y = addSectionHeader('ACADEMIC', col3X, col3Y);
    col3Y = addField('Program', student.program, col3X, col3Y);
    col3Y = addField('Year', student.year_level, col3X, col3Y + 1);
    col3Y = addField('Enrolled', formatDate(student.enrollment_date), col3X, col3Y + 1);
    col3Y = addField('Graduates', formatDate(student.graduation_date), col3X, col3Y + 1);
    
    // Column 4 - GPA Highlight
    let col4Y = yPos;
    col4Y = addSectionHeader('GPA', col4X, col4Y);
    
    // GPA Card - Compact
    doc.setDrawColor(...orange600);
    doc.setLineWidth(0.8);
    doc.roundedRect(col4X, col4Y, colWidth, 18, 2, 2, 'S');
    
    doc.setTextColor(...textLight);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('CURRENT', col4X + 22.5, col4Y + 6, { align: 'center' });
    
    doc.setTextColor(...orange600);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(formatGPA(student.gpa), col4X + 22.5, col4Y + 14, { align: 'center' });
    
    col4Y += 22;
    
    // Calculate max Y position from all columns
    const maxColY = Math.max(col1Y, col2Y, col3Y, col4Y);
    yPos = maxColY + 6;
    
    // Full width sections - Enhanced Design
    const remainingSpace = 270 - yPos;
    
    // Count how many sections we have
    const sectionsCount = [student.skills, student.extracurricular_activities, student.notes].filter(Boolean).length;
    const sectionHeight = sectionsCount > 0 ? Math.floor(remainingSpace / sectionsCount) - 3 : 0;
    
    // Skills Section - Enhanced with icon-like design
    if (student.skills) {
      // Section header with background
      doc.setFillColor(255, 247, 237); // Orange-50
      doc.roundedRect(margin, yPos, contentWidth, 7, 1, 1, 'F');
      
      doc.setFillColor(...orange600);
      doc.circle(margin + 2.5, yPos + 3.5, 1.5, 'F');
      
      doc.setTextColor(...orange700);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('SKILLS & COMPETENCIES', margin + 6, yPos + 4.5);
      
      yPos += 9;
      
      // Content box with subtle background
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...orange600);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, yPos, contentWidth, sectionHeight - 9, 2, 2, 'FD');
      
      // Add decorative left border
      doc.setFillColor(...orange600);
      doc.rect(margin + 1, yPos + 1, 1, sectionHeight - 11, 'F');
      
      doc.setTextColor(...textDark);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const skillLines = doc.splitTextToSize(student.skills, contentWidth - 8);
      doc.text(skillLines, margin + 4, yPos + 4);
      
      yPos += sectionHeight - 9 + 3;
    }
    
    // Activities Section - Enhanced with icon-like design
    if (student.extracurricular_activities) {
      // Section header with background
      doc.setFillColor(255, 247, 237); // Orange-50
      doc.roundedRect(margin, yPos, contentWidth, 7, 1, 1, 'F');
      
      doc.setFillColor(...orange600);
      doc.circle(margin + 2.5, yPos + 3.5, 1.5, 'F');
      
      doc.setTextColor(...orange700);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('EXTRACURRICULAR ACTIVITIES', margin + 6, yPos + 4.5);
      
      yPos += 9;
      
      // Content box with subtle background
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...orange600);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, yPos, contentWidth, sectionHeight - 9, 2, 2, 'FD');
      
      // Add decorative left border
      doc.setFillColor(...orange600);
      doc.rect(margin + 1, yPos + 1, 1, sectionHeight - 11, 'F');
      
      doc.setTextColor(...textDark);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const activityLines = doc.splitTextToSize(student.extracurricular_activities, contentWidth - 8);
      doc.text(activityLines, margin + 4, yPos + 4);
      
      yPos += sectionHeight - 9 + 3;
    }
    
    // Notes Section - Enhanced with icon-like design
    if (student.notes && yPos < 270) {
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
      
      const notesHeight = Math.min(sectionHeight - 9, 270 - yPos);
      
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
      const notesLines = doc.splitTextToSize(student.notes, contentWidth - 8);
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
    doc.text('© Student Data Profiling System', margin, footerY + 4);
    
    doc.setTextColor(...textMedium);
    doc.text('Page 1 of 2', pageWidth / 2, footerY + 4, { align: 'center' });
    
    doc.setTextColor(...orange700);
    doc.setFont('helvetica', 'bold');
    doc.text('CONFIDENTIAL DOCUMENT', pageWidth - margin, footerY + 4, { align: 'right' });
    
    // ============================================
    // PAGE 2: VIOLATIONS, AFFILIATIONS & ACADEMIC HISTORY
    // ============================================
    doc.addPage();
    
    // Header Section - Page 2
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
    doc.text('STUDENT RECORDS', logoData ? margin + 25 : margin, 16);
    
    doc.setTextColor(...textMedium);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Violations, Affiliations & Academic History', logoData ? margin + 25 : margin, 22);
    
    // Student name and ID on the right
    doc.setTextColor(...textDark);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(student.name || 'N/A', pageWidth - margin, 14, { align: 'right' });
    doc.setTextColor(...textMedium);
    doc.text(`ID: ${student.student_id || student.id}`, pageWidth - margin, 20, { align: 'right' });
    
    // Orange accent line
    doc.setDrawColor(...orange600);
    doc.setLineWidth(1.5);
    doc.line(margin, 35, pageWidth - margin, 35);
    
    let page2Y = 42;
    
    // Helper function to add table header
    const addTableHeader = (headers, x, y, columnWidths) => {
      let currentX = x;
      headers.forEach((header, index) => {
        // Draw background for each header cell
        doc.setFillColor(...orange600);
        doc.rect(currentX, y, columnWidths[index], 6, 'F');
        
        // Add text for each header
        doc.setTextColor(...white);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        const headerLines = doc.splitTextToSize(header, columnWidths[index] - 2);
        doc.text(headerLines[0], currentX + 1, y + 4);
        
        currentX += columnWidths[index];
      });
      return y + 6;
    };
    
    // Helper function to add table row
    const addTableRow = (values, x, y, columnWidths, isAlternate = false) => {
      if (isAlternate) {
        doc.setFillColor(255, 247, 237); // Orange-50
        let currentX = x;
        columnWidths.forEach(width => {
          doc.rect(currentX, y, width, 6, 'F');
          currentX += width;
        });
      }
      
      doc.setTextColor(...textDark);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      let currentX = x;
      values.forEach((value, index) => {
        const lines = doc.splitTextToSize(value || 'N/A', columnWidths[index] - 2);
        doc.text(lines[0], currentX + 1, y + 4);
        currentX += columnWidths[index];
      });
      return y + 6;
    };
    
    // VIOLATIONS SECTION
    doc.setFillColor(255, 247, 237); // Orange-50
    doc.roundedRect(margin, page2Y, contentWidth, 7, 1, 1, 'F');
    
    doc.setFillColor(...orange600);
    doc.circle(margin + 2.5, page2Y + 3.5, 1.5, 'F');
    
    doc.setTextColor(...orange700);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('VIOLATIONS', margin + 6, page2Y + 4.5);
    
    page2Y += 9;
    
    const violations = student.violations || [];
    if (violations.length > 0) {
      const violationHeaders = ['Violation Type', 'Severity', 'Date', 'Action Taken'];
      const violationWidths = [50, 25, 30, 81];
      
      page2Y = addTableHeader(violationHeaders, margin, page2Y, violationWidths);
      
      violations.slice(0, 6).forEach((violation, index) => {
        const violationType = violation.violation_type || 'N/A';
        const severity = capitalize(violation.severity);
        const violationDate = formatDate(violation.violation_date);
        const action = violation.action_taken || 'N/A';
        
        page2Y = addTableRow(
          [violationType, severity, violationDate, action],
          margin,
          page2Y,
          violationWidths,
          index % 2 === 1
        );
      });
      
      if (violations.length > 6) {
        doc.setTextColor(...textLight);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'italic');
        doc.text(`+ ${violations.length - 6} more violation(s)`, margin, page2Y + 3);
        page2Y += 5;
      }
    } else {
      doc.setTextColor(...textMedium);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('No violations recorded', margin + 2, page2Y + 4);
      page2Y += 8;
    }
    
    page2Y += 4;
    
    // AFFILIATIONS SECTION
    doc.setFillColor(255, 247, 237); // Orange-50
    doc.roundedRect(margin, page2Y, contentWidth, 7, 1, 1, 'F');
    
    doc.setFillColor(...orange600);
    doc.circle(margin + 2.5, page2Y + 3.5, 1.5, 'F');
    
    doc.setTextColor(...orange700);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('AFFILIATIONS & ORGANIZATIONS', margin + 6, page2Y + 4.5);
    
    page2Y += 9;
    
    const affiliations = student.affiliations || [];
    if (affiliations.length > 0) {
      const affiliationHeaders = ['Organization Name', 'Type', 'Role', 'Status'];
      const affiliationWidths = [60, 40, 40, 46];
      
      page2Y = addTableHeader(affiliationHeaders, margin, page2Y, affiliationWidths);
      
      affiliations.slice(0, 6).forEach((affiliation, index) => {
        const orgName = affiliation.organization_name || 'N/A';
        const type = capitalize(affiliation.affiliation_type?.replace(/_/g, ' ')) || 'N/A';
        const role = affiliation.role || 'Member';
        const status = affiliation.is_active ? 'Active' : 'Inactive';
        
        page2Y = addTableRow(
          [orgName, type, role, status],
          margin,
          page2Y,
          affiliationWidths,
          index % 2 === 1
        );
      });
      
      if (affiliations.length > 6) {
        doc.setTextColor(...textLight);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'italic');
        doc.text(`+ ${affiliations.length - 6} more affiliation(s)`, margin, page2Y + 3);
        page2Y += 5;
      }
    } else {
      doc.setTextColor(...textMedium);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('No affiliations recorded', margin + 2, page2Y + 4);
      page2Y += 8;
    }
    
    page2Y += 4;
    
    // ACADEMIC HISTORY SECTION
    if (page2Y < 240) {
      doc.setFillColor(255, 247, 237); // Orange-50
      doc.roundedRect(margin, page2Y, contentWidth, 7, 1, 1, 'F');
      
      doc.setFillColor(...orange600);
      doc.circle(margin + 2.5, page2Y + 3.5, 1.5, 'F');
      
      doc.setTextColor(...orange700);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('ACADEMIC HISTORY', margin + 6, page2Y + 4.5);
      
      page2Y += 9;
      
      const academicRecords = student.academic_records || [];
      if (academicRecords.length > 0) {
        // Display each academic record with its subjects
        academicRecords.slice(0, 3).forEach((record, recordIndex) => {
          // Check if we have space
          if (page2Y > 250) return;
          
          // Record header with semester info
          doc.setFillColor(...orange600);
          doc.roundedRect(margin, page2Y, contentWidth, 7, 1, 1, 'F');
          
          doc.setTextColor(...white);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          const semesterText = `${record.semester || 'N/A'} — ${record.academic_year || 'N/A'}`;
          doc.text(semesterText, margin + 2, page2Y + 4.5);
          
          // GPA and Status on the right
          const gpaText = `GPA: ${formatGPA(record.semester_gpa)}`;
          const statusText = record.remarks || 'N/A';
          doc.text(`${gpaText}  |  ${statusText}`, pageWidth - margin - 2, page2Y + 4.5, { align: 'right' });
          
          page2Y += 7;
          
          // Subjects table
          const subjects = record.subjects || [];
          if (subjects.length > 0) {
            // Subject headers
            const subjectHeaders = ['Subject Code', 'Subject Name', 'Units', 'Grade'];
            const subjectWidths = [35, 95, 20, 36];
            
            // Draw header background and text for each column
            let currentX = margin;
            subjectHeaders.forEach((header, index) => {
              // Draw background
              doc.setFillColor(255, 237, 213); // Lighter orange
              doc.rect(currentX, page2Y, subjectWidths[index], 5, 'F');
              
              // Add text
              doc.setTextColor(...textDark);
              doc.setFontSize(6);
              doc.setFont('helvetica', 'bold');
              const headerLines = doc.splitTextToSize(header, subjectWidths[index] - 2);
              doc.text(headerLines[0], currentX + 1, page2Y + 3.5);
              
              currentX += subjectWidths[index];
            });
            
            page2Y += 5;
            
            // Subject rows
            subjects.slice(0, 5).forEach((subject, subIndex) => {
              if (page2Y > 260) return;
              
              if (subIndex % 2 === 1) {
                doc.setFillColor(255, 251, 245); // Very light orange
                let currentX = margin;
                subjectWidths.forEach(width => {
                  doc.rect(currentX, page2Y, width, 5, 'F');
                  currentX += width;
                });
              }
              
              doc.setTextColor(...textDark);
              doc.setFontSize(7);
              doc.setFont('helvetica', 'normal');
              
              let currentX = margin;
              const subjectCode = subject.subject_code || 'N/A';
              const subjectName = subject.subject_name || 'N/A';
              const units = subject.units ? subject.units.toString() : 'N/A';
              const grade = subject.grade ? subject.grade.toString() : 'N/A';
              
              // Subject Code
              const codeLines = doc.splitTextToSize(subjectCode, subjectWidths[0] - 2);
              doc.text(codeLines[0], currentX + 1, page2Y + 3.5);
              currentX += subjectWidths[0];
              
              // Subject Name
              const nameLines = doc.splitTextToSize(subjectName, subjectWidths[1] - 2);
              doc.text(nameLines[0], currentX + 1, page2Y + 3.5);
              currentX += subjectWidths[1];
              
              // Units
              doc.text(units, currentX + 1, page2Y + 3.5);
              currentX += subjectWidths[2];
              
              // Grade
              doc.text(grade, currentX + 1, page2Y + 3.5);
              
              page2Y += 5;
            });
            
            if (subjects.length > 5) {
              doc.setTextColor(...textLight);
              doc.setFontSize(6);
              doc.setFont('helvetica', 'italic');
              doc.text(`+ ${subjects.length - 5} more subject(s)`, margin + 2, page2Y + 3);
              page2Y += 4;
            }
          } else {
            doc.setTextColor(...textMedium);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'italic');
            doc.text('No subjects recorded', margin + 2, page2Y + 3);
            page2Y += 5;
          }
          
          page2Y += 3; // Space between records
        });
        
        if (academicRecords.length > 3) {
          doc.setTextColor(...textLight);
          doc.setFontSize(6);
          doc.setFont('helvetica', 'italic');
          doc.text(`+ ${academicRecords.length - 3} more academic record(s)`, margin, page2Y + 2);
        }
      } else {
        doc.setTextColor(...textMedium);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text('No academic records available', margin + 2, page2Y + 4);
      }
    }
    
    // Footer - Page 2
    const footer2Y = pageHeight - 12;
    doc.setDrawColor(...orange600);
    doc.setLineWidth(1);
    doc.line(margin, footer2Y, pageWidth - margin, footer2Y);
    
    doc.setTextColor(...textLight);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('© Student Data Profiling System', margin, footer2Y + 4);
    
    doc.setTextColor(...textMedium);
    doc.text('Page 2 of 2', pageWidth / 2, footer2Y + 4, { align: 'center' });
    
    doc.setTextColor(...orange700);
    doc.setFont('helvetica', 'bold');
    doc.text('CONFIDENTIAL DOCUMENT', pageWidth - margin, footer2Y + 4, { align: 'right' });
    
    // Save PDF
    const filename = `student_report_${student.student_id || student.id}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    return filename;
  } catch (error) {
    throw new Error('Failed to generate PDF report');
  }
};

/**
 * Generate and download multiple student reports as a single PDF
 * @param {Array} students - Array of student objects
 */
export const generateBulkStudentPDF = async (students) => {
  try {
    const doc = new jsPDF();
    
    const primaryColor = [234, 88, 12];
    const textColor = [31, 41, 55];
    
    // Title page
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('STUDENT REPORTS', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Students: ${students.length}`, 105, 30, { align: 'center' });
    
    // Generate a page for each student
    students.forEach((student, index) => {
      if (index > 0) {
        doc.addPage();
      }
      
      // Simple student info per page
      let y = 20;
      
      doc.setTextColor(...textColor);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(student.name || 'N/A', 20, y);
      y += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Student ID: ${student.student_id || student.id}`, 20, y);
      y += 7;
      doc.text(`Email: ${student.email || 'N/A'}`, 20, y);
      y += 7;
      doc.text(`Program: ${student.program || 'N/A'}`, 20, y);
      y += 7;
      doc.text(`Year Level: ${student.year_level || 'N/A'}`, 20, y);
      y += 7;
      doc.text(`GPA: ${student.gpa || 'N/A'}`, 20, y);
      y += 7;
      doc.text(`Status: ${student.status || 'N/A'}`, 20, y);
    });
    
    // Save
    const filename = `student_reports_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    return filename;
  } catch (error) {
    throw new Error('Failed to generate bulk PDF report');
  }
};

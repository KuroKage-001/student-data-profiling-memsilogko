import { pdf } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles for individual faculty report
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: 3,
    borderBottomColor: '#f97316',
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f97316',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: 2,
    borderBottomColor: '#fed7aa',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: '35%',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
  },
  value: {
    width: '65%',
    fontSize: 11,
    color: '#1f2937',
  },
  notesBox: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 4,
    borderLeft: 3,
    borderLeftColor: '#f97316',
    marginTop: 8,
  },
  notesText: {
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 9,
    borderTop: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusActive: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  statusInactive: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  statusOnLeave: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
});

// Create Document Component for individual faculty report
const FacultyReportDocument = ({ faculty, generatedDate }) => {
  const getStatusStyle = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'active':
        return styles.statusActive;
      case 'inactive':
        return styles.statusInactive;
      case 'on leave':
        return styles.statusOnLeave;
      default:
        return styles.statusActive;
    }
  };

  const capitalize = (str) => {
    if (!str) return 'N/A';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Faculty Profile Report</Text>
          <Text style={styles.subtitle}>
            {faculty.name} - {faculty.faculty_id || faculty.id}
          </Text>
          <Text style={styles.subtitle}>Generated on: {generatedDate}</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>{faculty.name || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Faculty ID:</Text>
            <Text style={styles.value}>{faculty.faculty_id || faculty.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{faculty.email || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{faculty.phone || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{faculty.address || 'N/A'}</Text>
          </View>
        </View>

        {/* Professional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>{faculty.department || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Position:</Text>
            <Text style={styles.value}>{faculty.position || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Specialization:</Text>
            <Text style={styles.value}>{faculty.specialization || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Office:</Text>
            <Text style={styles.value}>{faculty.office || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{capitalize(faculty.status)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Hire Date:</Text>
            <Text style={styles.value}>{formatDate(faculty.hire_date || faculty.hireDate)}</Text>
          </View>
        </View>

        {/* Additional Notes */}
        {faculty.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>{faculty.notes}</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Faculty Profiles Management System - Confidential Document</Text>
          <Text>This document contains sensitive information and should be handled accordingly.</Text>
        </View>
      </Page>
    </Document>
  );
};

// Export function for individual faculty report
export const generateFacultyPDF = async (faculty) => {
  try {
    const generatedDate = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Generate PDF
    const blob = await pdf(
      <FacultyReportDocument faculty={faculty} generatedDate={generatedDate} />
    ).toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const date = new Date().toISOString().split('T')[0];
    const facultyId = faculty.faculty_id || faculty.id;
    link.download = `Faculty_Report_${facultyId}_${date}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);

    return { success: true, filename: link.download };
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
};

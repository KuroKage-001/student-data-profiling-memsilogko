import { pdf } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#f97316',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 3,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    minHeight: 25,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#d1d5db',
  },
  tableCol: {
    padding: 5,
    fontSize: 8,
  },
  col1: { width: '5%' },   // No.
  col2: { width: '10%' },  // Faculty ID
  col3: { width: '15%' },  // Name
  col4: { width: '12%' },  // Department
  col5: { width: '12%' },  // Position
  col6: { width: '12%' },  // Email
  col7: { width: '10%' },  // Phone
  col8: { width: '12%' },  // Specialization
  col9: { width: '7%' },   // Status
  col10: { width: '5%' },  // Office
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 8,
    borderTop: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
});

// Create Document Component
const FacultyPDFDocument = ({ faculty, generatedDate }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Faculty Profiles Report</Text>
        <Text style={styles.subtitle}>Total Faculty Members: {faculty.length}</Text>
        <Text style={styles.subtitle}>Generated on: {generatedDate}</Text>
      </View>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCol, styles.col1]}>No.</Text>
          <Text style={[styles.tableCol, styles.col2]}>Faculty ID</Text>
          <Text style={[styles.tableCol, styles.col3]}>Name</Text>
          <Text style={[styles.tableCol, styles.col4]}>Department</Text>
          <Text style={[styles.tableCol, styles.col5]}>Position</Text>
          <Text style={[styles.tableCol, styles.col6]}>Email</Text>
          <Text style={[styles.tableCol, styles.col7]}>Phone</Text>
          <Text style={[styles.tableCol, styles.col8]}>Specialization</Text>
          <Text style={[styles.tableCol, styles.col9]}>Status</Text>
          <Text style={[styles.tableCol, styles.col10]}>Office</Text>
        </View>

        {/* Table Rows */}
        {faculty.map((member, index) => (
          <View key={member.id} style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.col1]}>{index + 1}</Text>
            <Text style={[styles.tableCol, styles.col2]}>{member.faculty_id || member.id}</Text>
            <Text style={[styles.tableCol, styles.col3]}>{member.name}</Text>
            <Text style={[styles.tableCol, styles.col4]}>{member.department || 'N/A'}</Text>
            <Text style={[styles.tableCol, styles.col5]}>{member.position || 'N/A'}</Text>
            <Text style={[styles.tableCol, styles.col6]}>{member.email || 'N/A'}</Text>
            <Text style={[styles.tableCol, styles.col7]}>{member.phone || 'N/A'}</Text>
            <Text style={[styles.tableCol, styles.col8]}>{member.specialization || 'N/A'}</Text>
            <Text style={[styles.tableCol, styles.col9]}>
              {member.status ? member.status.charAt(0).toUpperCase() + member.status.slice(1) : 'N/A'}
            </Text>
            <Text style={[styles.tableCol, styles.col10]}>{member.office || 'N/A'}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Faculty Profiles Management System - Confidential Document</Text>
      </View>
    </Page>
  </Document>
);

// Export function
export const exportFacultyToPDF = async (faculty) => {
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
      <FacultyPDFDocument faculty={faculty} generatedDate={generatedDate} />
    ).toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const date = new Date().toISOString().split('T')[0];
    link.download = `Faculty_List_${date}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);

    return { success: true, filename: link.download };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

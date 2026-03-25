import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#EA580C',
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerText: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EA580C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: '#6B7280',
  },
  studentInfo: {
    backgroundColor: '#FFF7ED',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#EA580C',
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#FED7AA',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C2410C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: '#6B7280',
    width: '35%',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 10,
    color: '#1F2937',
    width: '65%',
  },
  twoColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  column: {
    flex: 1,
  },
  statsBox: {
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#C2410C',
  },
  statsLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EA580C',
  },
  notesBox: {
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  notesText: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#9CA3AF',
  },
  footerBrand: {
    fontSize: 8,
    color: '#EA580C',
    fontWeight: 'bold',
  },
});

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatGPA = (gpa) => {
  if (!gpa && gpa !== 0) return 'N/A';
  const gpaNumber = parseFloat(gpa);
  if (isNaN(gpaNumber)) return 'N/A';
  return gpaNumber.toFixed(2);
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return '#10B981';
    case 'inactive':
      return '#EF4444';
    case 'suspended':
      return '#F59E0B';
    default:
      return '#6B7280';
  }
};

// PDF Document Component
const StudentProfilePDF = ({ student }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            src="/ccs-logo.png" 
            style={styles.logo}
          />
          <View style={styles.headerText}>
            <Text style={styles.title}>Student Profile Report</Text>
            <Text style={styles.subtitle}>Comprehensive Academic & Personal Information</Text>
          </View>
        </View>

        {/* Student Info Card */}
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{student.name || 'N/A'}</Text>
          <Text style={styles.studentId}>Student ID: {student.student_id || student.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(student.status) }]}>
            <Text>{student.status ? student.status.toUpperCase() : 'UNKNOWN'}</Text>
          </View>
        </View>

        {/* Two Column Layout */}
        <View style={styles.twoColumn}>
          {/* Left Column */}
          <View style={styles.column}>
            {/* Personal Information */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{student.email || 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{student.phone || 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{student.address || 'N/A'}</Text>
              </View>
            </View>

            {/* Academic Information */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Academic Information</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Program:</Text>
                <Text style={styles.value}>{student.program || 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Year Level:</Text>
                <Text style={styles.value}>{student.year_level || 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Enrollment:</Text>
                <Text style={styles.value}>{formatDate(student.enrollment_date)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Expected Grad:</Text>
                <Text style={styles.value}>{formatDate(student.graduation_date)}</Text>
              </View>
            </View>

            {/* Guardian Information */}
            {(student.guardian_name || student.guardian_phone) && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Guardian Information</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{student.guardian_name || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Phone:</Text>
                  <Text style={styles.value}>{student.guardian_phone || 'N/A'}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Right Column */}
          <View style={styles.column}>
            {/* GPA Stats */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Academic Performance</Text>
              </View>
              <View style={styles.statsBox}>
                <Text style={styles.statsLabel}>Current GPA</Text>
                <Text style={styles.statsValue}>{formatGPA(student.gpa)}</Text>
              </View>
            </View>

            {/* Skills */}
            {student.skills && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Skills</Text>
                </View>
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>{student.skills}</Text>
                </View>
              </View>
            )}

            {/* Extracurricular Activities */}
            {student.extracurricular_activities && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Activities</Text>
                </View>
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>{student.extracurricular_activities}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Additional Notes */}
        {student.notes && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Additional Notes</Text>
            </View>
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>{student.notes}</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated on {currentDate}</Text>
          <Text style={styles.footerBrand}>Student Data Profiling System</Text>
        </View>
      </Page>
    </Document>
  );
};

export default StudentProfilePDF;

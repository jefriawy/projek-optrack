import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { PdfHeader, PdfFooter } from './PdfHeaderFooter';

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 32,
    backgroundColor: "#fff"
  },
  // header dan headerTitle dihapus, gunakan PdfHeader
  section: {
    marginBottom: 18,
    padding: 18,
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    backgroundColor: "#f9fafb"
  },
  twoColumns: {
    display: 'flex',
    flexDirection: 'row',
    gap: 24,
    marginBottom: 12,
  },
  column: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  infoGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
    color: "#374151",
    minWidth: 110,
    fontSize: 11,
  },
  value: {
    color: "#111827",
    fontSize: 11,
    flex: 1,
  },
  kebutuhanCard: {
    backgroundColor: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  kebutuhanLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#374151',
    fontSize: 11,
  },
  kebutuhanText: {
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    color: '#374151',
    padding: 10,
    minHeight: 40,
    fontSize: 11,
  },
});

const OptiDetailPdf = ({ opti }) => (
  <Document>
    <Page size="A4" style={styles.page}>
  <PdfHeader title="DATA OPPORTUNITY" subtitle="Laporan Detail Opportunity" />
      <View style={styles.section}>
        <View style={styles.twoColumns}>
          <View style={styles.column}>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>Nama Opti:</Text>
              <Text style={styles.value}>{opti && opti.nmOpti ? opti.nmOpti : "-"}</Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>Customer:</Text>
              <Text style={styles.value}>{opti && opti.nmCustomer ? opti.nmCustomer : "-"}</Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>Kontak Person:</Text>
              <Text style={styles.value}>{opti && opti.contactOpti ? opti.contactOpti : "-"}</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{opti && opti.statOpti ? opti.statOpti : "-"}</Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>Sumber:</Text>
              <Text style={styles.value}>{opti && opti.nmSumber ? opti.nmSumber : "-"}</Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>Tanggal Proposal:</Text>
              <Text style={styles.value}>{opti && opti.datePropOpti ? new Date(opti.datePropOpti).toLocaleDateString("id-ID") : "-"}</Text>
            </View>
          </View>
        </View>
        <View style={styles.kebutuhanCard}>
          <Text style={styles.kebutuhanLabel}>Kebutuhan:</Text>
          <Text style={styles.kebutuhanText}>{opti && opti.kebutuhan ? opti.kebutuhan : "Tidak ada deskripsi."}</Text>
        </View>
      </View>
      <PdfFooter />
    </Page>
  </Document>
);

export default OptiDetailPdf;
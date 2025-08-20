import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 32,
    backgroundColor: "#fff"
  },
  header: {
    backgroundColor: "#111827",
    color: "white",
    padding: 16,
    textAlign: "center",
    marginBottom: 24,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  section: {
    marginBottom: 12,
    padding: 12,
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    backgroundColor: "#f9fafb"
  },
  label: {
    fontWeight: "bold",
    color: "#374151",
    minWidth: 120,
    display: "inline-block"
  },
  value: {
    color: "#111827",
    marginLeft: 8,
    display: "inline-block"
  },
  kebutuhan: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    color: "#374151"
  },
});

const OptiDetailPdf = ({ opti }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Opportunity Detail Report</Text>
      </View>
      <View style={styles.section}>
        <Text><Text style={styles.label}>Nama Opti:</Text> <Text style={styles.value}>{opti && opti.nmOpti ? opti.nmOpti : "-"}</Text></Text>
        <Text><Text style={styles.label}>Customer:</Text> <Text style={styles.value}>{opti && opti.nmCustomer ? opti.nmCustomer : "-"}</Text></Text>
        <Text><Text style={styles.label}>Kontak Person:</Text> <Text style={styles.value}>{opti && opti.contactOpti ? opti.contactOpti : "-"}</Text></Text>
        <Text><Text style={styles.label}>Status:</Text> <Text style={styles.value}>{opti && opti.statOpti ? opti.statOpti : "-"}</Text></Text>
        <Text><Text style={styles.label}>Sumber:</Text> <Text style={styles.value}>{opti && opti.nmSumber ? opti.nmSumber : "-"}</Text></Text>
        <Text><Text style={styles.label}>Tanggal Proposal:</Text> <Text style={styles.value}>{opti && opti.datePropOpti ? new Date(opti.datePropOpti).toLocaleDateString("id-ID") : "-"}</Text></Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Kebutuhan:</Text>
        <Text style={styles.kebutuhan}>{opti && opti.kebutuhan ? opti.kebutuhan : "Tidak ada deskripsi."}</Text>
      </View>
    </Page>
  </Document>
);

export default OptiDetailPdf;
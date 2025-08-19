// frontend/src/components/OptiListPdf.js
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, padding: 30 },
  header: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Helvetica-Bold",
  },
  table: { display: "table", width: "auto" },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  tableHeader: { backgroundColor: "#f2f2f2", fontFamily: "Helvetica-Bold" },
  tableCol: { width: "25%", padding: 5 },
  tableCell: { margin: 5, fontSize: 9 },
});

const OptiListPdf = ({ optis }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Laporan Opportunity (OPTI)</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Nama Opti</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Customer</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Tanggal</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Status</Text>
          </View>
        </View>
        {optis.map((opti) => (
          <View style={styles.tableRow} key={opti.idOpti}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{opti.nmOpti}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{opti.nmCustomer}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {new Date(opti.datePropOpti).toLocaleDateString("id-ID")}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{opti.statOpti}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default OptiListPdf;
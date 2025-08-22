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

// Format tanggal manual agar kompatibel dengan React PDF
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Mapping status lama ke status baru
const getDisplayStatus = (status) => {
  switch (status) {
    case "Prospect":
    case "Follow Up":
      return "Follow Up";
    case "Negotiation":
    case "On-Progress":
      return "On-Progress";
    case "Closed-Won":
    case "Success":
      return "Success";
    case "Closed-Lost":
    case "Failed":
      return "Failed";
    case "Just Get Info":
      return "Just Get Info";
    default:
      return status || "-";
  }
};

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
        {optis && optis.length > 0 ? (
          optis.map((opti) => (
            <View style={styles.tableRow} key={opti.idOpti}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{opti.nmOpti}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{opti.nmCustomer}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {formatDate(opti.datePropOpti)}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{getDisplayStatus(opti.statOpti)}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, width: '100%' }}>
              <Text style={{ ...styles.tableCell, textAlign: 'center' }}>No data available</Text>
            </View>
          </View>
        )}
      </View>
    </Page>
  </Document>
);

export default OptiListPdf;
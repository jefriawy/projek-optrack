// frontend/src/components/ExpertListPdf.js
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { PdfHeader, PdfFooter } from './PdfHeaderFooter';

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 30,
    backgroundColor: "#ffffff",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#d1d5db',
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
    fontFamily: "Helvetica-Bold",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#d1d5db',
    padding: 8,
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#d1d5db',
    padding: 8,
  },
  tableCell: {
    margin: "auto",
    fontSize: 9,
    textAlign: "left",
  },
});

const ExpertListPdf = ({ experts }) => {
  const dataToDisplay = Array.isArray(experts) ? experts : [experts];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PdfHeader title="DATA EXPERT" subtitle="Laporan Data Expert" />

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Nama Expert</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Nomor Telepon</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Email</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Total Project</Text>
            </View>
          </View>
          {dataToDisplay.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.nmExpert}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.mobileExpert || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.emailExpert || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.totalProjects || 0}</Text>
              </View>
            </View>
          ))}
        </View>
        <PdfFooter />
      </Page>
    </Document>
  );
};

export default ExpertListPdf;

// frontend/src/components/SalesListPdf.js
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
  // header and headerTitle removed, now using PdfHeader
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
    width: "25%", // Diubah agar seimbang
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#d1d5db',
    padding: 8,
  },
  tableCol: {
    width: "25%", // Diubah agar seimbang
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
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 9,
    color: 'grey',
  },
});

const SalesListPdf = ({ sales }) => {
  const isMultipleSales = Array.isArray(sales);
  const dataToDisplay = isMultipleSales ? sales : [sales];
  const totalCustomersSum = dataToDisplay.reduce((sum, current) => sum + (current.totalCustomer || 0), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
  <PdfHeader title="DATA SALES" subtitle="Laporan Data Sales" />

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Nama Sales</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Nomor Telepon</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Email</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Total Customer</Text>
            </View>
          </View>
          {dataToDisplay.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.nmSales}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.mobileSales || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.emailSales || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.totalCustomer || 0}</Text>
              </View>
            </View>
          ))}
          {isMultipleSales && (
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, { width: "75%", textAlign: "right", borderLeftWidth: 1 }]}>
                <Text style={styles.tableCell}>Total Keseluruhan:</Text>
              </View>
              <View style={[styles.tableColHeader, { width: "25%" }]}>
                <Text style={styles.tableCell}>{totalCustomersSum}</Text>
              </View>
            </View>
          )}
        </View>
  <PdfFooter />
      </Page>
    </Document>
  );
};

export default SalesListPdf;
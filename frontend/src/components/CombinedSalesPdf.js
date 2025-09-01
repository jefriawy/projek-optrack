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
    marginBottom: 20,
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
  title: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: "Helvetica-Bold",
  },
});

const CombinedSalesPdf = ({ headSales, sales }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PdfHeader title="DATA SALES" subtitle="Laporan Data Sales" />

        <Text style={styles.title}>Head of Sales</Text>
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
          {headSales.map((item, index) => (
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
        </View>

        <Text style={styles.title}>Sales</Text>
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
          {sales.map((item, index) => (
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
        </View>

        <PdfFooter />
      </Page>
    </Document>
  );
};

export default CombinedSalesPdf;

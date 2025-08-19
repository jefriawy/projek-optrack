// frontend/src/componenets/CustomerListPdf.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Re-using and adapting styles from the single-customer template
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 30,
    backgroundColor: '#ffffff'
  },
  header: {
    backgroundColor: '#3B82F6',
    color: 'white',
    padding: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#d1d5db'
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row"
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontFamily: 'Helvetica-Bold',
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#d1d5db'
  },
  tableCell: {
    margin: 5,
    fontSize: 9
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

const CustomerListPdf = ({ customers }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Customer Data Report</Text>
        </View>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Customer Name</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Corporation</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Email</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Status</Text>
            </View>
          </View>

          {/* Table Body */}
          {customers.map((customer) => (
            <View style={styles.tableRow} key={customer.idCustomer}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{customer.nmCustomer}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{customer.corpCustomer || '-'}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{customer.emailCustomer}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{customer.nmStatCustomer}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.footer} fixed>
        Generated on: {new Date().toLocaleDateString('id-ID')} - PT. eNetwoQ ServIT Indonesia
      </Text>
    </Page>
  </Document>
);

export default CustomerListPdf;


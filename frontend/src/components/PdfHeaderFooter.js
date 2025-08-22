// frontend/src/components/PdfHeaderFooter.js
import React from 'react';
import { View, Text, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#3B82F6',
    color: 'white',
    padding: 20,
    textAlign: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 5,
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
  footerTimestamp: {
    fontSize: 10,
    borderTop: '1px solid #E5E7EB',
    paddingTop: 10,
    marginBottom: 10,
  },
  footerContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  footerLogo: {
    width: 100,
  },
  footerSeparator: {
    borderLeft: '1px solid #cccccc',
    height: 40,
  },
  footerText: {
    textAlign: 'left',
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
});

export const PdfHeader = ({ title = '', subtitle = '' }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{title}</Text>
    {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
  </View>
);

export const PdfFooter = ({ timestampLabel = 'Tanggal Dibuat', showTimestamp = true }) => {
  const getCurrentTimestamp = () => new Date().toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).replace('pukul', 'pukul ');
  return (
    <View style={styles.footer} fixed>
      {showTimestamp && <Text style={styles.footerTimestamp}>{timestampLabel}: {getCurrentTimestamp()}</Text>}
      <View style={styles.footerContent}>
        <Image style={styles.footerLogo} src="/logoenetwoq.PNG" />
        <View style={styles.footerSeparator}></View>
        <View style={styles.footerText}>
          <Text style={styles.bold}>PT. eNetwoQ ServIT Indonesia</Text>
          <Text>South Quarter Tower A 18th Floor Jl. R.A Kartini Kav 8, Cilandak</Text>
          <Text>Barat, Jakarta, 12430</Text>
          <Text>Phone: 02129212782 | Whatsapp: +6281295945123</Text>
        </View>
      </View>
    </View>
  );
};

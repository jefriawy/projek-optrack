// frontend/src/components/PdfTemplate.js

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Membuat style seperti CSS-in-JS
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 30,
    backgroundColor: '#ffffff'
  },
  header: {
    backgroundColor: '#3B82F6',
    color: 'white',
    padding: 20,
    textAlign: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 5,
  },
  body: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  twoColumns: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  column: {
    flex: 1,
    backgroundColor: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    padding: 15,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    borderBottom: '1px solid #E5E7EB',
    paddingBottom: 8,
    marginBottom: 10,
  },
  infoGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center', // Penting untuk alignment status
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    width: 80,
  },
  infoValue: {
    flex: 1,
  },
  statusOval: {
    padding: '4px 10px',
    borderRadius: 12,
    fontSize: 10,
    color: 'white',
  },
  descriptionCard: {
    backgroundColor: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    padding: 15,
  },
  descriptionText: {
    paddingTop: 10,
    minHeight: 60,
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
  }
});


const PdfTemplate = ({ customer }) => {
  if (!customer) return null;
  
  const getCurrentTimestamp = () => new Date().toLocaleString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).replace('pukul', 'pukul ');

  const statusColor = customer.nmStatCustomer === 'Active' ? '#4CAF50' : '#FFC107';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* PERUBAHAN DIMULAI: Pembungkus hanya untuk konten utama */}
        <View>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>DATA PELANGGAN</Text>
            <Text style={styles.headerSubtitle}>Laporan Informasi Pelanggan</Text>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {/* Two Columns */}
            <View style={styles.twoColumns}>
              <View style={styles.column}>
                <Text style={styles.cardTitle}>Informasi Pelanggan</Text>
                <View style={styles.infoGroup}><Text style={styles.infoLabel}>Nama:</Text><Text style={styles.infoValue}>{customer.nmCustomer}</Text></View>
                <View style={styles.infoGroup}><Text style={styles.infoLabel}>Email:</Text><Text style={styles.infoValue}>{customer.emailCustomer}</Text></View>
                <View style={styles.infoGroup}><Text style={styles.infoLabel}>Telepon:</Text><Text style={styles.infoValue}>{customer.mobileCustomer || "-"}</Text></View>
              </View>
              <View style={styles.column}>
                <Text style={styles.cardTitle}>Informasi Bisnis</Text>
                <View style={styles.infoGroup}><Text style={styles.infoLabel}>Alamat:</Text><Text style={styles.infoValue}>{customer.addrCustomer || "-"}</Text></View>
                <View style={styles.infoGroup}><Text style={styles.infoLabel}>Perusahaan:</Text><Text style={styles.infoValue}>{customer.corpCustomer || "-"}</Text></View>
                <View style={styles.infoGroup}>
                  <Text style={styles.infoLabel}>Status:</Text>
                  <Text style={{...styles.statusOval, backgroundColor: statusColor}}>{customer.nmStatCustomer}</Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={styles.descriptionCard}>
              <Text style={styles.cardTitle}>Deskripsi Pelanggan</Text>
              <Text style={styles.descriptionText}>{customer.descCustomer || "Tidak ada deskripsi."}</Text>
            </View>
          </View>
        </View> 
        {/* PERUBAHAN SELESAI: Penutup view konten utama */}

        {/* PERUBAHAN: Footer sekarang berada di luar pembungkus utama, sebagai anak langsung dari <Page> */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerTimestamp}>Tanggal Dibuat: {getCurrentTimestamp()}</Text>
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

      </Page>
    </Document>
  );
};

export default PdfTemplate;
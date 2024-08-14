import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Button, IconButton } from 'react-native-paper';
import QRCode from 'react-qr-code';

export default function QRCodeModal({qr ,  visible, onClose } : {qr : string , visible : boolean , onClose : any}) {
  // Sample data, replace with your actual UPI address

  return (
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContent}>
      <View style={styles.qrContainer}>
        {/* <QRCode value={upiAddress} size={200} /> */}
                <QRCode 
            size={200}
            // style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={qr}
            // viewBox={`0 0 256 256`} 
            />
      </View>
      <IconButton icon="close" size={24} onPress={onClose} style={styles.closeButton} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

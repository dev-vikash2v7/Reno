import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const WarningPopup = ({ visible , onClose  , title , content , success} : {visible:boolean , onClose : any , title : string , content : string , success : boolean}) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText ,  {color :success ? 'green' : 'red' }]}>{title}</Text>
            <Text style={styles.messageText}>{content}</Text>
            <TouchableOpacity onPress={() => onClose()} style={[styles.closeButton ,  {backgroundColor :success ? 'green' : 'red' }]}>
              <Text style={[styles.buttonText ]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      height : 200 
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      elevation: 5
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '500',
      fontFamily:'Poppins'
    },
    messageText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '400'


    },
    closeButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: 'red',
      borderRadius: 5
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center'
    }
  });
  

  export default WarningPopup
import React from 'react';
import { View, Text, Button } from 'react-native';
import { Icon, ListItem } from '@rneui/base';
// import * as Sharing from '';
import * as Contacts from 'expo-contacts';

const ReferEarnScreen = () => {
  const shareApp = async () => {
    // Share the app text or link
    // await Sharing.shareAsync('Check out this cool app!');
  };

  const pickContact = async () => {
    // Request permission to access contacts
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      // Get the user's contacts
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });
      if (data.length > 0) {
        // Pick the first contact for simplicity
        const firstContact = data[0];
        // Handle the contact data, you might want to display it or use it for something
      }
    } else {
      // Handle denied permission
      console.log('Permission to access contacts denied');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Refer & Earn</Text>
      <Button title="Pick Contact" onPress={pickContact} />
      <Icon
        raised
        name='share'
        type='font-awesome'
        onPress={shareApp}
      />
    </View>
  );
};

export default ReferEarnScreen;

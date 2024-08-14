import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface HeaderProps {
  name: string;
  // acceptsRenoPay: boolean;
}

const Header: React.FC<HeaderProps> = ({ name }) => {
  return (
    <SafeAreaView style={styles.header}>
      <View style={styles.headerInnerView}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
          <Ionicons name={'arrow-back'} size={24} color={'#404040'} />
        </TouchableOpacity>

        <Text style={styles.text}>{name}</Text>
      </View>
      {0 ? (
        <View style={styles.renoPayView}>
          <Text style={styles.renoPayText}>Reno Pay</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    elevation: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#404040',
    marginLeft: 10,
  },
  renoPayView: {
    backgroundColor: '#299e49',
    borderRadius: 7,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  renoPayText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#fff',
    alignSelf: 'center',
  },
});

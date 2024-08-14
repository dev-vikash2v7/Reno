import { hp, wp } from 'src/app/Login';
import { router, useNavigation } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, TextStyle, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface HeaderProps {
  text: string;
  onBack: () => void;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  backIconColor?: string;
}

const Header: React.FC<HeaderProps> = ({ text, onBack, textStyle, style, backIconColor }) => {

  const nav = useNavigation()
  
  return (
    <View
    style={styles.header}>


        <TouchableOpacity
          onPress={onBack}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            left:wp('4%'),
            position:'absolute',
            // paddingTop: 15
          }}>
          <Ionicons
            name="arrow-back"
            size={hp('3%')}
            color="#000"
            // style={{ paddingTop: 15 }}
          />
        </TouchableOpacity>



    <Text
      style={{
        fontFamily: 'Ubuntu-Bold',
        fontSize: hp('2.7%'),
        color: '#000',
        alignSelf: 'center',
      }}>
     {text}
    </Text>




 <View></View>
  </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: wp('2%'),
    // paddingVertical: 12,
    // paddingTop:20 , 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: '#fff',
    // height: 50,
    width:'100%',
    paddingBottom:hp('2.4%'),
    paddingTop:hp('2.2%')
  
  },
  text: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp('2.2%'),
    color: '#404040',
    alignItems: 'center',
    // marginLeft: 20,
    // marginTop: 5,
    textAlign:'center',
    justifyContent:'center',
    marginHorizontal:'auto'
  },
});

import { width } from "src/constants";
import { StyleSheet } from "react-native";


export default StyleSheet.create({
    sortByStyle1: {
      height: 150,
      width: '40%',
      position: 'absolute',
      top: '42%',
      zIndex: 2,
      borderRadius: 10,
      backgroundColor: 'white',
      // elevation: 15,
      // shadowColor: '#000',
      // shadowOffset: { width: 0, height: 5 },
      // shadowOpacity: 0.5,
      // shadowRadius: 2,
      borderColor: '#d20000',
      borderWidth: 1,
      justifyContent: 'space-around'
    },
    sortByStyle2: {
      borderWidth: 1,
      borderColor: '#d20000',
      height: 36,
      top: '42%',
      width: '30%',
      position: 'absolute',
      zIndex: 2,
      borderRadius: 10,
      backgroundColor: 'white',
      // elevation: 15,
      // shadowColor: '#000',
      // shadowOffset: { width: 0, height: 5 },
      // shadowOpacity: 0.5,
      // shadowRadius: 2,
      justifyContent: 'center'
    },
    filterChip: {
      marginLeft: 10,
      backgroundColor: "white"
    },
    payButtonView: {
      height: 50,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      width: width*0.9,
      marginTop:30,
      position: 'relative',
      // bottom: 10
    },
    payButtonText: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 16,
      color: '#fff',
    },
    amountView: {
      alignItems: 'center',
      borderRadius: 10,
      // borderWidth: 2,
      // borderColor: '#707070',
      marginBottom: 15,
      // flexDirection: 'row',
      // backgroundColor: '#fff',
      height: 50,
      // paddingHorizontal: 10,
      width : width * 0.9,
      
     
    },
    amountInput: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: '#000',
      marginLeft: 3,
      // paddingVertical: 0,
      // paddingHorizontal: 0,
      flex: 1,
      marginTop: 3,
    fontWeight:'500'
      
    },
  })
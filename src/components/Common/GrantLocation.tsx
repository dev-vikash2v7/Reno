import React from 'react'
import { View, Text, Linking } from 'react-native'
import Ripple from 'react-native-material-ripple'

const GrantLocation = () => {
  return (
    <View
                style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        fontFamily: 'Poppins-Bold',
                        fontSize: 24,
                        marginHorizontal: 30,
                        textAlign: 'center',
                    }}>
                    Location Permission Required
                </Text>
                <Text
                    style={{
                        fontFamily: 'Poppins-Regular',
                        fontSize: 14,
                        marginVertical: 20,
                        marginHorizontal: 30,
                        textAlign: 'center',
                    }}>
                    To use Instant Eat Out and get the best experience, please grant location
                    permission from the app settings
                </Text>
                <Ripple
                onPress={()=>Linking.openSettings()}
                    rippleColor={'#d20000'}
                    style={{ borderRadius: 10, borderWidth: 1, borderColor: '#d20000' }}>
                    <Text
                        style={{
                            fontFamily: 'Poppins-Regular',
                            fontSize: 16,
                            marginHorizontal: 15,
                            marginVertical: 5,
                            color: '#d20000',
                        }}>
                        Open Settings
                    </Text>
                </Ripple>
            </View>
  )
}

export default GrantLocation
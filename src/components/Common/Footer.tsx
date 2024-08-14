import React from 'react'

const Footer = () => {
  return (
    <View>
    <Text
        style={{
            marginTop: 25,
            alignSelf: 'center',
            fontFamily: 'Poppins-Regular',
            fontSize: 16,
            color: '#777777',
        }}
    >
        v2.0.0
    </Text>
    <Text
        style={{
            fontFamily: 'Poppins-Regular',
            fontSize: 16,
            alignSelf: 'center',
            marginBottom: 25,
            color: '#777777',
        }}
    >
        © Reno Media Pvt Ltd
    </Text>
    </View>

  )
}

export default Footer
import { hp, wp } from 'src/app/Login';
import React from 'react';

import { ActivityIndicator, Text, View } from 'react-native';
import Modal from 'react-native-modal';  
import { width } from 'src/constants';

const WaitModal = ({visible } : {visible:boolean}) => {
  return (
    

<Modal
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    style={{
                        margin: 0,
                    }}
                    isVisible={  visible}>
                    <View
                        style={{
                            width: width * 0.9,
                            height: hp('9%'),
                            alignSelf: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            shadowColor: '#000',
                            shadowOffset: { height: 2, width: 2 },
                            shadowRadius: 10,
                            shadowOpacity: 0.4,
                            borderRadius: 5,
                            backgroundColor: '#fff',
                        }}>
                        <ActivityIndicator
                            size="large"
                            color="#d20000"
                            style={{ marginLeft: wp('8%') }}
                        />
                        <Text
                            style={{
                                fontFamily: 'Poppins-Regular',
                                marginLeft: wp('3%'),
                                color: 'grey',
                                fontSize: hp('2.2%'),
                            }}>
                            Please Wait
                        </Text>
                    </View>
                </Modal>
  )
}

export default WaitModal
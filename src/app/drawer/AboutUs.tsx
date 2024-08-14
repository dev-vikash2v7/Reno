import React, { Component } from 'react';
import { Text, View, Linking, StatusBar, Platform } from 'react-native';
import Image from 'react-native-fast-image';
import { width, height } from 'src/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mixpanel } from '../Login';
import crashlytics from '@react-native-firebase/crashlytics';


class AboutUs extends Component {

    componentDidMount(): void {
    crashlytics().log('AboutUs mounted.');

        mixpanel.track('opened AboutUs')
    }
  
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View
                    style={{
                        width,
                        height: 55,
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}>
                    <Ionicons
                        name="arrow-back"
                        onPress={() => router.back()}
                        color="#000"
                        size={28}
                        style={{ marginLeft: 15 }}
                    />
                    <Text
                        style={{
                            marginLeft: 10,
                            fontFamily: 'Poppins-Medium',
                            color: '#000',
                            fontSize: 20,
                        }}>
                        About Us
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ marginTop: 30, alignItems: 'center' }}>
                        <Image
                            source={require('src/assets/reno_logo_main.png')}
                            style={{ height: 130, width: 130 }}
                            resizeMode="cover"
                        />
                        <Text
                            style={{
                                fontFamily: 'Ubuntu-Bold',
                                marginTop: 6,
                                fontSize: 37,
                                color: '#d20000',
                            }}>
                            reno
                        </Text>
                        <Text
                            style={{
                                marginTop: 5,
                                color: '#000',
                                fontFamily: 'Poppins-Regular',
                                fontSize: 16,
                            }}
                            onPress={() =>
                                Linking.openURL('https://www.renoapp.in/').catch((err) =>
                                    console.error(err),
                                )
                            }>
                            www.renoapp.in
                        </Text>
                        <Text
                            style={{
                                margin: 10,
                                marginTop: 20,
                                fontFamily: 'Poppins-Regular',
                                color: '#000',
                                fontSize: 16,
                                paddingHorizontal:10
                            }}>
                            Renoapp is India’s 1st Eating out platform that runs on dynamic pricing models. Our Mission is to connect empty tables at restaurants to empty stomachs by offering real-time discounts on a 30 min slot basis with discounts of up to 60% off everyday at all our participating restaurants through the mobile app. Users can choose to dine anywhere, from upscale hotels to popular food chains, and enjoy the same discounts with no strings attached. Through our platform restaurants get to fill their un-utilised capacity during off-peak hours at the same time customers get to have awesome discounts. The best of the best part, we are free to use!
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

export default AboutUs;

import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HTMLView from 'react-native-htmlview';
import { width } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { hp, mixpanel, wp } from '../Login';
import { List } from 'react-native-paper';
import { getRequest } from 'src/services';
import NoInternetScreen from 'src/components/Common/NoInternet';
import crashlytics from '@react-native-firebase/crashlytics';

interface FAQScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const FAQScreen = ({ navigation }: FAQScreenProps) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setConnected] = useState<boolean >(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getRequest('/consumer/getFAQs');

        setConnected(true)

        setFaqs(res.data.faqs);
        setLoading(false);
    crashlytics().log('FAQScreen mounted.');
        mixpanel.track('opened FAQScreen');

      } catch (error) {
        console.error('Error fetching FAQ data:', error);
        setLoading(false);

        if(isConnected)
          setConnected(false)
  
  
        setTimeout(async()=>{
          await fetchData()
        },1000)
      }
    };

    fetchData();
  }, []);

  const renderFaqs = () => {
    return faqs.map((faq, index) => (
      <List.Accordion
        key={index}
        title={
        <Text style={{ color: 'black', fontWeight: '600' , fontSize:hp('2%') }}>{faq.question}</Text>}

        id={index.toString()}
        style={{ borderBottomWidth: 0.3, borderBottomColor: '#000', backgroundColor: '#fff' }}
        titleNumberOfLines={3}>
        <List.Item
          title={<Text style={{ color: '#000' , fontSize:hp('1.8%')  }}>{faq.answer}</Text>}
          titleNumberOfLines={10}
        />
      </List.Accordion>
    ));
  };


  if(!isConnected) return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <View style={{ width, height: hp('6%'), alignItems: 'center', flexDirection: 'row' }}>
          <Ionicons
            name="arrow-back"
            onPress={() => router.back()}
            color="#000"
            size={hp('3.5%')}
            style={{ marginLeft: wp('4%')  }}
          />
          <Text style={{ marginLeft:  wp('2%'), fontFamily: 'Poppins-Medium', color: '#000', fontSize: 20 }}>
            FAQs
          </Text>
        </View>
  <NoInternetScreen/>
  </SafeAreaView>
)
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={{ width, height: hp('6%'), alignItems: 'center', flexDirection: 'row' }}>
          <Ionicons
            name="arrow-back"
            onPress={() => router.back()}
            color="#000"
            size={hp('3.5%')}
            style={{ marginLeft: wp('4%') }}
          />
          <Text style={{ marginLeft:  wp('2%'), fontFamily: 'Poppins-Medium', color: '#000', fontSize: hp('2.5%') }}>
            FAQs
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size={40} color={'black'} style={{ marginTop: 20 }} />
        ) : (
          <>
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: hp('1.8%'), paddingHorizontal: wp('4%') }}>
              If you have a question or concern you can't find here, please don’t hesitate to contact us at
              support@renoapp.in
            </Text>

            <List.Section>{renderFaqs()}</List.Section>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQScreen;

const styles = StyleSheet.create({
  answerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    marginBottom: 8,
  },
  questionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    marginBottom: 8,
  },
  scrollViewContent: {
    paddingBottom: 24,
    backgroundColor: '#fff',
  },
});

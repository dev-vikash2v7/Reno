import React, { Component } from 'react';
import { Text, View, ActivityIndicator, ScrollView, StyleSheet, Dimensions } from 'react-native';
// import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HTMLView from 'react-native-htmlview';
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { mixpanel } from '../Login';
import { ListItem } from '@rneui/base';
// import { width } from ;
// import { getMiscData } from '../../actions/misc';
import crashlytics from '@react-native-firebase/crashlytics';

interface TermsAndConditionsProps {
  navigation: {
    goBack: () => void;
  };
  getMiscData: () => void;
  misc: {
    loading: boolean;
    error: string;
    misc: {
      fup: string;
    };
  };
}

class TermsAndConditions extends Component<TermsAndConditionsProps> {

  componentDidMount(): void {
    crashlytics().log('TermsAndConditions mounted.');

    mixpanel.track('opened TermsAndConditions')
  }
  render() {

    return (
      <SafeAreaView>

        <ScrollView style={{ flexGrow: 1, backgroundColor: '#fff', paddingHorizontal: 10 }}>
          <View
            style={{
              width: Dimensions.get('screen').width,
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
              Terms And Conditions
            </Text>
          </View>

          <View style={{paddingHorizontal:20}}>
          <Text>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 15,
              }}>
              {`Terms and Conditions\n`}
            </Text>
            <Text style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 15,
            }}>
              {`In using this app you are deemed to have read, understood, and agreed to the following Terms and Conditions set forth by Renoapp:\n\n`}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 15,
              }}>
              {`User Agreement\n`}
            </Text>
            <Text style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 15,
            }}>
              {`* This app is published and maintained by Renoapp Technologies Private Limited
* When you access, browse, or use any services provided by Renoapp, you accept the terms and conditions set forth below, without limitation.
* These Terms and Conditions constitute the entire agreement between Renoapp and the user with respect to the use of the website, mobile application, or any other services offered solely by Renoapp.
\n\n`}
            </Text>

            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 15,
              }}>
              {`Terms of Use\n`}
            </Text>
            <Text style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 15,
            }}>
              {`* By using the services of Renoapp, be it the website, mobile application, or concierge service, you acknowledge that you have read and understood the terms of use and agree to be bound by them.
*  While people under the age of 18 can use the services of Renoapp, they must do so under the guidance of their parents and/ or legal guardians.
* With regards to any services provided by Renoapp involving the consumption of alcohol, the user must warrant that they are of legal drinking age in strict adherence to specific state laws and the Government of India. For example, Delhi NCR users booking at bars should be a minimum of 21 years or above.
\n\n`}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 15,
              }}>
              {`What will we do with your personal information?\n`}
            </Text>
            <Text style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 15,
            }}>
              {`* We at Renoapp are committed to protecting and ensuring your privacy. Only authorized employees within the company have access to the user’s details and information & are prohibited from using this information for any personal or commercial use.
* Client records are regarded as confidential and will not be divulged to any third party, other than to appropriate authorities, only if legally required. We will not sell, share, or rent your personal information to any third party.
* Any emails sent by this Company will only be in connection with the provision of agreed services and products.
* We also need to share customer's details with specific restaurants, where a reservation has been made, for a better customer experience. The restaurant may also contact customers for the given reservation or for any promotions afterward.
\n\n`}
            </Text>


            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 15,
              }}>
              {`What is Renoapp responsible for?\n`}
            </Text>
            <Text style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 15,
            }}>
              {`* Renoapp offers a reservation service between the user and the restaurants and does not accept any liability arising out of your dining experience regarding quality of service or food, as it is delivered by a restaurant and not by Renoapp.
* Renoapp is not liable for any changes in menu or pricing at the restaurant.
* We will investigate any written complaints against a restaurant on receipt of complete details.
\n\n`}
            </Text>

            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 15,
              }}>
              {`Cancellation, No Show\n`}
            </Text>
            <Text style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 15,
            }}>
              {`Renoapp is committed to providing convenient and quality service to our users. To help us in maintaining this level of service, we urge our users to cancel their reservations if they will be unable to reach the restaurant at the decided time. \n\n`}
            </Text>

            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 15,
              }}>
              {`Q. How can I cancel a reservation?\n`}
            </Text>
            <Text style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 15,
            }}>
              {`You can cancel your bookings through My Reservations section on the app.\n\n`}
            </Text>

            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 15,
              }}>
              {`Q. Will I get charged for cancelling a reservation?\n`}
            </Text>
            <Text style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 15,
            }}>
              {`Renoapp has no cancellation and booking charges.\n\n`}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 15,
              }}>
              {`Refund policy\n`}
            </Text>
            <Text style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 15,
            }}>
              {`Renoapp’s Renopay is just a medium to facilitate payments and is only used after bill generation at the restaurant, refunds on any payments done through Renopay would be non-refundable. Please feel free to contact us through Whatsapp/Call at 7000449336 in case you are facing any service/experience issues with the restaurant and you need our help to sort that up for you. Please do this before making the payment. \n\n`}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 15,
              }}>
              {`User Communication Guidelines\n`}
            </Text>
            <Text style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 15,
            }}>
              {`We send our users (registered with us) regular communications about our products and offers.\n\n`}
            </Text>
            </Text>
            </View>
        </ScrollView>
            </SafeAreaView>
                );
  }
}


// const mapStateToProps = ({ misc }: { misc: TermsAndConditionsProps['misc'] }) => ({ misc });

export default TermsAndConditions;

const styles = StyleSheet.create({
  p: {
    color: 'black'
  },
  h4: {
    color: 'black'
  }
});



// import React, { Component } from 'react';
// import { Text, View, ScrollView, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { ListItem } from '@rneui/base';
// import { mixpanel } from '../Login';

// const termsData = [
//   { title: 'Terms and Conditions', content: 'Content for Terms and Conditions...' },
//   { title: 'User Agreement', content: 'Content for User Agreement...' },
//   // Add more sections as needed
// ];

// class TermsAndConditions extends Component {
//   componentDidMount() {
//     mixpanel.track('opened TermsAndConditions');
//   }

//   renderAccordionItems() {
//     return termsData.map((item, index) => (
//       // <List key={index} collapsed={true} align="center">
//         <ListItem.Accordion
//           content={
//             <>
//               <ListItem.Content>
//                 <ListItem.Title>{item.title}</ListItem.Title>
//                 <ListItem.Subtitle>{item.content}</ListItem.Subtitle>
//               </ListItem.Content>
//             </>
//           }
//         />
//       // </Collapsible>
//     ));
//   }

//   render() {
//     return (
//       <SafeAreaView style={styles.container}>
//         <ScrollView>
//           <View style={styles.header}>
//             <Ionicons
//               name="arrow-back"
//               onPress={() => this.props.navigation.goBack()}
//               color="#000"
//               size={28}
//               style={styles.backIcon}
//             />
//             <Text style={styles.headerText}>Terms And Conditions</Text>
//           </View>

//           <View style={styles.content}>
//             {this.renderAccordionItems()}
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingTop: 10,
//   },
//   backIcon: {
//     marginRight: 15,
//   },
//   headerText: {
//     fontFamily: 'Poppins-Medium',
//     color: '#000',
//     fontSize: 20,
//   },
//   content: {
//     paddingHorizontal: 20,
//   },
// });

// export default TermsAndConditions;

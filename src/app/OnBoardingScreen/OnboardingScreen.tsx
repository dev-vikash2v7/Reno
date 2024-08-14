import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef } from "react";
// import { useNavigation } from "@react-navigation/native";
// import { setItem } from "src/utils/asyncStorage";
// import { router } from "expo-router";
// import Onboarding from "react-native-onboarding-swiper";
import crashlytics from '@react-native-firebase/crashlytics';




const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {

  return(
   <View></View>
  )
  // const handleSkip = () => {
  //   router.replace('/drawer/(tabs)/Home')
  //   setItem("onboarded", "1");

  // };

  // const handleDone = () => {
  //   router.replace('/drawer/(tabs)/Home')
  //   setItem("onboarded", "1");
  // };

  // const doneButton = ({ ...props }) => {
  //   return (
  //     <TouchableOpacity style={styles.doneButton} {...props}>
  //       <Text>Done</Text>
  //     </TouchableOpacity>
  //   );
  // };


  // // const animationRef = useRef<LottieView>(null);

  // // useEffect(() => {
  // //   animationRef.current?.play();

  // //   // Or set a specific startFrame and endFrame with:
  // //   animationRef.current?.play(10, 120);
  // // }, []);

  // return (
  //   <View style={styles.container}>
  //     <Onboarding
  //       containerStyles={{ paddingHorizontal: 15 }}
  //       onSkip={handleSkip}
  //       onDone={handleDone}
  //       DoneButtonComponent={doneButton}
  //       pages={[
  //         {
  //           backgroundColor: "#fff",
  //           image: (
  //             <View style={styles.lottie}>
  //               <LottieView
  //                 source={require("src/assets/animations/g.json")}
  //                 autoPlay
  //                 loop
  //                 // ref={animationRef}
  //               />
  //              </View>
  //           ),
  //           title: "Discount Dine",
  //           subtitle: "Explore restaurants, savor discounts, book hassle-free!",
  //         },
  //         {
  //           backgroundColor: "#fef3c7",
  //           image: (
  //             <View style={styles.lottie}>
  //                  <LottieView
  //                 source={require("src/assets/animations/g.json")}
  //                 autoPlay
  //                 loop
  //               />
  //             </View>
  //           ),
  //           title: "Savor Savings",
  //           subtitle: "Discover delights, save big, book with ease!",
  //         },
  //         {
  //           backgroundColor: "#a7f3d0",
  //           image: (
  //             <View style={styles.lottie}>
  //                  <LottieView
  //                 source={require("src/assets/animations/g.json")}
  //                 autoPlay
  //                 loop
  //               />
  //             </View>
  //           ),
  //           title: "Feast Finder",
  //           subtitle:
  //             "Feast on deals, dine in style, effortless reservations!",
  //         },
  //       ]}
  //     />
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  lottie: {
    width: width * 0.6,
    // flex: 1, justifyContent: 'center', alignItems: 'center'
    height: width * 0.6,
  },
  doneButton: {
    padding: 20,
  },
});

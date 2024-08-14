import React, { useRef } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';


const ICON_SIZE = 20;
const ACTIVE_COLOR = '#d20000';
const INACTIVE_COLOR = '#a9a9a9';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  index: number
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {

//   const bottomSheetRef = useRef(null);

//   const snapPoints = ['50%', '30%', '0%']; // Adjust snap points according to your needs

//  const handleClosePress = () => {
//     bottomSheetRef.current?.snapToIndex(0); // Close the bottom sheet
//   };



  function renderIcon(iconName: string, color: string) {
    return (
      <Icon
        name={iconName}
        
        size={ICON_SIZE}
        color={color}
      />
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
      }}>
      <Tabs.Screen name="Home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => renderIcon('home', color),
        }}
      />
      <Tabs.Screen name="InstantEat"
        options={{
          title: 'Instant Eat',
          headerShown: false,
          tabBarIcon: ({ color }) => renderIcon('map-pin', color),
        }}
      />
      <Tabs.Screen name="reservation"
        options={{
          title: 'Bookings',
          headerShown: false,
          tabBarIcon: ({ color }) => renderIcon('clipboard', color),
        }}
      />
    </Tabs>
  );
}

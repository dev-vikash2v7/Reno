import React from "react";
import { Drawer } from "expo-router/drawer";
import RightDrawer from "src/components/Common/RightDrawer";
import { Platform } from "react-native";
import { StatusBar } from "react-native";

export default function Layout() {
    return (
        <Drawer screenOptions={{
            headerShown: false, drawerPosition: 'right', drawerType: 'slide',
            swipeEnabled: true
        }}

            drawerContent={() => <RightDrawer />}>
            <Drawer.Screen name="(tabs)" />
            <Drawer.Screen name={'AboutUs'} />
            <Drawer.Screen name={'FAQScreen'} />
            <Drawer.Screen name={'Support'} />
        </Drawer>
    )
}
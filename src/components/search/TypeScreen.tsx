import React, { Component, useState } from 'react';
import { Text, View, SafeAreaView, FlatList } from 'react-native';
import Header from './Header';
// import RenderRestaurants from '../../components/Tabs/Home/RenderRestaurants';
import { ActivityIndicator } from 'react-native-paper';
import { getDayFromNumber } from '../../utils/dateTimeUtils';
import { getRestaurantsByCategory } from '../../services/restaurants.service';


const TypeScreen = async (props: any) => {

  const [state, setState] = useState<{ loading: boolean, restaurants: any }>({ loading: false, restaurants: null });

  const response = await getRestaurantsByCategory(props.route.params.id);
  // const response = await axios.get(`type/${this.props.route.params.id}`);
  setState({ restaurants: response.data.restaurants, loading: false });
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header
        //onBack={() => props.navigation.goBack()}
        name={props.route.params.name}
      />
      {state.loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator animating={true} color="#d20000" size="large" />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<View style={{ height: 20 }} />}
          ListFooterComponent={<View style={{ height: 50 }} />}
          keyExtractor={(item) => item.id}
          data={state.restaurants}
          renderItem={({ item, index }) => {
            const day = getDayFromNumber(new Date().getDay());
            let timeDiscounts = [];
            for (let timeDiscount of item.timeDiscount) {
              if (timeDiscount.day.toUpperCase() === day.toUpperCase()) {
                timeDiscounts.push(timeDiscount);
              }
            }
            if (!timeDiscounts.length) {
              return null;
            }
            return (
              <Text>Restaurant</Text>
              // <RenderRestaurants
              //   id={item.id}
              //   name={item.name}
              //   timeDiscounts={timeDiscounts}
              //   isRenoPayEnabled={item.acceptsRenoPay}
              //   hasPickup={item.hasPickup}
              //   image={item.mainImageUrl}
              //   directions={item.googlemapsurl}
              //   navigation={this.props.navigation}
              // />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
export default TypeScreen;

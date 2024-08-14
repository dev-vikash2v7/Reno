import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Image from 'react-native-fast-image';
import { useRouter } from 'expo-router';
import { BrandTile, RestaurantCategory } from 'src/types/interfaces';
import { hp, mixpanel, wp } from 'src/app/Login';
import { useDispatch } from 'react-redux';
import { setRestaurantsByCategory } from 'src/redux_store/reducers/restaurent.reducer';

interface AppProps {
  data: BrandTile;
  guest: boolean
}

const TILE_WIDTH = 168;



const App: React.FC<AppProps> = ({ data, guest }) => {
  const router: any = useRouter();

  const dispatch = useDispatch()

  const onPressTile = () => {
    if (guest) {
      router.push('/Login/');
      return;
    }
    // const d = JSON.stringify(data);
    mixpanel.track('opened brandTiles', { name: data.name });
    dispatch(setRestaurantsByCategory(data))

    router.push({
      pathname: '/RestaurantsByCategoryScreen/',
      // params: {
      //   data: JSON.stringify(data),
      //   brandTile: '1',
      //   name: data.name
      // },
    });
  };

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.buttonView} onPress={onPressTile}>
      <Image source={{ uri: data.imgUrl }} style={{ flex: 1 }} resizeMode="cover" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    // height: (TILE_WIDTH * 3) / 3.7,
    height: hp('20%'),
    // width: (Dimensions.get('screen').width - 60) / 2.5,
    width: wp('35%'),
    borderRadius: hp('1.5%'),
    backgroundColor: '#fff',
    marginRight: wp('4.5%'),
    marginTop: hp('2%'),
    // marginBottom: 5,
    elevation: hp('1%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp('0.5%') },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    overflow: 'hidden',
  },
});

export default App;

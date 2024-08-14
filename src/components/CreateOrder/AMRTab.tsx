import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Dimensions,
    ImageBackground,
} from 'react-native';
import Image from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { width } from '../../constants';
import { menu, review } from 'src/types/interfaces';
import { ExpandingDot } from "react-native-animated-pagination-dots";
import { Icon } from 'react-native-paper';
import { hp, wp } from 'src/app/Login';

interface ReviewItem {
    rating: number;
    review: string;
    user: {
        profileImage: string;
        firstname: string;
    };
}

interface AMRTabProps {
    about: string;
    restaurantMenu: menu[];
    discount: number;
    userReviewses: review[];
    menuImages: string[];
    setShowImgOverlay: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AMRTabState {
    index: number;
    imageIndex: number;
    selectedImgIndex: number;
}

class AMRTab extends Component<AMRTabProps, AMRTabState> {
    scrollView = null;
    index = 0
    constructor(props: AMRTabProps) {
        super(props);
        this.state = {
            index: 0,
            imageIndex: 0,
            selectedImgIndex: 0,
        };
    }

    
    renderReviewItem({ item }: { item: review }) {

        let { rating, review, user } = item;

        rating = 3;
        return (
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', width: '100%', marginBottom: hp('1.4%') }}>
                <View style={{ flexDirection: 'row' }}>

                    <View
                        style={{
                            height: hp('5.5%'),
                            width: hp('5.6%'),
                            borderRadius: hp('3%'),
                            overflow: 'hidden',
                            elevation: 3,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.5,
                            shadowRadius: 2,
                            backgroundColor: '#fff',
                            // marginLeft: 3,
                        }}>
                        <Image source={{ uri: user.profileImage }} style={{ flex: 1 }} />
                    </View>
                    <View style={{ marginLeft: wp('2.1%') }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text
                                style={{
                                    fontFamily: 'Poppins-SemiBold',
                                    fontSize: hp('1.5%'),
                                    marginRight: 10,
                                    marginTop: 2,
                                    // marginLeft: 20
                                }}>
                                {user.firstname}
                            </Text>
                            {Array(5)
                                .fill(0)
                                .map((_, index) => (
                                    <MaterialCommunityIcons
                                        name={index <= rating - 1 ? 'star' : 'star-outline'}
                                        size={14}
                                        color={'#d20000'}
                                    />
                                ))}
                        </View>
                        <View>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>
                                {review}
                            </Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        height: hp('5%'),
                        justifyContent: 'center',
                        // marginLeft: 25
                    }}>
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 13, marginTop: 10 }}>
                        {item.createTime.split('T')[0]}
                    </Text>
                </View>
            </View>
        );
    }

    renderTabs() {
        return (
            <View style={styles.tabView}>
                <TouchableOpacity
                    style={styles.tabInnerView}
                    onPress={() => {
                        this.setState({ index: 0 });
                    }}>
                    <Text
                        style={
                            this.state.index === 0 ? styles.tabTextSelected : styles.tabText
                        }>
                        About
                    </Text>
                </TouchableOpacity>
                <View
                    style={{ height: '100%', width: 0.2, backgroundColor: '#707070' }}
                />
                <TouchableOpacity
                    style={styles.tabInnerView}
                    onPress={() => {
                        this.setState({ index: 1 });
                    }}>
                    <Text
                        style={
                            this.state.index === 1 ? styles.tabTextSelected : styles.tabText
                        }>
                        Menu
                    </Text>
                </TouchableOpacity>
                <View
                    style={{ height: '100%', width: 0.2, backgroundColor: '#707070' }}
                />
                <TouchableOpacity
                    style={styles.tabInnerView}
                    onPress={() => {
                        this.setState({ index: 2 });
                    }}>
                    <Text
                        style={
                            this.state.index === 2 ? styles.tabTextSelected : styles.tabText
                        }>
                        Reviews
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderAbout() {
        if (this.state.index !== 0) {
            return;
        }
        return (
            <View style={{ width }}>
                <ScrollView style={styles.aboutView}>
                    <Text style={styles.aboutText}>{this.props.about}</Text>
                </ScrollView>
            </View>
        );
    }

    renderMenu() {

        if (this.state.index !== 1) {
            return;
        }

        return (
            <>
                <View style={{ width }}>
                    {/* <View style={[styles.aboutView, { marginHorizontal:0, padding: 0, marginLeft:15 , marginTop:5 }]}> */}
                    <View style={[styles.aboutView, { marginHorizontal: 0, padding: 0, width: wp('55%'), marginLeft: wp('22%'), marginTop:hp('0.6%') }]}>

                       

                        {
                            this.props.menuImages.length ?
                                <>
                                    <FlatList
                                        // snapToInterval={200}
                                        // decelerationRate={0}
                                        // snapToAlignment='center'
                                        horizontal
                                        onMomentumScrollEnd={(event) => {

                                            const index1 = Math.round(
                                                event.nativeEvent.contentOffset.x / width
                                            );
                                            this.setState({
                                                imageIndex: index1
                                            })
                                            // setImageIndex(index1);
                                            this.index = index1;
                                        }}
                                        showsHorizontalScrollIndicator={false}
                                        data={this.props.menuImages}
                                        renderItem={({ item, index }) => {
                                            // console.log('menu item : ' , item)
                                            return (
                                                <TouchableOpacity onPress={() => {
                                                    this.props.setShowImgOverlay(true);
                                                }} activeOpacity={0.5}>




                                                    <ImageBackground
                                                        resizeMode='cover'
                                                        style={{
                                                            height: hp('20%'),
                                                            width: hp('16%'),
                                                            marginLeft: wp('10%'),
                                                            marginRight: wp('10%'),
                                                            // marginLeft: 10,
                                                            // marginRight: 20,
                                                            
                                                        }}
                                                        
                                                        source={{ uri: item }} />
                                                </TouchableOpacity>
                                            )
                                        }}
                                    />
                                    <View
                                        style={{
                                            borderRadius: hp('5%'),
                                            marginLeft: wp('20%'),
                                            width: wp('10%'),
                                            height: hp('3%'),
                                            marginTop: hp('1.1%'),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                fontFamily: 'Poppins-SemiBold',
                                                fontSize: hp('1.8%'),
                                                color: 'grey',
                                            }}>
                                            {`${this.state.imageIndex + 1}/${this.props.menuImages.length}`}
                                        </Text>
                                    </View>
                                </>
                                : <View
                                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.menuNotFound}>Menu not found</Text>
                                </View>
                        }
                    </View>






{/* ////////     menu modal  ///////// */}







                </View>
            </>
        );
    }

    renderReviews() {
        if (this.state.index !== 2) {
            return;
        }
        return (
            <View>
                <View style={styles.aboutView}>
                    <FlatList
                        nestedScrollEnabled
                        contentContainerStyle={{ flexGrow: 1 }}
                        data={this.props.userReviewses.slice().reverse()}

                        ItemSeparatorComponent={() => (
                            <View style={{ width: wp('90%'), alignSelf: 'center', height: 1 }} />
                        )}
                        keyExtractor={(data, index) => data.id}
                        renderItem={this.renderReviewItem.bind(this)}
                    />
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={{ marginVertical: 25, marginBottom: 15 }}>
                {this.renderTabs()}
                {this.renderAbout()}
                {this.renderMenu()}
                {this.renderReviews()}
            </View>
        );
    }
}
export default AMRTab;

const styles = StyleSheet.create({
    tabView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        height: hp('5%'),
        borderRadius: hp('2.5%'),
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        borderWidth: 0.2,
        borderColor: '#707070',
        marginBottom: hp('1%'),
        marginHorizontal: wp('5%'),
    },
    tabInnerView: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    tabText: { fontSize: hp('1.9%'), fontFamily: 'Poppins-Regular', color: '#707070' },
    tabTextSelected: {
        fontSize:  hp('2%'),
        fontFamily: 'Poppins-SemiBold',
        color: '#d20000',
    },
    aboutView: {
        marginHorizontal: wp('5%'),
        padding: wp('2%'),
        borderRadius: hp('1%'),
        flex: 1,
        fontSize: 14,
    },
    aboutText: {
        fontSize: hp('1.8%'),
        fontFamily: 'Poppins-Regular',
        color: '#404040',
        textAlign: 'justify',
    },
    menuNotFound: {
        fontSize: hp('2%'),
        fontFamily: 'Poppins-SemiBold',
        color: '#707070',
    },
});
import React, { Component } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { ScrollView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

interface TabBarComponentProps {
    instantEatBookings: JSX.Element;
    reservations: JSX.Element;
}

interface TabBarComponentState {
    active: number;
    xTabOne: number;
    xTabTwo: number;
    translateX: Animated.Value;
    translateXTabOne: Animated.Value;
    translateXTabTwo: Animated.Value;
    translateY: number;
}

class TabBarComponent extends Component<TabBarComponentProps, TabBarComponentState> {
    constructor(props: TabBarComponentProps) {
        super(props);
        this.state = {
            active: 0,
            xTabOne: 0,
            xTabTwo: 0,
            translateX: new Animated.Value(0),
            translateXTabOne: new Animated.Value(0),
            translateXTabTwo: new Animated.Value(width),
            translateY: -1000,
        };
    }

    handleSlide = (type: number) => {
        const { active, xTabOne, xTabTwo, translateX, translateXTabOne, translateXTabTwo } = this.state;
        Animated.spring(translateX, {
            toValue: type,
            duration: 100,
            useNativeDriver: true,
        } as any).start();
        if (active === 0) {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                } as any).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: width,
                    duration: 100,
                    useNativeDriver: true,
                } as any).start(),
            ] as any);
        } else {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: -width,
                    duration: 100,
                    useNativeDriver: true,
                } as any).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                } as any).start(),
            ] as any);
        }
    };

    render() {
        const {
            xTabOne,
            xTabTwo,
            translateX,
            active,
            translateXTabOne,
            translateXTabTwo,
            translateY,
        } = this.state;

        return (
            <View style={{ flex: 1, marginTop: 20 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        height: 55,
                        marginBottom: 10,
                        borderRadius: 5,
                        backgroundColor: '#fff',
                        position: 'relative',
                        elevation: 7,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                        marginHorizontal: 10,
                        overflow: 'hidden',
                    }}
                >
                    <Animated.View
                        style={{
                            position: 'absolute',
                            width: '50%',
                            height: '100%',
                            top: 0,
                            left: 0,
                            backgroundColor: '#d20000',
                            transform: [
                                {
                                    translateX,
                                },
                            ],
                        }}
                    />
                    <Ripple
                        rippleColor="#d20000"
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5,
                        }}
                        onLayout={(event) => this.setState({ xTabOne: event.nativeEvent.layout.x })}
                        onPress={() => this.setState({ active: 0 }, () => this.handleSlide(xTabOne))}
                    >
                        <Text
                            style={{
                                color: active === 0 ? '#fff' : '#000',
                                fontFamily: 'Poppins-Regular',
                                fontSize: 17,
                            }}
                        >
                            Reservations
                        </Text>
                    </Ripple>
                    <Ripple
                        rippleColor="#d20000"
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5,
                            borderLeftWidth: 0,
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                        }}
                        onLayout={(event) => this.setState({ xTabTwo: event.nativeEvent.layout.x })}
                        onPress={() => this.setState({ active: 1 }, () => this.handleSlide(xTabTwo))}
                    >
                        <Text
                            style={{
                                color: active === 1 ? '#fff' : '#000',
                                fontFamily: 'Poppins-Regular',
                                fontSize: 17,
                            }}
                        >
                            Instant Eat Outs
                        </Text>
                    </Ripple>
                </View>

                <Animated.View
                    style={{
                        transform: [
                            {
                                translateX: translateXTabOne,
                            },
                        ],
                    }}
                    onLayout={(event) => this.setState({ translateY: event.nativeEvent.layout.height })}
                >
                    {this.props.reservations}
                </Animated.View>
                <Animated.View
                    style={{
                        transform: [
                            {
                                translateX: this.state.translateXTabTwo,
                            },
                            {
                                translateY: -this.state.translateY,
                            },
                        ],
                    }}
                >
                    {this.props.instantEatBookings}
                </Animated.View>
            </View>
        );
    }
}

export default TabBarComponent;

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { width, height } from 'src/constants';
import Icon from 'react-native-vector-icons/Entypo';
import Ripple from 'react-native-material-ripple';
import HTMLView from 'react-native-htmlview';
import { hp, wp } from 'src/app/Login';

interface Props {
    onPress: () => void;
    checked: boolean
}

interface TermsAndConditionsProps {
    callbackFromChild: (checked: boolean) => void,
    conditions: string
}

interface State {
    checked: boolean;
}

class CheckBox extends Component<Props, State> {
    render() {
        return (
            <Ripple
                rippleDuration={200}
                onPress={this.props.onPress}
                style={{
                    height: hp('3.2%'),
                    width: hp('3.2%'),
                    borderColor: '#d20000',
                    borderRadius: 5,
                    borderWidth: 0.5,
                    backgroundColor: this.props.checked ? '#d20000' : '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                {this.props.checked ? (
                    <Icon name="check" size={18} color="#fff" />
                ) : (
                    <View />
                )}
            </Ripple>
        );
    }
}



class TermsAndConditions extends Component<TermsAndConditionsProps, State> {
    constructor(props: TermsAndConditionsProps) {
        super(props);

        this.state = {
            checked: false,
        };
    }

    render() {
        return (
            <View style={{ marginBottom: hp('12%') }}>
                <View
                    style={{
                        width: wp('50%'),
                        height: hp('6%'),
                        borderRadius:  hp('5%') / 2,
                        borderWidth: 0.2,
                        borderColor: '#707070',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#00000029',
                        elevation: 5,
                        shadowOpacity: 1,
                        backgroundColor: '#fff',
                        shadowOffset: { height: 3, width: 3 },
                        shadowRadius: 7,
                        marginBottom:  hp('2%')
                    }}>
                    <Text
                        style={{
                            fontFamily: 'Poppins-Medium',
                            fontSize: hp('1.8%'),
                            color: '#d20000',
                        }}>
                        Terms & Conditions
                    </Text>
                </View>

                <View style={{ flex: 1,marginLeft:wp('5.5%') }}>
                    <HTMLView stylesheet={styles} value={this.props.conditions} />
                </View>


                <View
                    style={{
                        flexDirection: 'row',
                        marginLeft: wp('5.5%'),
                        marginTop: hp('1.9%'),
                        width: wp('95%'),
                        marginRight: wp('2%'),
                        alignItems: 'center',
                    }}>
                    <CheckBox
                        onPress={() => {
                            this.setState({ checked: !this.state.checked });
                            this.props.callbackFromChild(this.state.checked);
                        }}
                        checked={this.state.checked}
                    />
                    <Text
                        onPress={() => {
                            this.setState({ checked: !this.state.checked });
                            this.props.callbackFromChild(!this.state.checked);
                        }}
                        numberOfLines={2}
                        style={{
                            marginLeft: wp('3%'),
                            fontFamily: 'Poppins-Regular',
                            fontSize: hp('1.8%'),
                            marginRight: wp('2%'),
                            color: 'black',
                        }}>
                        I have read and accept all the terms and conditions
                    </Text>
                </View>
            </View>
        );
    }
}
export default TermsAndConditions;

const styles = StyleSheet.create({
    p: {
        color: 'black',
    },
    h4: {
        color: 'black',
    },
});

import React, { Component, ReactNode } from 'react';
import { Text, View, TextInput } from 'react-native';

interface OTPInputComponentProps {
    children: ReactNode;
}

class OTPInputComponent extends Component<OTPInputComponentProps> {
    render() {
        return (
            <View
                style={{
                    marginRight: 10,
                    height: 60,
                    width: 60,
                    borderRadius: 6,
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: '#e3e9ee',
                    shadowColor: '#e3e9ee',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowOffset: { height: 8, width: 8 },
                    shadowOpacity: 1,
                    shadowRadius: 10,
                }}>
                {this.props.children}
            </View>
        );
    }
}

interface OTPInputProps {
    otpCallback: (otp: string) => void;
    callbackFromChild: (visible: 'show' | 'dontShow') => void;
}

interface OTPInputState {
    digit1: string;
    digit2: string;
    digit3: string;
    digit4: string;
    isVisible: boolean;
    inputotp: number;
}

class OTPInput extends Component<OTPInputProps, OTPInputState> {
    public digit1: TextInput | null = null;
    public digit2: TextInput | null = null;
    public digit3: TextInput | null = null;
    public digit4: TextInput | null = null;

    constructor(props: OTPInputProps) {
        super(props);

        this.state = {
            digit1: '',
            digit2: '',
            digit3: '',
            digit4: '',
            isVisible: false,
            inputotp: Math.floor(1000 + Math.random() * 9000),
        };

        this.props.otpCallback(
            `${this.state.digit1}${this.state.digit2}${this.state.digit3}${this.state.digit4}`,
        );
    }

    clearText() {
        this.setState({
            digit1: '',
            digit2: '',
            digit3: '',
            digit4: '',
        });
        if (this.digit1) {
            this.digit1.focus();
        }
    }

    changeI1() {
        if (this.state.digit1 === '') {
            if (this.digit2) {
                this.digit2.focus();
            }
        }
    }

    changeI2() {
        if (this.state.digit2 === '') {
            if (this.digit3) {
                this.digit3.focus();
            }
        }
    }

    changeI3() {
        if (this.state.digit3 === '') {
            if (this.digit4) {
                this.digit4.focus();
            }
        }
    }

    sendProps() {
        if (
            this.state.digit1 !== '' &&
            this.state.digit2 !== '' &&
            this.state.digit3 !== '' &&
            this.state.digit4 !== ''
        ) {
            this.props.callbackFromChild('show');
            this.props.otpCallback(
                `${this.state.digit1}${this.state.digit2}${this.state.digit3}${this.state.digit4}`,
            );
        } else {
            this.props.callbackFromChild('dontShow');
            this.props.otpCallback(
                `${this.state.digit1}${this.state.digit2}${this.state.digit3}${this.state.digit4}`,
            );
        }
    }

    render() {
        return (
            <View style={{ marginTop: 15, flexDirection: 'row' }}>
                <OTPInputComponent>
                    <TextInput
                        returnKeyType='done'
                        ref={(digit1) => {
                            this.digit1 = digit1;
                        }}
                        selectionColor="#000"
                        autoFocus
                        style={{
                            fontFamily: 'Poppins-Medium',
                            fontSize: 20,
                            width: '100%',
                            textAlign: 'center',
                            color: 'black',
                        }}
                        keyboardType="numeric"
                        maxLength={1}
                        onChange={() => this.changeI1()}
                        onChangeText={async (digit1) => {
                            await this.setState({ digit1 });
                            this.sendProps();
                        }}
                    />
                </OTPInputComponent>
                <OTPInputComponent>
                    <TextInput
                        returnKeyType='done'
                        ref={(digit2) => {
                            this.digit2 = digit2;
                        }}
                        selectionColor="#000"
                        style={{
                            fontFamily: 'Poppins-Medium',
                            fontSize: 20,
                            width: '100%',
                            color: 'black',
                            textAlign: 'center',
                        }}
                        keyboardType="numeric"
                        maxLength={1}
                        onChange={() => this.changeI2()}
                        onChangeText={async (digit2) => {
                            await this.setState({ digit2 });
                            this.sendProps();
                        }}
                    />
                </OTPInputComponent>
                <OTPInputComponent>
                    <TextInput
                        returnKeyType='done'
                        ref={(digit3) => {
                            this.digit3 = digit3;
                        }}
                        selectionColor="#000"
                        style={{
                            fontFamily: 'Poppins-Medium',
                            fontSize: 20,
                            width: '100%',
                            color: 'black',
                            textAlign: 'center',
                        }}
                        keyboardType="numeric"
                        maxLength={1}
                        onChange={() => this.changeI3()}
                        onChangeText={async (digit3) => {
                            await this.setState({ digit3 });
                            this.sendProps();
                        }}
                    />
                </OTPInputComponent>
                <OTPInputComponent>
                    <TextInput
                        returnKeyType='done'
                        ref={(digit4) => {
                            this.digit4 = digit4;
                        }}
                        selectionColor="#000"
                        style={{
                            fontFamily: 'Poppins-Medium',
                            fontSize: 20,
                            alignSelf: 'center',
                            width: '100%',
                            color: 'black',
                            textAlign: 'center',
                        }}
                        keyboardType="numeric"
                        maxLength={1}
                        onChangeText={async (digit4) => {
                            await this.setState({ digit4 });
                            this.sendProps();
                        }}
                    />
                </OTPInputComponent>
            </View>
        );
    }
}

export default OTPInput;

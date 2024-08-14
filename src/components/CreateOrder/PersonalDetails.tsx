import { hp, wp } from "src/app/Login";
import React, { Component } from "react";
import { Text, View, TextInput } from "react-native";
import { width } from "src/constants";

interface NameInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

interface NumberInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

class NameInput extends Component<NameInputProps> {
  render() {
    return (
      <View style={{ justifyContent: "center" }}>
        <Text
          style={{
            color: "#777777",
            fontFamily: "Poppins-Regular",
            fontSize: hp('1.9%'),
          }}
        >
          Name
        </Text>
        <View
          style={{
            width: wp('43%'),
            height: hp('5%'),
            borderRadius: hp('0.6%'),
            backgroundColor: "#fff",
            borderWidth: 0.5,
            borderColor: "#000",
          }}
        >
          <TextInput
            returnKeyType='done'
            selectionColor="#000"
            placeholder="Enter name"
            style={{
              color: "black",
              fontSize: hp('2.1%'),
              height: hp('5%'),
              paddingLeft: wp('3%'),
              fontFamily: "Poppins-Regular",
              paddingVertical: 0,
            }}
            value={this.props.value}
            onChangeText={this.props.onChangeText}
          />
        </View>
      </View>
    );
  }
}

class NumberInput extends Component<NumberInputProps> {
  render() {
    return (
      <View>
        <Text
          style={{
            color: "#777777",
            fontFamily: "Poppins-Regular",
            fontSize:  hp('1.9%'),
          }}
        >
          Phone number
        </Text>
        <View
          style={{
            height: hp('5%'),
            borderRadius: hp('0.6%'),
            backgroundColor: "#fff",
            borderWidth: 0.5,
            justifyContent: "center",
            flexDirection: "row",
            borderColor: "#000",
            width : wp('43%')
          }}
        >
          <View
            style={{
              width: "25%",
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
              borderRightColor: "#777777",
              borderRightWidth: 0.5,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-Regular",
                color: "#777777",
                marginTop: 2,
                fontSize: hp('2.1%'),
              }}
            >
              +91
            </Text>
          </View>
          <View
            style={{
              width: "75%",
              justifyContent: "center",
              height: hp('5%'),

              alignItems: "center",
            }}
          >
            <TextInput
              returnKeyType='done'
              editable={true}
              selectionColor="#d20000"
              maxLength={10}
              keyboardType="phone-pad"
              placeholder="Phone number"
              style={{
                textAlignVertical: "center",
                fontSize: hp('2.1%'),
              height: hp('5%'),
              paddingLeft: wp('3%'),
                color: "black",
                width: "100%",
                fontFamily: "Poppins-Regular",
                paddingVertical: 0,
              }}
              value={this.props.value}
              onChangeText={this.props.onChangeText}
            />
          </View>
        </View>
      </View>
    );
  }
}

interface PersonalDetailsProps {
  name: string;
  number: string;
  callbackAsName: (name: string) => void;
  callbackAsNumber: (number: string) => void;
}

class PersonalDetails extends Component<PersonalDetailsProps> {
  render() {
    return (
      <View style={{ margin: 10, marginTop: 15 , paddingHorizontal:8 }}>
        <Text
          style={{
            fontFamily: "Poppins-Regular",
            color: "#000000",
            fontSize: hp('2.3%'),
            // marginLeft: 5,
            marginBottom: hp('0.6%'),
          }}
        >
          Personal Details
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <NameInput
            value={this.props.name}
            onChangeText={(name) => {
              this.props.callbackAsName(name);
            }}
          />
          <NumberInput
            value={this.props.number}
            onChangeText={(number) => {
              this.props.callbackAsNumber(number);
            }}
          />
        </View>
      </View>
    );
  }
}
export default PersonalDetails;

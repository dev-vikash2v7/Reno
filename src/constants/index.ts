import { Dimensions } from "react-native";

export const height = Dimensions.get("screen").height;
export const width = Dimensions.get("screen").width;

export const IST = (5 * 60 +30) * 60 * 1000 //+5:30 from UTC


export const ONBOARDING = [
  {
    ASSET: require("src/assets/PassMain.png"),
  },
  {
    ASSET: require("src/assets/pass-benifit.jpg"),
  },
];

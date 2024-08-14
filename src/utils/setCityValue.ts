import axios from "../api";
//set jwt token to header

const setCityValue = city => {
  if (city) {
    axios.defaults.headers.common["city"] = city;
  } else {
    delete axios.defaults.headers.common["city"];
  }
};

export default setCityValue;

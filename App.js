/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState, useEffect} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import axios from 'axios'

function App() {
  const SK_API_KEY = "SK_API_KEY"
  const URLRoute = "https://apis.openapi.sk.com/tmap/routes?version=1&format=json&callback=result"
  const URLAddress = "https://apis.openapi.sk.com/tmap/geo/reversegeocoding"
  
  const [routeData, setRouteData] = useState({});
  const [address, setAddress] = useState({});
  
  
  const getRoute = () => {
      axios.get(URLRoute, {
       params: {
        appKey : SK_API_KEY,
        startX : '126.9131113',
        startY : '37.5702936',
        endX : '126.9178121',
        endY : '37.5748750',
       }, 
     })
    .then(response => console.log(JSON.stringify(response.data)))
    .catch(errors => {console.log(errors)}) 

}

const getAddress = () => {
  axios
    .get(URLAddress,{
      params: {
        version: 1,
        lat: "37.403049076341794",
        lon: "127.10331814639885",
        appKey: SK_API_KEY,
        format: "json",
        callback: "result",
      } 
    })
    .then(function(response) {
      setAddress(response.data);
      console.log(response.data)
//        console.log(JSON.stringify(response.data));
    })
    .catch(function(error) {
      console.log("error!!!");
    })
    .finally(function() {
      console.log("finally Called")
    });
};

useEffect ( () => {
  getRoute();
}, [])
  return (
    <View>
      <Text>Test App</Text>
    </View>
  );
};

export default App;

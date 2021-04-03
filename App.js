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
  const SK_API_KEY = "SK_API_KEY";
  const URLRoute = "https://apis.openapi.sk.com/tmap/routes?version=1&format=json&callback=result";
  const URLPoi = "https://apis.openapi.sk.com/tmap/pois";
  const URLAddress = "https://apis.openapi.sk.com/tmap/geo/reversegeocoding";
  
  const [routeData, setRouteData] = useState({});
  const [address, setAddress] = useState({});
  const [csData, setCSData] = useState([]);
  const [csPoint, setCSPoint] = useState([]);
  const startLat = 37.508194;
  const startLon = 126.709094;
  const endLat = 37.517119;
  const endLon = 126.739392 
  
  const getRoute = () => {
    var csTempData = [];  
    axios.get(URLRoute, {
       params: {
        appKey : SK_API_KEY,
        startX : startLon.toString(),
        startY : startLat.toString(),
        endX : endLon.toString(),
        endY : endLat.toString(),
       }, 
     })
    .then(response => {
      var route = [];
      var csGetPoint = [[startLon, startLat]]
      var count = 1.0;
      var totalDist = 0.0;
      var allArr = response.data.features;
      var length = allArr.length;
      
      for (var i = 0; i < length ; i++) {
        if (allArr[i].geometry.type == "LineString") {
          var cordi = allArr[i].geometry.coordinates;
          route.push(...cordi);
          var totalDist = totalDist + Number(allArr[i].properties.distance)
          if (totalDist > count*1000.0) {
            pointLength = cordi.length-1;
            csGetPoint.push(cordi[pointLength])
            count = count+1;
          }
        }
      };

      setRouteData(route);
      csGetPoint.push([endLon, endLat]);
      console.log("csGetPoint", csGetPoint)
      getCSData(csGetPoint);
      console.log("Total dist = ", totalDist);
    })
    .catch(errors => {console.log(errors)}) 
}

getCSData = async(csGetPoint) => {
  response = [];
  console.log("In getCSDATA", csGetPoint);
  for (var i = 0; i < csGetPoint.length; i++) {
    await axios.get(URLPoi, {
      params: {
        version: 1,
        count: 2,
        searchKeyword: "EV충전소",
        centerLat: csGetPoint[i][1].toString(),
        centerLon: csGetPoint[i][0].toString(),
        appKey: SK_API_KEY,
      }
    })
    .then(
      resp => {
        response.push(...resp.data.searchPoiInfo.pois.poi)
      }
      )
  };
  setCSData(response);

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
        {console.log("In render", csData)}
        <Text>Test App</Text>
    </View>
  );
};

export default App;

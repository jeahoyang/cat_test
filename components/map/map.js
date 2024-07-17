// 현재위치 컴포넌트 코드
/*global kakao */
import React, { useEffect, useState } from "react";
import { markerdata } from "../../data/markerData.js";

export default function Map() {
  const [state, setState] = useState({
    center: null,
    errMsg: null,
    isLoading: true,
  });

  useEffect(() => {
    // Function to get user's current position using geolocation
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setState((prev) => ({
              ...prev,
              center: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              isLoading: false,
            }));
          },
          (err) => {
            setState((prev) => ({
              ...prev,
              errMsg: err.message,
              isLoading: false,
            }));
          }
        );
      } else {
        setState((prev) => ({
          ...prev,
          errMsg: "Geolocation을 사용할 수 없어요..",
          isLoading: false,
        }));
      }
    };

    // Call function to get user location
    getUserLocation();
  }, []);

  useEffect(() => {
    if (state.center) {
      mapscript();
    }
  }, [state.center]);

  const mapscript = () => {
    let container = document.getElementById("map");
    let options = {
      center: new kakao.maps.LatLng(state.center.lat, state.center.lng),
      level: 5,
    };

    // Create the map
    const map = new kakao.maps.Map(container, options);

    // Add marker for user's current location
    if (state.center) {
      const userMarker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(state.center.lat, state.center.lng),
        // Customize marker icon if needed
      });

      // Content for infowindow (if desired)
      var userContent = `
        <div style="padding: 10px;">
          <h3>현재 위치</h3>
          <p>현재 위치입니다.</p>
        </div>
      `;

      // Create infowindow for user's marker (if desired)
      var userInfoWindow = new kakao.maps.InfoWindow({
        content: userContent,
      });

      // Add mouseover and mouseout listeners (if desired)
      kakao.maps.event.addListener(
        userMarker,
        "mouseover",
        makeOverListener(map, userMarker, userInfoWindow)
      );
      kakao.maps.event.addListener(
        userMarker,
        "mouseout",
        makeOutListener(userInfoWindow)
      );
    }

    // Function to open infowindow when mouseover (if desired)
    function makeOverListener(map, marker, infowindow) {
      return function () {
        infowindow.open(map, marker);
      };
    }

    // Function to close infowindow when mouseout (if desired)
    function makeOutListener(infowindow) {
      return function () {
        infowindow.close();
      };
    }

    // Add other markers and their infowindows as per your existing logic
    markerdata.forEach((el) => {
      // Create marker for each data point
      const marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(el.lat, el.lng),
      });

      // Content for infowindow using template literals
      var content = `
        <div style="padding: 10px;">
          <h3>${el.title}</h3>
          <p><strong>도로명주소:</strong> ${el["\ub3c4\ub85c\uba85\uc804\uccb4\uc8fc\uc18c"]}</p>
          <p><strong>전화번호:</strong> ${el["\uc18c\uc7ac\uc9c0\uc804\ud654"]}</p>
        </div>
      `;

      // Create infowindow for each marker
      var infowindow = new kakao.maps.InfoWindow({
        content: content,
      });

      // Add mouseover and mouseout listeners to display and hide infowindow
      kakao.maps.event.addListener(
        marker,
        "mouseover",
        makeOverListener(map, marker, infowindow)
      );
      kakao.maps.event.addListener(
        marker,
        "mouseout",
        makeOutListener(infowindow)
      );
    });
  };

  return (
    <div id="map" style={{ width: "100vw", height: "100vh" }}>
      {state.isLoading && <p>Loading...</p>}
      {state.errMsg && <p>{state.errMsg}</p>}
    </div>
  );
}

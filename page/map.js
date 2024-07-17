// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { WebView } from 'react-native-webview';

// const KakaoMap = () => {
//   return (
//     <View style={styles.container}>
//       <WebView
//         source={{ uri: '../../frontend/components/map/kakaoMap.html' }} // for Android
//         // source={{ uri: './assets/kakaoMap.html' }} // for iOS
//         style={{ flex: 1 }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default KakaoMap;


// App.js or your desired component file
// App.js


// import * as React from 'react';
// import { WebView } from 'react-native-webview';
// import { StyleSheet } from 'react-native';
// import Constants from 'expo-constants';

// export default function App() {
//   return (
//     <WebView
//       style={styles.container}
//       source={{ uri: 'http://localhost:3000' }}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: Constants.statusBarHeight,
//   },
// });



import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions  } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>Display Pre-Designated Photo</Text> */}

      {/* Example of displaying a local image bundled with the app */}
      <Image
        source={require('./map5.png')} 
        style={styles.photo}
        resizeMode="cover"
      />

      {/* Optionally, you can add a caption or description */}
      {/* <Text style={styles.caption}>Photo of a cute cat</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  photo: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});


export default App;

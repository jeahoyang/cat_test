// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


// ===================================
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import AppNavigator from './navigation/AppNavigator';

// export default function App() {
//   return (
//     <NavigationContainer>
//       <AppNavigator />
//     </NavigationContainer>
//   );
// }
// ================================


//되는버전
// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import HomeScreen from './screens/HomeScreen';
// import CalendarScreen from './screens/CalendarScreen';

// const Stack = createStackNavigator();

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="Calendar" component={CalendarScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

// =====================================


// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
// import axios from 'axios';

// export default function App() {
//   const [users, setUsers] = useState([]);
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');

//   useEffect(() => {
//     axios.get('http://127.0.0.1:5000/api/users')
//       .then(response => {
//         setUsers(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching users:', error);
//       });
//   }, []);

//   const addUser = () => {
//     axios.post('http://127.0.0.1:5000/api/users', { username, email })
//       .then(response => {
//         setUsers([...users, response.data]);
//         setUsername('');
//         setEmail('');
//       })
//       .catch(error => {
//         console.error('Error adding user:', error);
//       });
//   };

//   return (
//     <View style={styles.container}>
//       <Text>Users:</Text>
//       {users.map(user => (
//         <Text key={user.id}>{user.username} ({user.email})</Text>
//       ))}
//       <TextInput
//         style={styles.input}
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <Button title="Add User" onPress={addUser} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 12,
//     padding: 10,
//     width: '80%',
//   },
// });

// ==========================================

// // Example form component in React Native
// import React, { useState } from 'react';
// import { View, TextInput, Button } from 'react-native';

// const CreateUserForm = () => {
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = async (event) => {
//       event.preventDefault();
//       try {
//           const response = await fetch('http://localhost:5000/api/users', {
//               method: 'POST',
//               headers: {
//                   'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                   username: username,
//                   email: email,
//                   password: password,
//               }),
//           });

//           if (!response.ok) {
//               throw new Error('Network response was not ok');
//           }

//           const data = await response.json();
//           console.log(data); // Log successful response

//       } catch (error) {
//           console.error('Error:', error.message); // Log error message
//       }
//   };

//     return (
//         <View>
//             <TextInput
//                 placeholder="Username"
//                 value={username}
//                 onChangeText={text => setUsername(text)}
//             />
//             <TextInput
//                 placeholder="Email"
//                 value={email}
//                 onChangeText={text => setEmail(text)}
//             />
//             <TextInput
//                 placeholder="Password"
//                 secureTextEntry
//                 value={password}
//                 onChangeText={text => setPassword(text)}
//             />
//             <Button
//                 title="Submit"
//                 onPress={handleSubmit}
//             />
//         </View>
//     );
// };

// export default CreateUserForm;

// ====================

// import React, { useState } from 'react';

// function App() {
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         try {
//             const response = await fetch('http://localhost:5000/api/users', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     username: username,
//                     email: email,
//                     password: password,
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             const data = await response.json();
//             console.log(data); // Log successful response

//         } catch (error) {
//             console.error('Error:', error.message); // Log error message
//         }
//     };

//     return (
//         <div className="App">
//             <h1>Register</h1>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Username:</label>
//                     <input
//                         type="text"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                     />
//                 </div>
//                 <div>
//                     <label>Email:</label>
//                     <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                 </div>
//                 <div>
//                     <label>Password:</label>
//                     <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                 </div>
//                 <button type="submit">Register</button>
//             </form>
//         </div>
//     );
// }

// export default App;




// ======되는버전================


// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

// export default function App() {
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/api/users', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     username: username,
//                     email: email,
//                     password: password,
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             const data = await response.json();
//             Alert.alert('Success', JSON.stringify(data)); // Alert successful response

//         } catch (error) {
//             Alert.alert('Error', error.message); // Alert error message
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.heading}>Register</Text>
//             <View style={styles.inputContainer}>
//                 <Text>Username:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={username}
//                     onChangeText={setUsername}
//                 />
//             </View>
//             <View style={styles.inputContainer}>
//                 <Text>Email:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={email}
//                     onChangeText={setEmail}
//                     keyboardType="email-address"
//                 />
//             </View>
//             <View style={styles.inputContainer}>
//                 <Text>Password:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={password}
//                     onChangeText={setPassword}
//                     secureTextEntry
//                 />
//             </View>
//             <Button title="Register" onPress={handleSubmit} />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         padding: 16,
//     },
//     heading: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 24,
//         textAlign: 'center',
//     },
//     inputContainer: {
//         marginBottom: 16,
//     },
//     input: {
//         height: 40,
//         borderColor: 'gray',
//         borderWidth: 1,
//         paddingLeft: 8,
//     },
// });

// =========================================

// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Button } from 'react-native';
// import Login from '../frontend/page/login';
// import Register from '../frontend/page/register';
// import Home from '../frontend/page/home';
// import ImageAnalysis from '../frontend/page/imageAnalysis';
// import Map from '../frontend/page/map';
// import Calendar from '../frontend/page/calendar';
// import CatRegistrationScreen from '../frontend/page/CatRegistrationScreen';

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// function HomeTabs() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Home" component={Home} />
//       <Tab.Screen name="ImageAnalysis" component={ImageAnalysis} />
//       <Tab.Screen name="Map" component={Map} />
//       <Tab.Screen name="Calendar" component={Calendar} />
//     </Tab.Navigator>
//   );
// }

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login"> 
//         <Stack.Screen name="Login" component={Login} />
//         <Stack.Screen name="Register" component={Register} />
//         <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
//         {/* <Stack.Screen name="Home" component={Home} /> */}
//         <Stack.Screen name="registerCat" component={CatRegistrationScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


// import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from 'react-native';
import Login from '../frontend/page/login';
import Register from '../frontend/page/register';
import Home from '../frontend/page/home';
import ImageAnalysis from '../frontend/page/imageAnalysis';
import Map from '../frontend/page/map';
import CalendarPage from '../frontend/page/calendar';
import CatRegistrationScreen from '../frontend/page/CatRegistrationScreen'; // Ensure this path is correct
import KakaoMap from '../frontend/page/KakaoMap';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="ImageAnalysis" component={ImageAnalysis} />
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Calendar" component={CalendarPage} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="registerCat" component={CatRegistrationScreen} />
        <Stack.Screen name="Calendar" component={CalendarPage} />
        <Tab.Screen name="Map" component={Map} />
        <Stack.Screen name="KakaoMap" component={KakaoMap} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


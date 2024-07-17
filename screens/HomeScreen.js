// import React, { useState, useEffect } from 'react';
// import { View, Text, Button } from 'react-native';
// import axios from 'axios';
// import api from '../api/api';

// export default function HomeScreen({ navigation }) {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Fetch user data here
//     api.get('/user').then(response => {
//       setUser(response.data);
//     });
//   }, []);

//   return (
//     <View>
//       <Text>Home Screen</Text>
//       <Button title="Analyze Photo" onPress={() => navigation.navigate('Analysis')} />
//       <Button title="Find Animal Hospitals" onPress={() => navigation.navigate('Map')} />
//       <Button title="Calendar" onPress={() => navigation.navigate('Calendar')} />
//     </View>
//   );
// }


// ================ 되는버전 =================
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { getUser } from '../api/api'; // Adjust path as needed

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUser(); // Call the getUser method
        setUser(response.data); // Assuming response.data contains user data
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error state or alert user
      }
    };

    fetchUserData(); // Call the async function
  }, []);

  return (
    <View>
      <Text>Home Screen</Text>
      <Button title="Analyze Photo" onPress={() => navigation.navigate('Analysis')} />
      <Button title="Find Animal Hospitals" onPress={() => navigation.navigate('Map')} />
      <Button title="Calendar" onPress={() => navigation.navigate('Calendar')} />
      {/* Display user data if available */}
      {user && <Text>Welcome, {user.name}</Text>}
    </View>
  );
}

// =================================================
// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
// import api from '../api/api';

// const HomeScreen = ({ navigation }) => {
//   const [user, setUser] = useState(null);
//   const [name, setName] = useState('');

//   useEffect(() => {
//     api.get('/users')
//       .then(response => {
//         setUser(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching users:', error);
//       });
//   }, []);

//   const createUser = () => {
//     api.post('/users', { name })
//       .then(response => {
//         console.log('User created:', response.data);
//         setName('');
//         // Optionally refetch users or update state
//       })
//       .catch(error => {
//         console.error('Error creating user:', error);
//       });
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter name"
//         value={name}
//         onChangeText={text => setName(text)}
//       />
//       <Button title="Create User" onPress={createUser} />
//       <View>
//         {user ? (
//           user.map(u => (
//             <Text key={u.id}>{u.name}</Text>
//           ))
//         ) : (
//           <Text>Loading users...</Text>
//         )}
//       </View>
//       <Button title="Go to Calendar" onPress={() => navigation.navigate('Calendar')} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 12,
//     padding: 8,
//   },
// });

// export default HomeScreen;


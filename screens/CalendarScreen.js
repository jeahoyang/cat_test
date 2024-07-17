// import React, { useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { Calendar } from 'react-native-calendars';

// const CalendarScreen = () => {
//   const [selectedDate, setSelectedDate] = useState('');

//   const handleDayPress = (day) => {
//     setSelectedDate(day.dateString);
//   };

//   return (
//     <View style={styles.container}>
//       <Calendar
//         onDayPress={handleDayPress}
//         markedDates={{
//           [selectedDate]: { selected: true, selectedColor: 'orange' }
//         }}
//       />
//       <View style={styles.selectedDateContainer}>
//         <Text style={styles.selectedDateText}>Selected Date: {selectedDate}</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   selectedDateContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   selectedDateText: {
//     fontSize: 18,
//   },
// });

// export default CalendarScreen;


//==================되는 버전=====================
// import React, { useState } from 'react';
// import { View, StyleSheet, Text } from 'react-native';
// import { Calendar } from 'react-native-calendars';

// const CalendarScreen = () => {
//   const [selectedDate, setSelectedDate] = useState('');

//   const handleDayPress = (day) => {
//     setSelectedDate(day.dateString);
//   };

//   return (
//     <View style={styles.container}>
//       <Calendar
//         onDayPress={handleDayPress}
//         markedDates={{
//           [selectedDate]: { selected: true, selectedColor: 'orange' }
//         }}
//       />
//       <View style={styles.selectedDateContainer}>
//         <Text style={styles.selectedDateText}>Selected Date: {selectedDate}</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     padding: 20,
//   },
//   selectedDateContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   selectedDateText: {
//     fontSize: 18,
//   },
// });

// export default CalendarScreen;



// =====================================

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: 'orange' }
        }}
      />
      <View style={styles.selectedDateContainer}>
        <Text style={styles.selectedDateText}>Selected Date: {selectedDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  selectedDateContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 18,
  },
});

export default CalendarScreen;

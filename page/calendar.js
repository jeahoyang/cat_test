import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import axios from 'axios';

// Set locale for the calendar
LocaleConfig.locales['en'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today'
};
LocaleConfig.defaultLocale = 'en';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [notes, setNotes] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [note, setNote] = useState('');
  const [sortAsc, setSortAsc] = useState(true); // State to toggle sorting order

  const API_URL = 'http://localhost:5000/events';  // Changed to localhost

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(API_URL);
      // Sort events by start_date in ascending order by default
      const sortedEvents = response.data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

      // Filter to keep only the latest note for each unique date
      const filteredEvents = {};
      sortedEvents.forEach(event => {
        // Use the latest note based on ID for each date
        if (!filteredEvents[event.start_date] || event.id > filteredEvents[event.start_date].id) {
          filteredEvents[event.start_date] = event;
        }
      });

      // Convert filteredEvents to the format required by markedDates in Calendar component
      const markedDates = Object.keys(filteredEvents).reduce((acc, date) => {
        const event = filteredEvents[date];
        acc[date] = { selected: true, marked: true, selectedColor: '#FFEB7F', note: event.note };
        return acc;
      }, {});
      
      setNotes(markedDates);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setNote(notes[day.dateString]?.note || '');
    setModalVisible(true);
  };

  const saveNote = async () => {
    try {
      const newEvent = {
        title: '달력',
        start_date: selectedDate,
        note: note,
      };
      await axios.post(API_URL, newEvent);
      setModalVisible(false);
      setNote('');
      fetchEvents();  // Refresh events to include the new note
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const toggleSortOrder = () => {
    setSortAsc(!sortAsc); // Toggle sorting order between ascending and descending
    const sortedDates = Object.keys(notes).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return sortAsc ? dateA - dateB : dateB - dateA; // Sort based on current sort order
    });

    const sortedNotes = sortedDates.reduce((acc, date) => {
      acc[date] = notes[date];
      return acc;
    }, {});

    setNotes(sortedNotes);
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={notes}
      />
      <ScrollView style={styles.notesContainer}>
        <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
          <Text style={styles.sortButtonText}>
            {sortAsc ? '최신 순으로 확인' : '오래된 순으로 확인'}
          </Text>
        </TouchableOpacity>
        {Object.keys(notes).map((date, index) => (
          <TouchableOpacity
            key={index}
            style={styles.note}
            onPress={() => {
              setSelectedDate(date);
              setNote(notes[date].note);
              setModalVisible(true);
            }}
          >
            <Text style={styles.noteDate}>{date}</Text>
            <Text>{notes[date].note}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Note for {selectedDate}</Text>
            <TextInput
              style={styles.textInput}
              value={note}
              onChangeText={setNote}
              placeholder="메모를 작성하세요."
              multiline
            />
            <TouchableOpacity style={styles.button} onPress={saveNote}>
              <Text style={styles.buttonText}>메모 저장</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  notesContainer: {
    flex: 1,
  },
  note: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  noteDate: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10
  },
  textInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#FFEB7F',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  sortButton: {
    backgroundColor: '#FFEB7F',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  sortButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CalendarPage;

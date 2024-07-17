import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [randomDisease, setRandomDisease] = useState('');
  const [diseaseDescription, setDiseaseDescription] = useState('');
  const [consecutiveCount, setConsecutiveCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const diseases = [
    { name: '각막궤양', description: 'Description for Disease 1' },
    { name: '각막부골편', description: 'Description for Disease 2' },
    { name: '결막염', description: 'Description for Disease 3' },
    { name: '비궤양성각막염', description: 'Description for Disease 4' },
    { name: '안건염', description: 'Description for Disease 5' },
    { name: '무증상', description: 'Description for Disease 6' },
  ];

  const selectImageHandler = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets) {
        const source = { uri: response.assets[0].uri };
        setSelectedImage(source);
      }
    });
  };

  const analyzeImageHandler = () => {
    setLoading(true);
    setTimeout(() => {
      let randomIndex;
      if (consecutiveCount < 2) {
        randomIndex = Math.floor(Math.random() * diseases.length);
        if (diseases[randomIndex].name === randomDisease) {
          setConsecutiveCount(consecutiveCount + 1);
        } else {
          setConsecutiveCount(0);
        }
      } else {
        do {
          randomIndex = Math.floor(Math.random() * diseases.length);
        } while (diseases[randomIndex].name === randomDisease);
        setConsecutiveCount(0);
      }

      const selectedDisease = diseases[randomIndex];
      setRandomDisease(selectedDisease.name);
      setDiseaseDescription(selectedDisease.description);
      setLoading(false);
    }, 2000); // Simulate a 2-second loading time
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>              고양이의 눈을 {'\n'}10cm보다 가까이에서 찍으시오</Text>
      <Text style={styles.title}>이미지 질병 분석</Text>
      {selectedImage && <Image source={selectedImage} style={styles.image} />}
      <TouchableOpacity style={styles.button} onPress={selectImageHandler}>
        <Text style={styles.buttonText}>이미지 업로드</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={analyzeImageHandler}>
        <Text style={styles.buttonText}>이미지 분석</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      {randomDisease !== '' && !loading && (
        <View style={styles.resultContainer}>
          <Text style={styles.diseaseText}>{randomDisease}</Text>
          <Text style={styles.descriptionText}>{diseaseDescription}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  instruction: {
    fontSize: 18,
    color: '#555555',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    marginVertical: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#FFEB7F',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 10,
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  diseaseText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;

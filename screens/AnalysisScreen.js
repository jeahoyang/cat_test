import React, { useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import api from '../api/api';

export default function AnalysisScreen() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      // You can upload image here to your Flask backend for analysis
      let formData = new FormData();
      formData.append('file', {
        uri: result.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      api.post('/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        // Handle response from server
      })
      .catch(error => {
        console.error(error);
      });
    }
  };

  return (
    <View>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Text>Analysis Screen</Text>
    </View>
  );
}

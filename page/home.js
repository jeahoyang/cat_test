import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Home = () => {
  const defaultUserId = 1;

  const [user, setUser] = useState(null);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infoVisible, setInfoVisible] = useState(false); // State for information view


  const navigation = useNavigation();

  const fetchUserData = async () => {
    try {
      const userResponse = await fetch(`http://localhost:5000/user/${defaultUserId}`);
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await userResponse.json();
      setUser(userData);

      const catsResponse = await fetch(`http://localhost:5000/user/${defaultUserId}/cats`);
      if (!catsResponse.ok) {
        throw new Error('Failed to fetch cats data');
      }
      const catsData = await catsResponse.json();
      setCats(catsData);

      setLoading(false);
    } catch (error) {
      console.error('Fetch Data Error:', error);
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleCatRegistration = () => {
    navigation.navigate('registerCat'); // Navigate to RegisterCat screen
  };

  const toggleInfoView = () => {
    setInfoVisible(!infoVisible);
  };


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user data found</Text>
      </View>
    );
  }

  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.infoButton} onPress={toggleInfoView}>
        <Text style={styles.infoButtonText}>i</Text>
      </TouchableOpacity>

      {infoVisible && (
        <View style={styles.infoView}>
          <Text style={styles.infoTitle}>냥만닥터 어플리케이션을 소개합니다.</Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoHeader}>1. 고양이 눈을 사진찍어 올리면 고양이가 어떤 눈 질환을 가지고 있는지 검사가 가능합니다.</Text> 
            {'\n'}정확도를 위해 10cm 거리에서 찍어서 올릴것을 추천합니다.
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoHeader}>2. 현재 위치를 기반으로 주위 동물병원의 위치 확인이 가능합니다.</Text> 
            {'\n'}왼쪽 상단의 버튼을 클릭하면 리스트형태로 병원들을 확인할 수 있습니다.
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoHeader}>3. 달력에 고양이의 정보를 작성할 수 있습니다.</Text> 
            {'\n'}날짜 순으로 리스트로도 확인이 가능합니다.
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={toggleInfoView}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.title}>Welcome, {user.username}!</Text>
      <Text style={styles.subtitle}>등록된 고양이:</Text>
      <FlatList
        style={styles.catsContainer}
        data={cats}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.catItem}>
            <Text style={styles.catName}>이름: {item.name}</Text>
            <Text style={styles.catDetails}>종: {item.breed}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCatRegistration}>
          <Text style={styles.buttonText}>고양이 등록</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#555555',
  },
  catsContainer: {
    width: '100%',
    marginTop: 10,
  },
  catItem: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  catName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  catDetails: {
    fontSize: 14,
    color: '#666666',
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd',
    marginVertical: 8,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  buttonContainer: {
    marginBottom: 20, // Adjust the space above the button here
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FFEB7F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  infoButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333333',
  },
  infoHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555555',
  },
  infoText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#FFEB7F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  infoView: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
    zIndex: 5,
    borderWidth: 1, // Adding a border width
    borderColor: '#CCCCCC', // Border color
  },
});

export default Home;

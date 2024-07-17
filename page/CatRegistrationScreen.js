import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Modal } from 'react-native';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const handleSubmit = async () => {
        try {
            if (!name || !breed || !age || !weight) {
                throw new Error('Please fill out all fields');
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('breed', breed);
            formData.append('age', age);
            formData.append('weight', weight);

            // Add image if needed (not included in this example)

            const response = await fetch('http://localhost:5000/cats', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setModalVisible(true); // Show modal on successful registration

        } catch (error) {
            Alert.alert('Error', error.message); // Alert error message
        }
    };

    const clearForm = () => {
        setName('');
        setBreed('');
        setAge('');
        setWeight('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>고양이 등록</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>이름:</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="고양이 이름:"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>종:</Text>
                <TextInput
                    style={styles.input}
                    value={breed}
                    onChangeText={setBreed}
                    placeholder="고양이 종:"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>나이:</Text>
                <TextInput
                    style={styles.input}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    placeholder="고양이 나이:"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>몸무게:</Text>
                <TextInput
                    style={styles.input}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    placeholder="고양이 몸무게:"
                />
            </View>
            {/* Image upload can be added here */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>고양이 등록</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>고양이 등록에 성공하셨습니다!</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setModalVisible(false);
                                clearForm(); // Clear form after closing modal
                                navigation.navigate('Home'); // Navigate back to Home
                            }}
                        >
                            <Text style={styles.closeButtonText}>닫기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#333',
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555',
    },
    input: {
        height: 48,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#FFEB7F',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#FFEB7F',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});

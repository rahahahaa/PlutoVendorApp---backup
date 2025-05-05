// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function LoginScreen() {
    const [email, setEmail] = useState('vendor@plutoride.com');
    const [password, setPassword] = useState('password');
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const response = await api.post('/auth/login', { email, password });
            await AsyncStorage.setItem('token', response.data.token);
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Error', 'Login failed. Check credentials.');
            console.error('Login Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
});
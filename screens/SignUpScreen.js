import React, { useState, useContext } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

export default function SignUpScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigation = useNavigation();
    const { login } = useContext(AuthContext);

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }
        // Mock sign-up success
        if (email && password) {
            await login("mock-token-123");
            navigation.navigate("Home");
        } else {
            Alert.alert("Error", "Sign up failed");
        }
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.formBox}>
                <Image source={require('../assets/Pluto.png')} style={styles.logo} />
                <Text style={styles.appName}>Plutooride</Text>
                <View style={styles.form}>
                    <Text style={styles.title}>Sign up</Text>
                    <Text style={styles.subtitle}>Create a free account with your email.</Text>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            autoCapitalize="words"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                        <Text style={styles.buttonText}>Sign up</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.formSection}>
                    <Text style={styles.formSectionText}>
                        Have an account?{' '}
                        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                            Log in
                        </Text>
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0ecfb',
        padding: 20,
    },
    formBox: {
        maxWidth: 300,
        width: '100%',
        backgroundColor: '#f1f7fe',
        borderRadius: 16,
        overflow: 'hidden',
        color: '#010101',
        alignItems: 'center',
        paddingVertical: 20,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 20,
        marginBottom: 8,
        resizeMode: 'contain',
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0066ff',
        marginBottom: 16,
    },
    form: {
        width: '100%',
        paddingHorizontal: 24,
        gap: 16,
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 4,
        color: '#010101',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
        textAlign: 'center',
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        width: '100%',
        marginBottom: 16,
        overflow: 'hidden',
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingHorizontal: 15,
        fontSize: 14,
    },
    button: {
        backgroundColor: '#0066ff',
        borderRadius: 24,
        paddingVertical: 10,
        paddingHorizontal: 16,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    formSection: {
        padding: 16,
        // backgroundColor: '#d0dffb',
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 1,
        shadowRadius: 0,
        alignItems: 'center',
    },
    formSectionText: {
        fontSize: 14,
        color: '#010101',
    },
    link: {
        fontWeight: 'bold',
        color: '#0066ff',
        textDecorationLine: 'underline',
    },
});

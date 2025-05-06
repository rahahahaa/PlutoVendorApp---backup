import React, { useState, useContext, useRef } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

export default function SignUpScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordFocused, setPasswordFocused] = useState(false);
    const navigation = useNavigation();
    const { login } = useContext(AuthContext);

    const buttonScale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const passwordStrength = () => {
        if (password.length === 0) return '';
        if (password.length < 4) return 'Weak';
        if (password.length < 8) return 'Medium';
        return 'Strong';
    };

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
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                autoCapitalize="words"
                            />
                        </View>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                        <View style={[styles.inputWrapper, passwordFocused && styles.inputFocused]}>
                            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                            />
                        </View>
                        {password.length > 0 && (
                            <Text style={[styles.passwordStrength, passwordStrength() === 'Weak' ? styles.weak : passwordStrength() === 'Medium' ? styles.medium : styles.strong]}>
                                Password strength: {passwordStrength()}
                            </Text>
                        )}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>
                    </View>
                    <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSignUp}
                            activeOpacity={0.8}
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}
                        >
                            <Text style={styles.buttonText}>Sign up</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    {/* <View style={styles.socialLoginContainer}>
                        <Text style={styles.socialLoginText}>Or sign up with</Text>
                        <View style={styles.socialButtons}>
                            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#db4437' }]}>
                                <FontAwesome name="google" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#000' }]}>
                                <FontAwesome name="apple" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#3b5998' }]}>
                                <FontAwesome name="facebook" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View> */}
                    <View style={styles.securitySection}>
                        <Ionicons name="shield-checkmark-outline" size={20} color="#4caf50" />
                        <Text style={styles.securityText}>Protected by encryption</Text>
                    </View>
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
        backgroundColor: '#d0e1fd',
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius:20,
        marginBottom: 8,
        resizeMode: 'contain',
    },
    appName: {
        fontSize: 32,
        fontWeight: '900',
        fontFamily: 'Arial Black, Arial, sans-serif',
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
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#666',
        paddingHorizontal: 15,
        height: 40,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        height: '100%',
    },
    inputFocused: {
        borderBottomColor: '#0066ff',
    },
    passwordStrength: {
        marginTop: 4,
        fontSize: 8,
        paddingLeft:5,
        fontWeight: '600',
    },
    weak: {
        color: 'red',
    },
    medium: {
        color: 'orange',
    },
    strong: {
        color: 'green',
    },
    button: {
        backgroundColor: '#4b6cb7',
        borderRadius: 24,
        paddingVertical: 10,
        paddingHorizontal: 16,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#4b6cb7',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    socialLoginContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    socialLoginText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 180,
    },
    socialButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    securitySection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    securityText: {
        marginLeft: 8,
        fontSize: 12,
        color: '#4caf50',
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

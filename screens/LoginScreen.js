import React, { useState, useContext, useRef, useEffect } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    Animated,
    SafeAreaView,
    StatusBar,
    Dimensions,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { loginCabUser } from '../services/api';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const navigation = useNavigation();
    const { login } = useContext(AuthContext);

    const buttonScale = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        // Animate the login form when component mounts
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start();

        // Pre-populate for development/testing only
        setEmail('vendor@plutoride.com');
        setPassword('password');
    }, []);

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

    const handleLogin = async () => {
        if (!email.trim()) {
            Alert.alert("Error", "Please enter your email");
            return;
        }
        if (!password) {
            Alert.alert("Error", "Please enter your password");
            return;
        }

        setLoading(true);
        try {
            const response = await loginCabUser(email, password);
            if (response && response.token) {
                await login(response.token);
                navigation.navigate('Home');
            } else {
                Alert.alert('Error', 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleRememberMe = () => {
        setRememberMe(!rememberMe);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <LinearGradient
                colors={['#4b6cb7', '#182848']}
                style={styles.gradientBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <ScrollView contentContainerStyle={styles.wrapper}>
                <Animated.View
                    style={[
                        styles.formBox,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={styles.logoContainer}>
                        <Image source={require('../assets/Pluto.png')} style={styles.logo} />
                        <Text style={styles.appName}>Plutooride</Text>
                        <Text style={styles.tagline}>Drive with us. Earn with us.</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Log in to your account</Text>

                        <View style={styles.formContainer}>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail" size={20} color="#2C3E50" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="#95A5A6"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>

                            <View style={[styles.inputWrapper, passwordFocused && styles.inputFocused]}>
                                <Ionicons name="lock-closed" size={20} color="#2C3E50" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#95A5A6"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setPasswordFocused(true)}
                                    onBlur={() => setPasswordFocused(false)}
                                />
                                <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
                                    <Ionicons
                                        name={showPassword ? "eye-off" : "eye"}
                                        size={20}
                                        color="#2C3E50"
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.optionsRow}>
                                <TouchableOpacity
                                    style={styles.checkboxRow}
                                    onPress={toggleRememberMe}
                                >
                                    <Ionicons
                                        name={rememberMe ? "checkbox" : "square-outline"}
                                        size={20}
                                        color="#4b6cb7"
                                    />
                                    <Text style={styles.rememberMeText}>Remember me</Text>
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={handleLogin}
                                activeOpacity={0.8}
                                onPressIn={onPressIn}
                                onPressOut={onPressOut}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Log In</Text>
                                )}
                            </TouchableOpacity>
                        </Animated.View>

                        <View style={styles.orSection}>
                            <View style={styles.divider} />
                            <Text style={styles.orText}>OR</Text>
                            <View style={styles.divider} />
                        </View>

                        {/* <View style={styles.socialButtonsContainer}>
                            <TouchableOpacity style={styles.socialButton}>
                                <Ionicons name="logo-google" size={20} color="#4285F4" />
                                <Text style={styles.socialButtonText}>Google</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.socialButton}>
                                <Ionicons name="logo-apple" size={20} color="#000000" />
                                <Text style={styles.socialButtonText}>Apple</Text>
                            </TouchableOpacity>
                        </View> */}

                        <View style={styles.securitySection}>
                            <Ionicons name="shield-checkmark" size={20} color="#34C759" />
                            <Text style={styles.securityText}>Your data is secure and encrypted</Text>
                        </View>
                    </View>

                    <View style={styles.formFooter}>
                        <Text style={styles.formFooterText}>
                            Don't have an account?{' '}
                            <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
                                Sign up
                            </Text>
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    gradientBackground: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height * 0.4,
    },
    wrapper: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    formBox: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    logoContainer: {
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 20,
    },
    logo: {
        width: 70,
        height: 70,
        borderRadius: 20,
        marginBottom: 12,
        resizeMode: 'contain',
    },
    appName: {
        fontSize: 36,
        fontWeight: '900',
        color: '#4b6cb7',
        marginBottom: 6,
    },
    tagline: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 10,
    },
    form: {
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#7F8C8D',
        marginBottom: 24,
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#2C3E50',
        height: '100%',
    },
    inputFocused: {
        borderColor: '#4b6cb7',
    },
    eyeIcon: {
        padding: 4,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 8,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rememberMeText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#2C3E50',
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#4b6cb7',
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#4b6cb7',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#4b6cb7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },
    orSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    orText: {
        marginHorizontal: 16,
        color: '#7F8C8D',
        fontWeight: '600',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        flex: 0.48,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    socialButtonText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#2C3E50',
    },
    securitySection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    securityText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#34C759',
        fontWeight: '500',
    },
    formFooter: {
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingVertical: 20,
        alignItems: 'center',
    },
    formFooterText: {
        fontSize: 15,
        color: '#2C3E50',
    },
    link: {
        fontWeight: 'bold',
        color: '#4b6cb7',
    },
});
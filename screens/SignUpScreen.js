import React, { useState, useContext, useRef } from "react";
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    Animated,
    ActivityIndicator,
    ScrollView,
    Modal,
    FlatList,
    SafeAreaView,
    StatusBar,
    Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signupCabUser } from "../services/api";

const { width, height } = Dimensions.get('window');

const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
];

export default function SignUpScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [drivingLicense, setDrivingLicense] = useState("");
    const [RC, setRC] = useState("");
    const [states, setStates] = useState([]);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stateDropdownVisible, setStateDropdownVisible] = useState(false);
    const [activeSection, setActiveSection] = useState('personal');

    const navigation = useNavigation();
    const { login } = useContext(AuthContext);

    const buttonScale = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Animate component on mount
    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
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

    const toggleStateSelection = (state) => {
        if (states.includes(state)) {
            setStates(states.filter(s => s !== state));
        } else {
            setStates([...states, state]);
        }
    };

    const passwordStrength = () => {
        if (password.length === 0) return '';
        if (password.length < 4) return 'Weak';
        if (password.length < 8) return 'Medium';
        return 'Strong';
    };

    const getPasswordStrengthColor = () => {
        const strength = passwordStrength();
        if (strength === 'Weak') return '#FF3B30';
        if (strength === 'Medium') return '#FF9500';
        return '#34C759';
    };

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }
        if (!name.trim()) {
            Alert.alert("Error", "Please enter your full name");
            return;
        }
        if (!email.trim()) {
            Alert.alert("Error", "Please enter your email");
            return;
        }
        if (!password) {
            Alert.alert("Error", "Please enter your password");
            return;
        }
        if (!mobile.trim()) {
            Alert.alert("Error", "Please enter your mobile number");
            return;
        }
        if (!drivingLicense.trim()) {
            Alert.alert("Error", "Please enter your driving license");
            return;
        }
        if (!RC.trim()) {
            Alert.alert("Error", "Please enter your RC");
            return;
        }
        if (states.length === 0) {
            Alert.alert("Error", "Please select at least one state");
            return;
        }
        setLoading(true);
        try {
            const response = await signupCabUser(name, email, password, mobile, drivingLicense, RC, states);
            if (response && response.token) {
                await login(response.token);
                navigation.navigate("Home");
            } else {
                Alert.alert("Error", "Sign up failed. Please try again.");
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Sign up failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderProgressBar = () => {
        const sections = ['personal', 'vehicle', 'credentials'];
        const currentIndex = sections.indexOf(activeSection);

        return (
            <View style={styles.progressContainer}>
                {sections.map((section, index) => (
                    <React.Fragment key={section}>
                        <View
                            style={[
                                styles.progressDot,
                                index <= currentIndex ? styles.progressDotActive : null
                            ]}
                        />
                        {index < sections.length - 1 && (
                            <View
                                style={[
                                    styles.progressLine,
                                    index < currentIndex ? styles.progressLineActive : null
                                ]}
                            />
                        )}
                    </React.Fragment>
                ))}
            </View>
        );
    };

    const renderSectionTitle = () => {
        switch (activeSection) {
            case 'personal':
                return 'Personal Information';
            case 'vehicle':
                return 'Vehicle Details';
            case 'credentials':
                return 'Create Account';
            default:
                return '';
        }
    };

    const renderFormSection = () => {
        switch (activeSection) {
            case 'personal':
                return (
                    <>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person" size={20} color="#2C3E50" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor="#95A5A6"
                                autoCapitalize="words"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
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
                        <View style={styles.inputWrapper}>
                            <Ionicons name="call" size={20} color="#2C3E50" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Mobile"
                                placeholderTextColor="#95A5A6"
                                value={mobile}
                                onChangeText={setMobile}
                                keyboardType="phone-pad"
                            />
                        </View>
                        <View style={styles.buttonRow}>
                            <Animated.View style={{ transform: [{ scale: buttonScale }], flex: 1 }}>
                                <TouchableOpacity
                                    style={styles.nextButton}
                                    onPress={() => setActiveSection('vehicle')}
                                    activeOpacity={0.8}
                                    onPressIn={onPressIn}
                                    onPressOut={onPressOut}
                                >
                                    <Text style={styles.buttonText}>Next</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </>
                );
            case 'vehicle':
                return (
                    <>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="card" size={20} color="#2C3E50" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Driving License"
                                placeholderTextColor="#95A5A6"
                                value={drivingLicense}
                                onChangeText={setDrivingLicense}
                                autoCapitalize="characters"
                            />
                        </View>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="document-text" size={20} color="#2C3E50" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="RC Number"
                                placeholderTextColor="#95A5A6"
                                value={RC}
                                onChangeText={setRC}
                                autoCapitalize="characters"
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.stateSelector}
                            onPress={() => setStateDropdownVisible(true)}
                        >
                            <Ionicons name="location" size={20} color="#2C3E50" style={styles.inputIcon} />
                            <Text style={states.length ? styles.stateText : styles.statePlaceholder}>
                                {states.length > 0
                                    ? (states.length > 2
                                        ? `${states.length} states selected`
                                        : states.join(", "))
                                    : "Select Operating States"}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#2C3E50" />
                        </TouchableOpacity>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => setActiveSection('personal')}
                            >
                                <Ionicons name="arrow-back" size={20} color="#2C3E50" />
                                <Text style={styles.backButtonText}>Back</Text>
                            </TouchableOpacity>
                            <Animated.View style={{ transform: [{ scale: buttonScale }], flex: 1 }}>
                                <TouchableOpacity
                                    style={styles.nextButton}
                                    onPress={() => setActiveSection('credentials')}
                                    activeOpacity={0.8}
                                    onPressIn={onPressIn}
                                    onPressOut={onPressOut}
                                >
                                    <Text style={styles.buttonText}>Next</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </>
                );
            case 'credentials':
                return (
                    <>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed" size={20} color="#2C3E50" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#95A5A6"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                            />
                        </View>
                        {password.length > 0 && (
                            <View style={styles.passwordStrengthContainer}>
                                <Text style={styles.passwordStrengthLabel}>Password strength:</Text>
                                <View style={styles.strengthBarContainer}>
                                    <View
                                        style={[
                                            styles.strengthBar,
                                            {
                                                width: password.length < 4 ? '33%' : password.length < 8 ? '66%' : '100%',
                                                backgroundColor: getPasswordStrengthColor()
                                            }
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.passwordStrengthText, { color: getPasswordStrengthColor() }]}>
                                    {passwordStrength()}
                                </Text>
                            </View>
                        )}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed" size={20} color="#2C3E50" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                placeholderTextColor="#95A5A6"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => setActiveSection('vehicle')}
                            >
                                <Ionicons name="arrow-back" size={20} color="#2C3E50" />
                                <Text style={styles.backButtonText}>Back</Text>
                            </TouchableOpacity>
                            <Animated.View style={{ transform: [{ scale: buttonScale }], flex: 1 }}>
                                <TouchableOpacity
                                    style={styles.signupButton}
                                    onPress={handleSignUp}
                                    activeOpacity={0.8}
                                    onPressIn={onPressIn}
                                    onPressOut={onPressOut}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <>
                                            <Text style={styles.buttonText}>Create Account</Text>
                                            <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginLeft: 8 }} />
                                        </>
                                    )}
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </>
                );
            default:
                return null;
        }
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
                            opacity: fadeAnim, transform: [{
                                translateY: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [50, 0]
                                })
                            }]
                        }
                    ]}
                >
                    <View style={styles.logoContainer}>
                        <Image source={require('../assets/Pluto.png')} style={styles.logo} />
                        <Text style={styles.appName}>Plutooride</Text>
                        <Text style={styles.tagline}>Drive with us. Earn with us.</Text>
                    </View>

                    <View style={styles.form}>
                        {renderProgressBar()}
                        <Text style={styles.sectionTitle}>{renderSectionTitle()}</Text>

                        <View style={styles.formContainer}>
                            {renderFormSection()}
                        </View>

                        <View style={styles.securitySection}>
                            <Ionicons name="shield-checkmark" size={20} color="#34C759" />
                            <Text style={styles.securityText}>Your data is secure and encrypted</Text>
                        </View>
                    </View>

                    <View style={styles.formFooter}>
                        <Text style={styles.formFooterText}>
                            Have an account?{' '}
                            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                                Log in
                            </Text>
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>

            {/* States Selection Modal */}
            <Modal visible={stateDropdownVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Operating States</Text>
                            <TouchableOpacity onPress={() => setStateDropdownVisible(false)}>
                                <Ionicons name="close-circle" size={28} color="#2C3E50" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={indianStates}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.checkboxContainer}
                                    onPress={() => toggleStateSelection(item)}
                                >
                                    <Ionicons
                                        name={states.includes(item) ? "checkbox" : "square-outline"}
                                        size={24}
                                        color="#4b6cb7"
                                    />
                                    <Text style={styles.checkboxLabel}>{item}</Text>
                                </TouchableOpacity>
                            )}
                            style={styles.statesList}
                        />
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setStateDropdownVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>
                                Confirm ({states.length} selected)
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#E0E0E0',
    },
    progressDotActive: {
        backgroundColor: '#4b6cb7',
    },
    progressLine: {
        width: 40,
        height: 3,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 4,
    },
    progressLineActive: {
        backgroundColor: '#4b6cb7',
    },
    form: {
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 20,
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: 16,
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
    stateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    stateText: {
        flex: 1,
        fontSize: 16,
        color: '#2C3E50',
    },
    statePlaceholder: {
        flex: 1,
        fontSize: 16,
        color: '#95A5A6',
    },
    passwordStrengthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -8,
        marginBottom: 16,
        paddingHorizontal: 6,
    },
    passwordStrengthLabel: {
        fontSize: 12,
        color: '#7F8C8D',
        marginRight: 8,
    },
    strengthBarContainer: {
        flex: 1,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        marginRight: 8,
    },
    strengthBar: {
        height: '100%',
        borderRadius: 2,
    },
    passwordStrengthText: {
        fontSize: 12,
        fontWeight: '600',
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginRight: 12,
    },
    backButtonText: {
        color: '#2C3E50',
        fontWeight: '600',
        marginLeft: 4,
    },
    nextButton: {
        backgroundColor: '#4b6cb7',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#4b6cb7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    signupButton: {
        backgroundColor: '#182848',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#182848',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: 380,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
    },
    statesList: {
        maxHeight: 320,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    checkboxLabel: {
        marginLeft: 12,
        fontSize: 16,
        color: '#2C3E50',
    },
    modalButton: {
        backgroundColor: '#4b6cb7',
        marginHorizontal: 20,
        marginVertical: 16,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },
});
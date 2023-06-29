import React, { useContext, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import colors from '../../../src/constants/colors';
import { AuthContext } from '../../../src/context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const SignIn = () => {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation<any>();

  const [loginId, setLoginId] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);

  const SignUp = () => {
    navigation.navigate('SignUpStack');
  }
  
  return (
    <View style={styles.rootContainer}>

      <Image source={require('../../../assets/logos/esk_logo.png')} style={styles.logo} />

      <Text style={styles.welcomeText}>Login here to continue with us</Text>
      <View style={{ marginTop: 32 }}>
        <View style={styles.inputContainer}>
          <TextInput placeholder='Login ID' keyboardType='numeric'
            style={styles.textInput}
            value={loginId} onChangeText={(val) => setLoginId(val)} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput secureTextEntry={true} placeholder='Password'
            autoCapitalize="none"
            autoCorrect={false} style={styles.textInput}
            value={password} onChangeText={(val) => setPassword(val)} />
        </View>
        <Pressable style={styles.loginButton} onPress={() => login(loginId, password)} >
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>

        <Pressable style={styles.signUpLink} onPress={() => SignUp()} >
          <Text style={styles.signUpText}>Register with us</Text>
        </Pressable>

      </View>
    </View >
  )
}

export default SignIn

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 14,
  },
  logo: {
    height: 110,
    marginBottom: 50
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary500
  },
  svgContainer: {
    alignItems: 'center'
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingBottom: 8,
    marginBottom: 24,
    alignItems: 'center',

  },
  icon: { marginRight: 8, colors: colors.primary500 },
  textInput: {
    borderWidth: 2,
    borderColor: colors.primary100,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.primary500,
    borderRadius: 8,
    width: '100%'
  },
  loginButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary500,
    borderRadius: 8
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 24,
    textAlign: 'center'
  },

  signUpLink: {
    marginTop: 20,
  },
  signUpText: {
    color: colors.primary500,
    fontSize: 20,
    textAlign: 'center',
  }

})
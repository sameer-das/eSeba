import React, { useContext, useState } from 'react';
import { Pressable, StyleSheet, Text, KeyboardAvoidingView, View, Image, ScrollView } from 'react-native';
import colors from '../../../src/constants/colors';
import { AuthContext } from '../../../src/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import AnimatedInput from '../../components/AnimatedInput';
import ButtonPrimary from '../../components/ButtonPrimary';

const SignIn = () => {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation<any>();

  const [loginId, setLoginId] = useState<string | undefined>('');
  const [password, setPassword] = useState<string | undefined>('');

  const SignUp = () => {
    navigation.navigate('SignUpStack');
  }
  return (
    <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center', backgroundColor: colors.white, }} >
      <KeyboardAvoidingView style={styles.rootContainer}>


        <Image source={require('../../../assets/logos/gpay_logo.png')} style={styles.logo} />

        <Text style={styles.welcomeText}>Please Login</Text>
        <View style={{ marginTop: 32 }}>
          <View style={[styles.inputContainer, { width: 266 }]}>
            <AnimatedInput inputLabel="User ID"
              keyboardType='numeric'
              value={loginId}
              onChangeText={(val: string) => setLoginId(val)} />
          </View>
          <View style={[styles.inputContainer, { width: 266 }]}>
            <AnimatedInput inputLabel="Password"
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
              value={password}
              onChangeText={(val: string) => setPassword(val)} />
          </View>
        </View>
        <ButtonPrimary onPress={() => login(loginId, password)}
          label='Login'
          buttonStyle={{ width: 266, marginTop: 20 }} buttonLabelStyle={{ textTransform: 'uppercase' }} />

        <Text style={styles.joinText}>Are you yet to join us ?</Text>
        <Pressable style={styles.signUpLink} onPress={() => SignUp()} >
          <Text style={styles.signUpText}>Register Now</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </ScrollView >
  )
}

export default SignIn

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 14,

  },
  logo: {
    height: 70,
    width: 70,
    marginTop: 90,
    marginBottom: 50,
    resizeMode: 'contain'
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 23,
    color: colors.grey,
  },
  svgContainer: {
    alignItems: 'center'
  },
  inputContainer: {

    width: '100%',
    flexDirection: 'row',
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
  signUpLink: {
    marginTop: 12,
  },
  signUpText: {
    color: colors.primary500,
    fontSize: 16,
    textAlign: 'center',
  },
  joinText: {
    fontSize: 16,
    lineHeight: 18.4,
    textAlign: 'center',
    color: colors.grey,

    marginTop: 100
  }

})
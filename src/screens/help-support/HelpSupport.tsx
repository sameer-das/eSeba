import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import colors from '../../constants/colors';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../../context/AuthContext';
import AnimatedInput from '../../components/AnimatedInput';
import ButtonPrimary from '../../components/ButtonPrimary';
import { postTicketInfo } from '../../API/services';
import Loading from '../../components/Loading';
import { useNavigation } from '@react-navigation/native';

const HelpSupport = () => {
  const { userData } = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const [subject, setSubject] = useState<string>('');
  const [subjectErrorMessage, setSubjectErrorMessage] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const subjectChangeHandler = (text: string) => {
    if (!text) {
      setSubjectErrorMessage('Please enter subject!')
    } else {
      setSubjectErrorMessage('')
    }
    setSubject(text)

  }
  const descriptionChangeHandler = (text: string) => {
    if (!text) {
      setDescriptionErrorMessage('Please describe your issue!')
    } else {
      setDescriptionErrorMessage('');
    }
    setDescription(text);

  }

  const onSubmit = async () => {
    if (!subject) {
      setSubjectErrorMessage('Please enter subject!');
      return;
    } else if (!description) {
      setDescriptionErrorMessage('Please describe your issue!');
      return;
    } else {
      setSubjectErrorMessage('');
      setDescriptionErrorMessage('');
    }
    console.log(subject)
    console.log(description)

    const payload = {
      "name": userData.personalDetail.user_FName,
      "email": userData.user.user_EmailID,
      "subject": subject,
      "description": description
    }

    try {
      setIsLoading(true);
      const { data } = await postTicketInfo(payload);
      if (data.status === 'Success' && data.code === 200) {
        Alert.alert('Success', 'Your complain has been registered successfully! Our team will reach you for assistance.');
        setSubject('');
        setDescription('');
      } else {
        console.log(data);
        Alert.alert('Fail', 'Failed while raising complain, please try after sometime!')
      }
    } catch (err) {
      console.log('Error while raising complain')
      console.log(err)
      Alert.alert('Error', 'Error while raising complain!')
    } finally {
      setIsLoading(false);
    }
  }

  const navigateToTickets = () => {
    navigation.push('myTickets')
  }

  if (isLoading)
    return <Loading label={'Please wait, dont press back button.'} />
  return (
    <View style={styles.rootContainer}>
      <Text style={{ fontSize: 24, color: colors.primary500, textAlign: 'center' }}>Support</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>

        <Pressable onPress={navigateToTickets} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcon name='contact-support' size={20} color={colors.primary500} />
          <Text style={{ fontSize: 16, color: colors.primary500 }}>My Tickets</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 18 }}>
        <Text style={{ fontSize: 16, color: colors.primary500 }}>Name: {userData.personalDetail.user_FName} {userData.personalDetail.user_LName}</Text>
        <Text style={{ fontSize: 16, color: colors.primary500 }}>Email: {userData.user.user_EmailID}</Text>
        <Text style={{ fontSize: 16, color: colors.primary500 }}>Mobile: {userData.user.mobile_Number}</Text>
      </View>

      <View>
        <AnimatedInput
          value={subject}
          errorMessage={subjectErrorMessage}
          onChangeText={subjectChangeHandler}
          inputLabel={'Enter Subject'} />
        <AnimatedInput
          value={description}
          errorMessage={descriptionErrorMessage}
          onChangeText={descriptionChangeHandler}
          inputLabel={'Enter Description'}
          multiline />

        <View style={{ marginTop: 24 }}>

          <ButtonPrimary onPress={onSubmit} label='Submit' />
        </View>
      </View>
    </View>
  )
}

export default HelpSupport

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 8
    // justifyContent:'center',
    // alignItems:'center'
  }
})
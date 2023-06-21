import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'

const ShowPlans = () => {
    const route = useRoute()

  return (
    <View>
      <Text>{JSON.stringify(route.params)}</Text>
    </View>
  )
}

export default ShowPlans

const styles = StyleSheet.create({})
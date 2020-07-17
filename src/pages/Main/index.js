import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/AntDesign'

import { SafeAreaView, View, Text, Image, StyleSheet, StatusBar } from 'react-native';

import api from '~/services/api'

import logo from '~/assets/logo.png'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Main({ navigation }) {
  const [users, setUsers] = useState([])
  const id = navigation.getParam('user')

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: id,
        }
      })

      setUsers(response.data)
    }

    loadUsers();
  }, [id])

  async function handleLike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/likes`, null, {
      headers: { user: id }
    })

    setUsers(rest)
  }

  async function handleDislike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/dislikes`, null, {
      headers: { user: id }
    })

    setUsers(rest)
  }

  async function handleLogout() {
    try {
      await AsyncStorage.clear();

      navigation.navigate('Login')

    } catch (error) {
      console.tron.log(error)
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={handleLogout}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>

        <View style={styles.cardscontainer}>

          {users.length === 0
            ? <Text style={styles.empty}>Acabou :(</Text>
            : (users.map((user, index) => (
              <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                <Image style={styles.avatar} source={{ uri: user.avatar }} />
                <View style={styles.footer}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                </View>
              </View>
            )))}

        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button}>
            <Icon name="dislike1" size={40} color="#db5844" onPress={handleDislike} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Icon name="like1" size={40} color="#26e7ed" onPress={handleLike} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  logo: {
    marginTop: 40,
  },

  empty: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold'
  },

  cardscontainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 500,
  },

  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    margin: 30,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  avatar: {
    flex: 1,
    height: 300,
  },

  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },

  bio: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    lineHeight: 18
  },

  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },

  button: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    }
  }
})

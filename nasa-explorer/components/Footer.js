import React, { Component } from 'react';
import { View, Pressable, Text, StyleSheet, Linking } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default class Footer extends Component {
  render() {
    return (
      <View style={styles.container}>
        {/* Informações do usuário */}
        <View style={styles.userInfo}>
          <Text style={styles.name}>Marcus Paulo da Silva Francisco</Text>
          <Text style={styles.ra}>RA: 2040482522047</Text>
        </View>

        {/* Ícones */}
        <View style={styles.icons}>
          <Pressable onPress={() => Linking.openURL('https://www.youtube.com/@marcuss4266')}>
            <FontAwesome name="youtube-play" size={32} color="#FF0000" />
          </Pressable>

          <Pressable onPress={() => Linking.openURL('https://www.tiktok.com/@marcuss42_')}>
            <FontAwesome name="music" size={32} color="#000" />
          </Pressable>

          <Pressable>
            <FontAwesome name="user-circle-o" size={32} color="#555" />
          </Pressable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  ra: {
    fontSize: 12,
    color: '#555',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
});

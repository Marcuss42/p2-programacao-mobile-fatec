import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default class Foto extends Component {
  render() {
    const width = this.props.size ? (this.props.size * 100) / 12 + "%" : "100%";

    return (
      <View style={[styles.container, { width }]}>

        {this.props.url ? (
          <Image
            source={{ uri: this.props.url }}
            style={styles.img}
            resizeMode="contain"
          />
        ) : (
          <Text>Sem imagem disponível</Text>
        )}

        <Text style={styles.titulo}>
          {this.props.titulo || ""}
        </Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
    alignItems: "center"
  },
  img: {
    width: "100%",
    height: 120,   // <<< controla o TAMANHO VISUAL
  },
  titulo: {
    marginTop: 4,
    textAlign: "center",
    fontWeight: "bold"
  }
});
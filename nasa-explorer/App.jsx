import React, { Component } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  FlatList, 
  ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import nasaClient from './utils/nasaClient';
import Foto from './components/Foto';
import Footer from './components/Footer';

export default class App extends Component {
  state = {
    dailyPhoto: null,
    fotosSalvas: [],
    fotosAno: [],
    termoBusca: ''
  };

  anoAtual = new Date().getFullYear();
  limiteAnos = 4;
  anos = [];

  constructor(props) {
    super(props);

    for (let ano = this.anoAtual; ano >= this.anoAtual - this.limiteAnos; ano--) {
      this.anos.push(ano);
    }

    this.state = {
      dailyPhoto: null,
      fotosSalvas: [],
      fotosAno: [],
      termoBusca: ''
    };
  }

  componentDidMount() {
    this.carregarFotoDoDia();
    this.carregarFotosSalvas();
  }

  carregarFotoDoDia = async () => {
    const result = await nasaClient.get('/today-img');
    const foto = result.data;
    this.setState({ dailyPhoto: foto });
    await AsyncStorage.setItem(foto.date, JSON.stringify(foto));
    
  };

  carregarFotosSalvas = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const dados = await AsyncStorage.multiGet(keys);
    const fotos = dados.map(([k, v]) => JSON.parse(v));
    this.setState({ fotosSalvas: fotos });
  };

  buscarPorAno = async (ano) => {
    const { termoBusca } = this.state;

    const result = await nasaClient.get('/search', {
        params: { termo: termoBusca, ano }
      });
    this.setState({ fotosAno: result.data.slice(0, 10) });
  };

  render() {
    const { dailyPhoto, fotosSalvas, fotosAno, termoBusca } = this.state;
    const galeria = dailyPhoto
      ? [dailyPhoto, ...fotosSalvas.filter(f => f.date !== dailyPhoto.date)]
      : fotosSalvas;

    return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}
      >
        <Text style={styles.titulo}>NASA EXPLORER</Text>

        <View style={styles.box}>
          <Text style={styles.subtitulo}>1. Foto do Dia + Galeria</Text>

          <FlatList 
            scrollEnabled={false}
            data={galeria}
            keyExtractor={(item) => item.date}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => (
              <Foto 
                titulo={item.date}
                url={item.url}
                size={5} 
              />
            )}
          />
        </View>

        <View style={styles.box}>
          <Text style={styles.subtitulo}>2. Buscar Imagens</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite um termo..."
            value={termoBusca}
            onChangeText={(text) => this.setState({ termoBusca: text })}
          />

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 8 }}>
            {this.anos.map((ano, index) => (
              <Pressable
                key={ano}
                style={[
                  styles.botaoAno,
                  index === 0 ? styles.botaoAnoPrimeiro : styles.botaoAnoOutros
                ]}
                onPress={() => this.buscarPorAno(ano)}
              >
                <Text style={styles.buttonText}>{ano}</Text>
              </Pressable>
            ))}
          </View>

          <FlatList
            scrollEnabled={false}
            style={{ marginTop: 12 }}
            data={fotosAno}
            keyExtractor={(item, index) => `${item.titulo}-${index}`}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 8 }}
            renderItem={({ item }) => (
              <Foto
                titulo={item.titulo}
                url={item.link}
                size={5}
              />
            )}
          />

          <Footer />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: '#ffffffff'
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12
  },

  box: {
    width: '85%',
    borderWidth: 1,
    borderColor: '#ddddddff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8
  },

  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#aaaaaaff',
    padding: 10,
    borderRadius: 6
  },

  buttonText: {
    textAlign: 'center',
    color: '#ffffffff',
    fontWeight: 'bold'
  },

  botaoAno: {
    marginBottom: 8,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#0096F3',
    alignItems: 'center',
  },

  botaoAnoPrimeiro: {
    width: '100%',
  },

  botaoAnoOutros: {
    width: '48%',
  }
});

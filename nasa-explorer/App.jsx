import { 
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  ScrollView
} from 'react-native';

import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import nasaClient from './utils/nasaClient';
import Foto from './components/Foto';

export default function App() {

  const [dailyPhoto, setDailyPhoto] = useState(null);
  const [fotosSalvas, setFotosSalvas] = useState([]);
  const [fotosAno, setFotosAno] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');

  const anoAtual = new Date().getFullYear();
  const limiteAnos = 4;
  const anoMinimo = anoAtual - limiteAnos;
  const anos = [];

  for (let ano = anoAtual; ano >= anoMinimo; ano--) {
    anos.push(ano);
  }

  const inputBusca = useRef(null);

  const buscarPorAno = async (ano) => {
    if (!termoBusca) {
      alert("Digite um termo antes de buscar");
      return;
    }

    try {
      const result = await nasaClient.get('/search', {
        params: { termo: termoBusca, ano }
      });
      setFotosAno(result.data); 
    } catch (err) {
      console.log(err);
      alert("Erro ao buscar imagens");
    }
  };

  const carregarFotoDoDia = async () => {
    const result = await nasaClient.get('/today-img');
    const foto = result.data;

    setDailyPhoto(foto); 

    const chave = foto.date;
    await AsyncStorage.setItem(chave, JSON.stringify(foto));

  };

  const carregarFotosSalvas = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const apodKeys = keys;

    const dados = await AsyncStorage.multiGet(apodKeys);
    const fotos = dados.map(([k, v]) => JSON.parse(v));

    setFotosSalvas(fotos);
  };

  
  useEffect(() => {
    carregarFotoDoDia();
    carregarFotosSalvas();
  }, []);

  const galeria = dailyPhoto
    ? [dailyPhoto, ...fotosSalvas.filter(f => f.date !== dailyPhoto.date)]
    : fotosSalvas;
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}>

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
          ref={inputBusca}
          style={styles.input}
          placeholder="Digite um termo..."
          value={termoBusca}
          onChangeText={setTermoBusca}
        />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 8 }}>
          {anos.map((ano, index) => (
            <Pressable
              key={ano}
              style={[
                styles.botaoAno,
                index === 0 ? styles.botaoAnoPrimeiro : styles.botaoAnoOutros
              ]}
              onPress={() => buscarPorAno(ano)}
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
      </View>

    </ScrollView>
  );
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

  button: {
    marginTop: 10,
    backgroundColor: '#0096F3',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
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

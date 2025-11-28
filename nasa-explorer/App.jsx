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

  const inputBusca = useRef(null);

  const carregarFotoDoDia = async () => {
    const result = await nasaClient.get('/today-img');
    const foto = result.data;

    setDailyPhoto(foto);

    const chave = `apod-${foto.date}`;
    await AsyncStorage.setItem(chave, JSON.stringify(foto));

  };

  const carregarFotosSalvas = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const apodKeys = keys.filter(k => k.startsWith("apod-"));

    const dados = await AsyncStorage.multiGet(apodKeys);
    const fotos = dados.map(([k, v]) => JSON.parse(v));

    setFotosSalvas(fotos);
  };

  const buscar = () => {
    const termo = inputBusca.current?.value || "";
    console.log("Busca:", termo);
  };

  useEffect(() => {
    carregarFotoDoDia();
    carregarFotosSalvas();
  }, []);

  const galeria = [
      dailyPhoto,
      ...fotosSalvas.filter(f => f.date !== dailyPhoto.date)
    ]
  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>NASA EXPLORER</Text>

      <View style={styles.box}>
        <Text style={styles.subtitulo}>1. Foto do Dia + Galeria</Text>

        <FlatList 
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
        />

        <Pressable style={styles.button} onPress={buscar}>
          <Text style={styles.buttonText}>Buscar</Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
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
    borderRadius: 6
  },

  buttonText: {
    textAlign: 'center',
    color: '#ffffffff',
    fontWeight: 'bold'
  }
});

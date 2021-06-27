import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, Image } from 'react-native';
import { getMovies } from './src/apis/movieapi';
import { Rating } from './src/components/Rating';

const { width, height } = Dimensions.get('window');
const SIZE = width * 3 / 4;
const Loading = () => {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingtext}>Loading data...</Text>
    </View>
  )
}
export default function App() {

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const movies = await getMovies();
      setMovies(movies);
    };
    if (movies.length === 0) {
      fetchData(movies);
    }
  }, [movies]);

  if (movies.length === 0) {
    return <Loading />
  }
  return (
    <View style={styles.container}>
      <StatusBar translucent />
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={movies}
        horizontal
        keyExtractor={(item) => item.key}
        contentContainerStyle={{
          alignItems: 'center'
        }}
        renderItem={({ item }) => {
          return (
            <View style={{ width: SIZE }}>
              <View style={{
                marginHorizontal: 10,
                padding: 20,
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: 30,
              }}>
                <Image
                  source={{ uri: item.poster }}
                  style={styles.posterImage} />

                <Text style={{ fontSize: 24 }} numberOfLines={1}>
                  {item.title}
                </Text>

                <Rating rating={item.rating} />
                {/* <Genres genres={item.genres} /> */}
                <Text style={{ fontSize: 12 }} numberOfLines={3}>
                  {item.descriptioon}
                </Text>
              </View>
            </View>

          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingtext: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  posterImage: {
    width: '100%',
    height: height / 2,
    resizeMode: 'cover',
    margin: 0,
    marginBottom: 10,
    borderRadius: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center'
  }
});

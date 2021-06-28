import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, Image, Animated } from 'react-native';
import { getMovies } from './src/apis/movieapi';
import { Rating } from './src/components/Rating';

const { width, height } = Dimensions.get('window');
const SIZE = width * 3 / 4; //75%
const SPACE_ITEM_SIZE = (width - SIZE) / 2;
const EMPTY_ITEM_SIZE = (width - SIZE) / 2;

const Loading = () => {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingtext}>Loading data...</Text>
    </View>
  )
}
export default function App() {

  const [movies, setMovies] = useState([]);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      const movies = await getMovies();
      //[spacer, ...movies, sapcer]
      setMovies([{ key: 'left-spacer' }, ...movies, { key: 'right-spacer' }]);
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
      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        data={movies}
        horizontal
        keyExtractor={(item) => item.key}
        contentContainerStyle={{
          alignItems: 'center'
        }}
        snapToInterval={SIZE}
        snapToAlignment='start'
        decelerationRate={0}
        bounces={false}

        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {

          if (!item.poster) {
            return <View style={{
              width: SPACE_ITEM_SIZE,
            }} />
          }
          const inputRange = [
            (index - 2) * SIZE,
            (index - 1) * SIZE,
            (index) * SIZE,
          ];
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [0, -50, 0],
            extrapolate: 'clamp'
          })
          return (
            <View style={{ width: SIZE }}>
              <Animated.View style={{
                marginHorizontal: 10,
                padding: 20,
                alignItems: 'center',
                transform: [{ translateY }],
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
              </Animated.View>
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

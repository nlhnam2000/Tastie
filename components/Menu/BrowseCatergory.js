import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image} from 'react-native';
import colors from '../../colors/colors';
import {ShortcutImage} from '../../assets/dummy/ShortcutImage';
import {categoryData} from '../../assets/dummy/categoryData';

export const BrowseCategory = props => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={colors.red} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.flexRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            props.navigation.navigate('ResultContent', {
              categoryFilter: {
                type: categoryData[0].type,
                categoryID: categoryData[0].id,
              },
              title: categoryData[0].title,
            });
          }}>
          <Text style={{fontSize: 16, fontWeight: '500', alignSelf: 'flex-end'}}>
            {categoryData[0].title}
          </Text>
          <Image
            source={categoryData[0].image}
            style={{width: 70, height: 70, alignSelf: 'flex-start'}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            props.navigation.navigate('ResultContent', {
              categoryFilter: {
                type: categoryData[1].type,
                categoryID: categoryData[1].id,
              },
              title: categoryData[1].title,
            });
          }}>
          <Text style={{fontSize: 16, fontWeight: '500', alignSelf: 'flex-end'}}>
            {categoryData[1].title}
          </Text>
          <Image
            source={categoryData[1].image}
            style={{width: 70, height: 70, alignSelf: 'flex-start'}}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.flexRow}>
        {[2, 3, 4, 5].map((item, index) => (
          <View key={item}>
            <TouchableOpacity
              style={styles.button2}
              onPress={() => {
                props.navigation.navigate('ResultContent', {
                  categoryFilter: {
                    type: categoryData[item].type,
                    categoryID: categoryData[item].id,
                  },
                  title: categoryData[item].title,
                });
              }}>
              <Image source={categoryData[item].image} style={{width: 50, height: 50}} />
            </TouchableOpacity>
            <Text style={{fontSize: 15, fontWeight: '500', textAlign: 'center', marginTop: 5}}>
              {categoryData[item].title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'rgba(230,230,230, 0.3)',
    padding: 10,
    borderRadius: 20,
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
  },
  button2: {
    backgroundColor: 'rgba(230,230,230, 0.3)',
    padding: 10,
    borderRadius: 20,
  },
});

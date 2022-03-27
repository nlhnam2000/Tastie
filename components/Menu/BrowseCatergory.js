import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image} from 'react-native';
import colors from '../../colors/colors';
import {ShortcutImage} from '../../assets/dummy/ShortcutImage';

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
        <TouchableOpacity style={styles.button}>
          <Text style={{fontSize: 16, fontWeight: '500', alignSelf: 'flex-end'}}>
            {ShortcutImage[0].name}
          </Text>
          <Image
            source={{uri: ShortcutImage[0].image}}
            style={{width: 70, height: 70, alignSelf: 'flex-start'}}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={{fontSize: 16, fontWeight: '500', alignSelf: 'flex-end'}}>
            {ShortcutImage[1].name}
          </Text>
          <Image
            source={{uri: ShortcutImage[1].image}}
            style={{width: 70, height: 70, alignSelf: 'flex-start'}}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.flexRow}>
        {[2, 3, 4, 5].map((item, index) => (
          <View key={item}>
            <TouchableOpacity style={styles.button2}>
              <Image source={{uri: ShortcutImage[item].image}} style={{width: 50, height: 50}} />
            </TouchableOpacity>
            <Text style={{fontSize: 15, fontWeight: '500', textAlign: 'center', marginTop: 5}}>
              {ShortcutImage[item].name}
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

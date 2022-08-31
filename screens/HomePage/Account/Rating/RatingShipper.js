import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
// libraries
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

// assets
import colors from '../../../../colors/colors';
import {IP_ADDRESS, formatDate} from '../../../../global';

export const RatingShipper = props => {
  const [loading, setLoading] = useState(true);
  const [ratingTitle, setRatingTitle] = useState('Share your compliments');
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const {shipperName, order_id} = props.route.params;

  const SubmitRating = async () => {
    try {
      const res = await axios.post(`https://${IP_ADDRESS}/v1/api/tastie/order/add-shipper-review`, {
        order_id: order_id,
        create_at: formatDate(new Date()),
        content: comment,
        stars: selectedRating,
      });

      if (res.data.status) {
        props.navigation.navigate('RatingProvider');
      }
    } catch (error) {
      console.error('Cannot submit rating shipper', error);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    setComment(selectedTags.toString().split(',').join(', '));
  }, [selectedTags]);

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size={'large'} color={colors.red} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.heading}>Rate shipper</Text>
        <TouchableOpacity onPress={() => props.navigation.navigate('Home Page')}>
          <Feather name="x" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{marginVertical: 10, alignItems: 'center'}}>
        <Image
          source={require('../../../../assets/image/shipperMarker.png')}
          style={{width: 40, height: 40, borderRadius: 40, marginBottom: 10}}
        />
        <Text>{shipperName}</Text>
      </View>
      <View style={styles.flexRowCenter}>
        <TouchableOpacity
          onPress={() => {
            setSelectedRating(1);
            setRatingTitle('Too bad');
          }}
          style={{marginRight: 15}}>
          {selectedRating > 0 ? (
            <MaterialIcon name="star" size={40} color="#AB2E15" />
          ) : (
            <Feather name="star" size={30} color="black" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedRating(2);
            setRatingTitle('Bad');
          }}
          style={{marginRight: 15}}>
          {selectedRating > 1 ? (
            <MaterialIcon name="star" size={40} color="#AB2E15" />
          ) : (
            <Feather name="star" size={30} color="black" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedRating(3);
            setRatingTitle('Neutral');
          }}
          style={{marginRight: 15}}>
          {selectedRating > 2 ? (
            <MaterialIcon name="star" size={40} color="#AB2E15" />
          ) : (
            <Feather name="star" size={30} color="black" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedRating(4);
            setRatingTitle('Delicious');
          }}
          style={{marginRight: 15}}>
          {selectedRating > 3 ? (
            <MaterialIcon name="star" size={40} color="#AB2E15" />
          ) : (
            <Feather name="star" size={30} color="black" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedRating(5);
            setRatingTitle('Perfect');
          }}
          style={{marginRight: 15}}>
          {selectedRating > 4 ? (
            <MaterialIcon name="star" size={40} color="#AB2E15" />
          ) : (
            <Feather name="star" size={30} color="black" />
          )}
        </TouchableOpacity>
      </View>
      <Text style={{textAlign: 'center'}}>{ratingTitle}</Text>
      <View
        style={[
          styles.flexRowCenter,
          {width: '100%', flexBasis: '20%', flexWrap: 'wrap', marginTop: 10, marginBottom: 0},
        ]}>
        {[
          'Friendly!',
          'Careful package handling',
          'Proper uniform',
          'Fast delivery',
          'Supportive',
        ].map((item, index) => (
          <TouchableOpacity
            onPress={() => {
              if (selectedTags.includes(item)) {
                let copy = [...selectedTags];
                copy.splice(copy.indexOf(item), 1); // remove item
                setSelectedTags(copy);
              } else {
                setSelectedTags(prev => [...prev, item]);
              }
            }}
            key={index}
            style={{
              padding: 10,
              backgroundColor: 'rgba(230,230,230,0.7)',
              marginRight: index === 4 ? 0 : 10,
              marginBottom: 10,
            }}>
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{width: '100%', paddingHorizontal: 20, position: 'relative'}}>
        <TextInput
          numberOfLines={10}
          multiline={true}
          style={{
            width: '100%',
            padding: 15,
            borderWidth: 1,
            borderColor: '#c4c4c4',
            height: 250,
          }}
          placeholder="Share review about taste, package or each item"
          placeholderTextColor={'#c4c4c4'}
          onChangeText={text => setComment(text)}
          value={comment}
        />
        <Text style={{color: 'gray', position: 'absolute', right: 30, bottom: 10}}>
          {comment.length}/150
        </Text>
      </View>
      <View style={styles.flexRowCenter}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('RatingProvider', {order_id: order_id})}
          style={{paddingVertical: 10, width: '50%', backgroundColor: 'black'}}>
          <Text style={{textAlign: 'center', fontSize: 18, fontWeight: '600', color: 'white'}}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerWrapper: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
  },
  flexRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  flexRow: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
});

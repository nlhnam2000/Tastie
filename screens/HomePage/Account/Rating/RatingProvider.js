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

// assets
import colors from '../../../../colors/colors';
import {IP_ADDRESS, formatDate} from '../../../../global';

// libraries
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

export const RatingProvider = props => {
  const [loading, setLoading] = useState(true);
  const [ratingTitle, setRatingTitle] = useState('Share your compliments');
  const [selectedAnonymous, setSelectedAnonymous] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const {order_id} = props.route.params;

  const SubmitRating = async () => {
    try {
      const res = await axios.post(`https://${IP_ADDRESS}/v1/api/tastie/order/add-order-review`, {
        order_id: order_id,
        create_at: formatDate(new Date()),
        content: comment,
        image: null,
        stars: selectedRating,
      });

      if (res.data.status) {
        props.navigation.navigate('Home Page');
      }
    } catch (error) {
      console.error('Cannot submit review provider', error);
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
        <Text style={styles.heading}>Rate shop </Text>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Feather name="x" size={20} color="black" />
        </TouchableOpacity>
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
      <View style={[styles.flexRowCenter, {width: '100%'}]}>
        {['Yummy!', 'Good packaging', 'Filling', 'Affordable'].map((item, index) => (
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
              backgroundColor: selectedTags.includes(item) ? 'black' : 'rgba(230,230,230,0.7)',
              marginRight: index === 3 ? 0 : 10,
            }}>
            <Text style={{color: selectedTags.includes(item) ? 'white' : 'black'}}>{item}</Text>
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
        <TouchableOpacity
          style={{
            alignItems: 'center',
            padding: 10,
            borderWidth: 1,
            borderColor: '#AB2E15',
            position: 'absolute',
            bottom: 10,
            left: 30,
            borderStyle: 'dashed',
          }}>
          <Feather name="camera" size={20} color={'#AB2E15'} />
          <Text style={{color: '#AB2E15', marginTop: 10}}>Add photo</Text>
        </TouchableOpacity>
        <Text style={{color: 'gray', position: 'absolute', right: 30, bottom: 10}}>
          {comment.length}/150
        </Text>
      </View>
      <View style={styles.flexRow}>
        <TouchableOpacity
          onPress={() => setSelectedAnonymous(!selectedAnonymous)}
          style={{
            width: 25,
            height: 25,
            borderRadius: 40,
            borderWidth: 1,
            borderColor: colors.secondary,
            marginRight: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}>
          <View
            style={{
              padding: 9,
              backgroundColor: selectedAnonymous ? 'black' : 'white',
              borderRadius: 40,
            }}></View>
        </TouchableOpacity>
        <Text>Make my rating anonymous</Text>
      </View>
      <View style={styles.flexRowCenter}>
        <TouchableOpacity
          onPress={() => SubmitRating()}
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

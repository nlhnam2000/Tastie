import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';

// libaries
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import {IP_ADDRESS} from '../../../../global';
import moment from 'moment';

// project imports
import {Header} from '../../../../components/Layout/Header/Header';
import {Rating} from '../../../../components/Rating/Rating';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {DisplayAlertMessage} from '../../../../store/action/auth';
import {ActionAlertDialog} from '../../../../components/Error/AlertDialog';
import {ActivityIndicator} from 'react-native-paper';
import colors from '../../../../colors/colors';

const {width, height} = Dimensions.get('window');

const RatingSummary = props => {
  return (
    <View style={{alignItems: 'center', width: '40%'}}>
      <Text style={{fontSize: 19, fontWeight: 'bold', marginBottom: 5}}>
        {props.star.toFixed(1)}
      </Text>
      <Rating rating={Math.floor(props.star)} />
      <Text style={{fontSize: 18, fontWeight: '500', color: 'gray', marginTop: 10}}>
        {props.total} reviews
      </Text>
    </View>
  );
};

const RatingChart = props => {
  return (
    <View style={{maxWidth: '70%', alignItems: 'center', borderLeftWidth: 1}}>
      {[5, 4, 3, 2, 1].map((item, index) => (
        <View key={index} style={[styles.flexRow, {marginTop: 2}]}>
          <Text>{item}</Text>
          <View
            style={{
              width: '70%',
              height: 7,
              borderRadius: 10,
              backgroundColor: '#c4c4c4',
              marginLeft: 15,
            }}></View>
        </View>
      ))}
    </View>
  );
};

const CustomerReview = props => {
  return (
    <View style={{width: '100%', marginBottom: 10}}>
      <View style={[styles.flexRow, {marginBottom: 10}]}>
        {props.avatar ? (
          <Image source={{uri: props.avatar}} style={{width: 40, height: 40}} />
        ) : (
          <View
            style={{
              backgroundColor: 'black',
              borderRadius: 50,
              marginRight: 10,
              width: 30,
              height: 30,
              justifyContent: 'center',
            }}>
            <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
              {props.name.charAt(0)}
            </Text>
          </View>
        )}
        <Text style={{fontWeight: '600'}}>{props.name}</Text>
      </View>
      <View style={styles.flexRow}>
        <Rating rating={props.star} />
        <Text style={{fontWeight: '600', color: 'gray', marginLeft: 5}}>•</Text>
        <Text style={{fontWeight: '600', color: 'gray', marginLeft: 5}}>{props.date}</Text>
      </View>
      <Text style={{marginTop: 10}}>{props.content}</Text>
    </View>
  );
};

export const Review = props => {
  const [loading, setLoading] = useState(true);
  const {provider_id} = props.route.params;
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);
  const [reviews, setReviews] = useState([]);
  const [detailReview, setDetailReview] = useState({
    averageRating: 0.0,
    numberOfRating: 0,
  });

  useEffect(() => {
    const LoadReviews = async provider_id => {
      try {
        const res = await axios.get(
          `http://${IP_ADDRESS}:3007/v1/api/tastie/store/customer_review/${provider_id}`,
        );

        if (res.data.status) {
          setReviews(res.data.response);
        }
      } catch (error) {
        dispatch(DisplayAlertMessage('Cannot get reviews'));
        console.error('Cannot get review', error);
      } finally {
        setLoading(false);
      }
    };

    LoadReviews(provider_id);
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      let sum_rating = 0.0;
      reviews.forEach(r => {
        sum_rating += r.stars;
      });

      setDetailReview(prev => ({
        ...prev,
        averageRating: sum_rating / reviews.length,
        numberOfRating: reviews.length,
      }));
    }
  }, [reviews]);

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size={'large'} color={colors.boldred} />
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <Header title="Rating and Reviews" goBack {...props} />
      <ScrollView style={styles.contentWrapper}>
        <View style={styles.flexRowBetween}>
          <RatingSummary star={detailReview.averageRating} total={detailReview.numberOfRating} />
          <RatingChart />
        </View>
        <View style={styles.reviewWrapper}>
          {reviews.map((review, index) => (
            <CustomerReview
              key={index}
              name={review.customer_info.username}
              star={5}
              date={moment(review.create_at).startOf('hour').fromNow()}
              content={review.content}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  contentWrapper: {
    paddingHorizontal: 10,
    width: '100%',
  },
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewWrapper: {
    marginTop: 30,
  },
});

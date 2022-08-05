import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../colors/colors';

export const OrderProgressBar = props => {
  return (
    <View style={styles.progress}>
      <View style={{alignItems: 'center', position: 'relative'}}>
        <View
          style={{
            padding: 7,
            backgroundColor: props.submittedStatus ? colors.boldred : 'rgba(200,200,200,1.0)',
            borderRadius: 20,
            position: 'absolute',
            left: '2%',
          }}>
          <Feather name={props.submittedStatus ? 'check' : 'loader'} size={10} color="white" />
        </View>
        <View
          style={{
            padding: 7,
            backgroundColor: props.assignedStatus ? colors.boldred : 'rgba(200,200,200,1.0)',
            borderRadius: 20,
            position: 'absolute',
            left: '23%',
          }}>
          <Feather name={props.assignedStatus ? 'check' : 'loader'} size={10} color="white" />
        </View>
        <View
          style={{
            padding: 7,
            backgroundColor: props.confirmedStatus ? colors.boldred : 'rgba(200,200,200,1.0)',
            borderRadius: 20,
            position: 'absolute',
            left: '45%',
          }}>
          <Feather name={props.confirmedStatus ? 'check' : 'loader'} size={10} color="white" />
        </View>
        <View
          style={{
            padding: 7,
            backgroundColor: props.pickedStatus ? colors.boldred : 'rgba(200,200,200,1.0)',
            borderRadius: 20,
            position: 'absolute',
            left: '68%',
          }}>
          <Feather name={props.pickedStatus ? 'check' : 'loader'} size={10} color="white" />
        </View>
        <View
          style={{
            padding: 7,
            backgroundColor: props.completedStatus ? colors.boldred : 'rgba(200,200,200,1.0)',
            borderRadius: 40,
            position: 'absolute',
            left: '90%',
          }}>
          <Feather name={props.completedStatus ? 'check' : 'loader'} size={10} color="white" />
        </View>
        {/* Line Progress */}
        <View
          style={{
            width: '18%',
            padding: 2,
            position: 'absolute',
            top: 10,
            left: '8%',
            backgroundColor: props.submittedStatus ? colors.boldred : 'rgba(200,200,200,1.0)',
            zIndex: -10,
          }}></View>
        <View
          style={{
            width: '18%',
            padding: 2,
            position: 'absolute',
            top: 10,
            left: '28%',
            backgroundColor: props.assignedStatus ? colors.boldred : 'rgba(200,200,200,1.0)',
            zIndex: -10,
          }}></View>
        <View
          style={{
            width: '18%',
            padding: 2,
            position: 'absolute',
            top: 10,
            left: '51%',
            backgroundColor: props.confirmedStatus ? colors.boldred : 'rgba(200,200,200,1.0)',
            zIndex: -10,
          }}></View>
        <View
          style={{
            width: '18%',
            padding: 2,
            position: 'absolute',
            top: 10,
            left: '73%',
            backgroundColor: props.pickedStatus ? colors.boldred : 'rgba(200,200,200,1.0)',
            zIndex: -10,
          }}></View>
        {/* Text Progress */}
        <Text style={{fontSize: 12, fontWeight: '400', position: 'absolute', top: 35, left: -2}}>
          Submitted
        </Text>
        <Text style={{fontSize: 12, fontWeight: '400', position: 'absolute', top: 35, left: '20%'}}>
          Assigned
        </Text>
        <Text style={{fontSize: 12, fontWeight: '400', position: 'absolute', top: 35, left: '41%'}}>
          Confirmed
        </Text>
        <Text style={{fontSize: 12, fontWeight: '400', position: 'absolute', top: 35, left: '67%'}}>
          Picked
        </Text>
        <Text style={{fontSize: 12, fontWeight: '400', position: 'absolute', top: 35, left: '84%'}}>
          Completed
        </Text>
      </View>
    </View>
  );
};

export const OrderProgressBarPickup = ({status}) => {
  return (
    <View style={styles.progress}>
      <View style={{alignItems: 'center', position: 'relative'}}>
        <View
          style={{
            padding: 7,
            backgroundColor: status >= 1 ? colors.boldred : 'rgba(200,200,200,1.0)',
            borderRadius: 20,
            position: 'absolute',
            left: '5%',
          }}>
          <Feather name={status >= 1 ? 'check' : 'loader'} size={10} color="white" />
        </View>

        <View
          style={{
            padding: 7,
            backgroundColor: status >= 2 ? colors.boldred : 'rgba(200,200,200,1.0)',
            borderRadius: 20,
            position: 'absolute',
            left: '47%',
          }}>
          <Feather name={status >= 2 ? 'check' : 'loader'} size={10} color="white" />
        </View>

        <View
          style={{
            padding: 7,
            backgroundColor: status === 3 ? colors.boldred : 'rgba(200,200,200,1.0)',
            borderRadius: 40,
            position: 'absolute',
            left: '87%',
          }}>
          <Feather name={status === 3 ? 'check' : 'loader'} size={10} color="white" />
        </View>
        {/* Line Progress */}
        <View
          style={{
            width: '39%',
            padding: 2,
            position: 'absolute',
            top: 10,
            left: '8%',
            backgroundColor: status >= 1 ? colors.boldred : 'rgba(200,200,200,1.0)',
            zIndex: -10,
          }}></View>

        <View
          style={{
            width: '40%',
            padding: 2,
            position: 'absolute',
            top: 10,
            left: '51%',
            backgroundColor: status >= 2 ? colors.boldred : 'rgba(200,200,200,1.0)',
            zIndex: -10,
          }}></View>
        {/* <View
          style={{
            width: '20%',
            padding: 2,
            position: 'absolute',
            top: 10,
            left: '73%',
            backgroundColor: status === 3 ? colors.boldred : 'rgba(200,200,200,1.0)',
            zIndex: -10,
          }}></View> */}
        {/* Text Progress */}
        <Text style={{fontSize: 12, fontWeight: '400', position: 'absolute', top: 35, left: '2%'}}>
          Submitted
        </Text>

        <Text style={{fontSize: 12, fontWeight: '400', position: 'absolute', top: 35, left: '42%'}}>
          Confirmed
        </Text>

        <Text style={{fontSize: 12, fontWeight: '400', position: 'absolute', top: 35, left: '82%'}}>
          Completed
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progress: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 20,
    height: '10%',
  },
});

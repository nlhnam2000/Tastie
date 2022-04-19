import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export const OrderProgressBar = props => {
  return (
    <View style={styles.progress}>
      <View style={{alignItems: 'center', position: 'relative'}}>
        <View
          style={{
            padding: 10,
            backgroundColor: props.submittedStatus ? '#55A316' : 'rgba(200,200,200,1.0)',
            borderRadius: 40,
            position: 'absolute',
            left: '2%',
          }}>
          <Feather name={props.submittedStatus ? 'check' : 'loader'} size={10} color="white" />
        </View>
        <View
          style={{
            padding: 10,
            backgroundColor: props.assignedStatus ? '#55A316' : 'rgba(200,200,200,1.0)',
            borderRadius: 40,
            position: 'absolute',
            left: '23%',
          }}>
          <Feather name={props.assignedStatus ? 'check' : 'loader'} size={10} color="white" />
        </View>
        <View
          style={{
            padding: 10,
            backgroundColor: props.confirmedStatus ? '#55A316' : 'rgba(200,200,200,1.0)',
            borderRadius: 40,
            position: 'absolute',
            left: '45%',
          }}>
          <Feather name={props.confirmedStatus ? 'check' : 'loader'} size={10} color="white" />
        </View>
        <View
          style={{
            padding: 10,
            backgroundColor: props.pickedStatus ? '#55A316' : 'rgba(200,200,200,1.0)',
            borderRadius: 40,
            position: 'absolute',
            left: '68%',
          }}>
          <Feather name={props.pickedStatus ? 'check' : 'loader'} size={10} color="white" />
        </View>
        <View
          style={{
            padding: 10,
            backgroundColor: props.completedStatus ? '#55A316' : 'rgba(200,200,200,1.0)',
            borderRadius: 40,
            position: 'absolute',
            left: '90%',
          }}>
          <Feather name={props.completedStatus ? 'check' : 'loader'} size={10} color="white" />
        </View>
        <View
          style={{
            width: '18%',
            padding: 2,
            position: 'absolute',
            top: 13,
            left: '8%',
            backgroundColor: props.submittedStatus ? '#55A316' : 'rgba(200,200,200,1.0)',
            zIndex: -10,
          }}></View>
        <View
          style={{
            width: '18%',
            padding: 2,
            position: 'absolute',
            top: 13,
            left: '28%',
            backgroundColor: props.assignedStatus ? '#55A316' : 'rgba(200,200,200,1.0)',
            zIndex: -10,
          }}></View>
        <View
          style={{
            width: '18%',
            padding: 2,
            position: 'absolute',
            top: 13,
            left: '51%',
            backgroundColor: props.confirmedStatus ? '#55A316' : 'rgba(200,200,200,1.0)',
            zIndex: -10,
          }}></View>
        <View
          style={{
            width: '18%',
            padding: 2,
            position: 'absolute',
            top: 13,
            left: '75%',
            backgroundColor: props.pickedStatus ? '#55A316' : 'rgba(200,200,200,1.0)',
            zIndex: -10,
          }}></View>

        <Text style={{fontSize: 12, fontWeight: '400', position: 'absolute', top: 40, left: -2}}>
          Submitted
        </Text>
        <Text style={{fontSize: 12, fontWeight: '400', position: 'absolute', top: 40, left: '20%'}}>
          Assigned
        </Text>
        <Text style={{fontSize: 12, fontWeight: '400', position: 'absolute', top: 40, left: '41%'}}>
          Confirmed
        </Text>
        <Text style={{fontSize: 12, fontWeight: '400', position: 'absolute', top: 40, left: '67%'}}>
          Picked
        </Text>
        <Text style={{fontSize: 12, fontWeight: '400', position: 'absolute', top: 40, left: '84%'}}>
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

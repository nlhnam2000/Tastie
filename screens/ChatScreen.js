import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
  Dimensions,
} from 'react-native';

// libraries
import Feather from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';

const {width, height} = Dimensions.get('window');

export const ChatScreen = props => {
  const state = useSelector(state => state.UserReducer);
  const [messages, setMessages] = useState([
    /*
        {
            sender: 'customer' | 'shipper'
            message: ''
        }
    */
    // {
    //   sender: 'shipper',
    //   message: 'asdihfaisdufh',
    // },
    // {
    //   sender: 'customer',
    //   message: 'qwerqwer qwer qwer',
    // },
    // {
    //   sender: 'customer',
    //   message: 'qwerqwer qwer qwer qwef ',
    // },
    // {
    //   sender: 'shipper',
    //   message: 'asdqwd ',
    // },
    // {
    //   sender: 'customer',
    //   message: 'asdqwef',
    // },
    // {
    //   sender: 'shipper',
    //   message: 'asdihfaisdufh',
    // },
    // {
    //   sender: 'shipper',
    //   message: 'asdihfaisdufh',
    // },
  ]);
  const [message, setMessage] = useState('');
  const {order_code} = props.route.params;
  const scrollRef = useRef();
  const inputRef = useRef();

  const sendMessage = text => {
    if (text !== '') {
      setMessages(prev => [...prev, text]);
      setMessage('');
      scrollRef.current?.scrollToEnd();
    }
  };

  useEffect(() => {
    state.socket.emit('join-room', order_code);
    state.socket.on('receive-shipper-inbox', message => {
      setMessages(prev => [...prev, {sender: 'shipper', message: message}]);
      console.log('Received: ', message);
    });
    inputRef.current.focus();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity style={styles.backButton} onPress={() => props.navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView
        ref={scrollRef}
        onLayout={event => {
          scrollRef.current.scrollToEnd();
        }}
        contentContainerStyle={{
          justifyContent: 'center',
          paddingHorizontal: 15,
        }}
        style={{
          width: '100%',
        }}>
        <View style={{width: '100%'}}>
          {messages.map((obj, index) => (
            <View
              key={index}
              style={{
                minWidth: '30%',
                maxWidth: '90%',
                paddingEnd: obj.sender === 'shipper' ? 20 : 10,
                paddingStart: obj.sender === 'shipper' ? 10 : 20,
                paddingVertical: 5,
                backgroundColor: obj.sender === 'shipper' ? 'green' : 'blue',
                borderRadius: 12,
                marginBottom: 10,
                alignSelf: obj.sender === 'shipper' ? 'flex-start' : 'flex-end',
              }}>
              <Text
                style={{
                  marginVertical: 10,
                  // textAlign: obj.sender === 'shipper' ? 'left' : 'right',
                  color: 'white',
                  fontWeight: '500',
                  // width: '100%',
                }}>
                {obj.message}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.sendMessageWrapper}>
        <TextInput
          placeholder="Enter your message"
          placeholderTextColor={'gray'}
          onChangeText={text => setMessage(text)}
          //value={message}
          style={styles.inputMessage}
        />
        <Button
          title="Send"
          onPress={() => {
            if (message !== '') {
              setMessages(prev => [...prev, {sender: 'customer', message: message}]);
              state.socket.emit('customer-inbox', message, order_code);
              setMessage('');
              setTimeout(() => {
                scrollRef.current.scrollToEnd();
                inputRef.current.clear();
              }, 100);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  headerWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {},
  sendMessageWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputMessage: {
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

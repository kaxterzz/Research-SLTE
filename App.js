import React, { Component } from "react";
import {Router, Scene} from 'react-native-router-flux';
import Main from './components/Main';
import Authentication from './components/Auth/Authentication';
import NetInfo from "@react-native-community/netinfo";
import { Toast, View, Root } from 'native-base';
import {ActivityIndicator} from 'react-native';
import io from 'socket.io-client'
import SocketContext from './Context/SocketContext'
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from 'react-native-push-notification'

const socket = io("http://139.59.37.180:3773",{transports: ['websocket']});

    if (!window.location) {
      // App is running in simulator
      window.navigator.userAgent = 'ReactNative';
    }

class App extends Component{
  constructor() {
    super();
    this._getAuthToken = this._getAuthToken.bind(this);
    this.state = { hasToken: false, isLoaded: false };
  }

  
  componentDidMount() {
    this._getAuthToken();
    this._showJoinedUsersNotf = this._showJoinedUsersNotf.bind(this);
    this._showLeftUsersNotf = this._showLeftUsersNotf.bind(this);
    this._showNewMsgNotf = this._showNewMsgNotf.bind(this);
    socket.on('add user', this._showJoinedUsersNotf);
    socket.on('user left', this._showLeftUsersNotf);
    socket.on('new message', this._showNewMsgNotf);
  }

  renderError() {
    const unsubscribe = NetInfo.addEventListener(state => {
      if(!state.isConnected){
        return (
          Toast.show({
            text: 'Hey Buddy, You need Internet !',
            buttonText: 'Okay',
            type: 'warning',
            position: 'bottom'
          })
        );
      }
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    }); 
  }

  render() {
    console.disableYellowBox = true;
      return (
        <SocketContext.Provider value={socket}>
          <Root>
            <View>
              {this.renderError()}
            </View>
            <Router>
              <Scene key='root'>
                <Scene
                  component={Authentication}
                  hideNavBar={true}
                  initial={!this.state.hasToken}
                  key='Authentication'
                  title='Authentication'
                />
                <Scene
                  component={Main}
                  hideNavBar={true}
                  initial={this.state.hasToken}
                  key='Main'
                  title='Home Page'
                />
              </Scene>
            </Router>
          </Root>
        </SocketContext.Provider>
        )
    
  }

  _showJoinedUsersNotf(joined_users) {
    PushNotification.localNotification({
      /* iOS and Android properties */
      title: "Someone joined", // (optional)
      message: joined_users.msg, 
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    });
  }

  _showLeftUsersNotf(left_users) {
    console.log(left_users);
    PushNotification.localNotification({
      /* iOS and Android properties */
      title: "Someone left", // (optional)
      message: left_users.msg, 
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: '11', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    });
  }

  _showNewMsgNotf(messages) {
    PushNotification.localNotification({
      /* iOS and Android properties */
      title: "Got a new text", // (optional)
      message: messages.username + " sent a new text", // (required)
      bigText: messages.text,
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: messages._id, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    });
  }

  _getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      console.log('in getAuuuuuuuuuuth');
      
      console.log(token);
      
      if(token !== null) {
        console.log('in getAuthToken');
        console.log(token);
        
        this.setState(prevState => ({
          hasToken: token, 
          isLoaded: true
        }))
      }
    } catch(e) {
      console.log(e);
      
    }
  }
}

export default App;

import React, { Component } from 'react';
import { Container, Icon, Text, Button, Content, H1, View } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { StyleSheet, Alert } from 'react-native';
import { authorize } from 'react-native-app-auth';
import AsyncStorage from '@react-native-community/async-storage';

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: "AdventPro_Regular",
    fontSize: 18,
    textAlign: "center",
  },
  headerSyle: {
    fontFamily: "AdventPro_Regular",
    textAlign: "center",
  }
});

class Authentication extends Component {
  constructor(props) {
    super(props);
    this._storeAuthToken = this._storeAuthToken.bind(this);
    this._getUserData = this._getUserData.bind(this);
    this._saveItem = this._saveItem.bind(this);
    this.loginGoogle = this.loginGoogle.bind(this);
    this.state = {
      token: ''
    };
  }

  loginFb() {
    Actions.Main();
  }



  render() {
    return (
      <Container style={styles.textStyle}>
        <View>
          <H1 style={styles.headerSyle}>Sign Language Translation Engine</H1>
        </View>
        <Content
          contentContainerStyle={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >

          <Text style={styles.textStyle}>SignIn to continue</Text>
          <Button iconLeft full danger onPress={this.loginGoogle}>
            <Icon name='logo-google' />
            <Text style={styles.textStyle}>Google</Text>
          </Button>
          <Button iconLeft full info onPress={this.loginFb}>
            <Icon name='logo-facebook' />
            <Text style={styles.textStyle}>Facebook</Text>
          </Button>
        </Content>
      </Container>
    );
  }




  async loginGoogle() {
    // base config
    const config = {
      issuer: 'https://accounts.google.com',
      clientId: '866289819510-vkqfmj7hprragrv8m8jhibr8evjmot2u.apps.googleusercontent.com',
      redirectUrl: 'com.testchat.app:/oauth2callback',
      scopes: [
        'openid',
        'email',
        'profile'
      ],
    };

    // use the client to make the auth request and receive the authState
    try {
      const result = await authorize(config);
      if (result.idToken) {
        this._storeAuthToken(result.idToken)
        this._getUserData(result.idToken)
      } else {
        Alert.alert('Login Failed!', 'Try again..')
      }

      // result includes accessToken, accessTokenExpirationDate and refreshToken
    } catch (error) {
      console.log(error);
    }
  }

  _getUserData(token) {
    return fetch('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + token)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.iat != "") {
          this._saveItem('name', responseJson.given_name)
          console.log(responseJson.given_name);

          Actions.Main();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _storeAuthToken(data) {
    this._saveItem('token', data.token)
  }

  _saveItem = async (item, selectedValue) => {
    try {
      await AsyncStorage.setItem(item, selectedValue);
      console.log('in _saveItem');
      console.log(item, selectedValue);

    } catch (e) {
      console.error('AsyncStorage error: ' + e);
    }
  }

}

export default Authentication;

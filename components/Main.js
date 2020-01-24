import React, { Component } from 'react';
import { Container, Header, Tab, Tabs, TabHeading, Icon, Text, Right, Title, Button, Body, Toast  } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Chat from './Chat';
import Users from './Users';
import SocketContext from '../Context/SocketContext'
import AsyncStorage from '@react-native-community/async-storage';

class Main extends Component {
  constructor(props) {
    super(props);
    this._logOut = this._logOut.bind(this);
    this.state = {
      text: ''
    };
  }
  
  render() {
    return (
        <Container>
        <Header hasTabs>
          <Body>
            <Title>SLTE</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='search' />
            </Button>
            <Button transparent onPress={this._logOut}>
              <Icon name='power' />
            </Button>
          </Right>
          </Header>
          <Tabs>
              <Tab heading={ <TabHeading><Icon name="md-chatbubbles" /><Text>Chat</Text></TabHeading>}>
                <SocketContext.Consumer>
                  {socket => <Chat socket={socket} /> }
                </SocketContext.Consumer>
              </Tab>
              <Tab heading={ <TabHeading><Icon name="ios-contacts" /><Text>Users</Text></TabHeading>}>
                <SocketContext.Consumer>
                  {socket => <Users socket={socket} /> }
                </SocketContext.Consumer>
              </Tab>
          </Tabs>

      </Container>
    );
  }

  _logOut = async () => {
    try {
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('name')
      Actions.Authentication();
    } catch(e) {
      console.log(e);
      
    }
  }
}


export default Main;

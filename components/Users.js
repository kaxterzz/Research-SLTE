import React, { Component } from 'react';
import { Container , Text, ListItem, Left} from 'native-base';
import { StyleSheet,FlatList } from 'react-native';

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: "AdventPro_Regular",
    fontSize: 18,
    textAlign: "center",
  },
  rowBack:{
    backgroundColor:'blue',
    color:'white'
  }
});

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
        total_online: 0,
        online_users:[],
    };
  }

  componentDidMount() {
    this._storeOnlineUsers = this._storeOnlineUsers.bind(this);
    this._removeLeftUsers = this._removeLeftUsers.bind(this);
    this.props.socket.on('online users', this._storeOnlineUsers);
    this.props.socket.on('user left', this._removeLeftUsers);
  }


  render() {
    return (
      <Container>
      <Text style={styles.textStyle}>Total Online : {this.state.total_online}</Text>
      <FlatList
      rightOpenValue={-75}
      data={this.state.online_users}
      keyExtractor={(item, index) => String(index)}
      renderItem={({ item, index }) => {
        return (
          <ListItem>
            <Left>
              <Text
                  style={{
                      color: item.colorName,
                      fontFamily: "AdventPro_Regular",
                      fontSize: 20
                  }}
              >
                {item.username}
              </Text>
            </Left>
          </ListItem>
        );
      }}
    />
  </Container>
    );
  }

  _storeOnlineUsers(online_users) {
      this.setState(prevState => ({
        total_online: online_users.numUsers,
        online_users: [...prevState.online_users, online_users]
      }))
  }

  _removeLeftUsers(left_user) {
    this.setState(prevState => ({ total_online: left_user.numUsers, online_users: prevState.online_users.filter(online_users => online_users.username !== left_user.username) }));
  }

}

export default Users;

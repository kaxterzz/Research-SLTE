import React from 'react'
import ImagePicker from 'react-native-image-picker';
import { GiftedChat, Composer, Send } from 'react-native-gifted-chat'
import { View, Button, Icon } from 'native-base'
import { Image } from 'react-native'

const options = {
    title: 'Pick an image',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};


class Chat extends React.Component {
    state = {
        messages: []
    }


    componentDidMount() {
        this._showNewMsg = this._showNewMsg.bind(this);
        this.openCamera = this.openCamera.bind(this);
        this.openGallery = this.openGallery.bind(this);
        this.props.socket.on('new message', this._showNewMsg);
    }

    onSend(messages = []) {
        messages[0].sent = true
        messages[0].received = true
        this.props.socket.emit('new message', messages[0].text);
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    renderComposer = props => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Composer {...props} />
                <Button iconLeft transparent onPress={this.openCamera}>
                    <Icon name='camera' />
                </Button>
                <Button iconLeft transparent onPress={this.openGallery} style={{ paddingRight: 15 }}>
                    <Icon name='image' />
                </Button>
                <Send {...props}>
                    <Icon name='send' style={{ fontSize: 25, paddingBottom: 8 }} />
                </Send>
            </View>
        );
    }


    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                scrollToBottom={true}
                renderUsernameOnMessage={true}
                renderComposer={this.renderComposer}
                user={{
                    _id: 1,
                    name: 'You'
                }}
            />
        )
    }

    openCamera() {
        // Launch Camera:
        ImagePicker.launchCamera(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {;
                const message = {};
                message._id = 2;
                message.createdAt = Date.now();
                message.user = {
                    _id: 1,
                    name: 'You'
                };
                message.image = response.uri;

                this.setState(prevState => ({
                    messages: GiftedChat.append(prevState.messages, message),
                }))
            }
        });
    }

    openGallery() {
        // Open Image Library:
        ImagePicker.launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const message = {};
                message._id = 2;
                message.createdAt = Date.now();
                message.user = {
                    _id: 1,
                    name: 'You'
                };
                message.image = response.uri;

                this.setState(prevState => ({
                    messages: GiftedChat.append(prevState.messages, message),
                }))
            }
        });
    }

    _showNewMsg(messages) {
        this.setState(prevState => ({
            messages: GiftedChat.append(prevState.messages, messages),
        }))

    }
}

export default Chat;

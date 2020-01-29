import React from 'react'
import axios from 'axios'
import io from 'socket.io-client'
import ImagePicker from 'react-native-image-picker';
import { GiftedChat, Composer, Send } from 'react-native-gifted-chat'
import { View, Button, Icon } from 'native-base'

const options = {
    title: 'Pick an image',
    storageOptions: {
        skipBackup: true,
        path: 'images',
        noData: true,
    },
};


class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            photo: null
        }
    }



    componentDidMount() {
        this._showNewMsg = this._showNewMsg.bind(this);
        this.openCamera = this.openCamera.bind(this);
        this.openGallery = this.openGallery.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.signResult = this.signResult.bind(this);
        this.props.socket.on('new message', this._showNewMsg);
        this.props.socket.on('get res', this.signResult);
    }

    onSend(messages = []) {
        messages[0].sent = true
        messages[0].received = true
        this.props.socket.emit('new message', messages[0].text);
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    // uploadImage() {
    //     var self = this
    //     fetch("http://64.227.53.189:1230/upload-image", {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Access-Control-Allow-Origin': '*'
    //         },
    //         body: this.createFormData(this.state.photo)
    //     })
    //         .then(response => response.json())
    //         .then(response => {
    //             if (response.status == 200) {
    //                 const message = {};
    //                 message._id = 2;
    //                 message.text = 'Success !'
    //                 message.createdAt = Date.now();
    //                 message.user = {
    //                     _id: 2,
    //                     name: 'Mr.Robot',
    //                     avatar: require('../asset/images/bot.png')
    //                 };
    //                 self._showNewMsg(message)
    //             } else {
    //                 const message = {};
    //                 message._id = 3;
    //                 message.createdAt = Date.now();
    //                 message.system = true;
    //                 message.text = 'Sorry, something happened at our end. Try again later !'
    //                 self.setState(prevState => ({
    //                     messages: GiftedChat.append(prevState.messages, message),
    //                 }))
    //             }
    //             console.log("upload succes", response);
    //             this.setState({ photo: null });
    //         })
    //         .catch(error => {
    //             console.log("upload error", error);
    //             const message = {};
    //             message._id = 3;
    //             message.createdAt = Date.now();
    //             message.system = true;
    //             message.text = 'Sorry, something happened at our end. Try again later !'
    //             self.setState(prevState => ({
    //                 messages: GiftedChat.append(prevState.messages, message),
    //             }))
    //         });
    // };

    uploadImage() {
        var self = this
        var config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*'
            }
        }
        axios.post('http://64.227.53.189:1230/upload-image', this.createFormData(this.state.photo), config)
            .then(function (response) {
                console.log(response);
                if (response.status == 200) {
                    console.log('status 200');
                    const message = {};
                    message._id = 2;
                    message.text = 'Success !'
                    message.createdAt = Date.now();
                    message.user = {
                        _id: 2,
                        name: 'Mr.Robot',
                        avatar: require('../asset/images/bot.png')
                    };
                    self._showNewMsg(message)
                } else {
                    const message = {};
                    message._id = 3;
                    message.createdAt = Date.now();
                    message.system = true;
                    message.text = 'Sorry, something happened at our end. Try again later !'
                    self.setState(prevState => ({
                        messages: GiftedChat.append(prevState.messages, message),
                    }))
                }
            })
            .catch(function (error) {
                const message = {};
                message._id = 3;
                message.createdAt = Date.now();
                message.system = true;
                message.text = 'Sorry, something happened at our end. Try again later !'
                self.setState(prevState => ({
                    messages: GiftedChat.append(prevState.messages, message),
                }))
                console.log(error);
            });
        //more /var/log/nginx/error.log
    }

    signResult(result) {
        console.log(result);
        
        const message = {};
        message._id = 2;
        message.text = result
        message.createdAt = Date.now();
        message.user = {
            _id: 2,
            name: 'Mr.Robot',
            avatar: require('../asset/images/bot.png')
        };
        this._showNewMsg(message)
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
            } else {
                const message = {};
                message._id = 2;
                message.createdAt = Date.now();
                message.user = {
                    _id: 1,
                    name: 'You'
                };
                message.image = response.uri;
                message.sent = true
                message.received = true

                this.setState(prevState => ({
                    messages: GiftedChat.append(prevState.messages, message),
                }))

                this.setState({ photo: response })

                this.uploadImage()
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
                message.sent = true
                message.received = true

                this.setState(prevState => ({
                    messages: GiftedChat.append(prevState.messages, message),
                }))
                this.setState({ photo: response })

                this.uploadImage()
            }
        });
    }

    _showNewMsg(messages) {
        this.setState(prevState => ({
            messages: GiftedChat.append(prevState.messages, messages),
        }))

    }

    createFormData(photo) {
        const data = new FormData();

        data.append("file", {
            name: photo.fileName,
            type: photo.type,
            uri:
                Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
        });

        return data;
    };
}

export default Chat;

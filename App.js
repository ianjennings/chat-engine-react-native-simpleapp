import React from "react";
import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import { DrawerNavigator, StackNavigator } from "react-navigation";

import ChatEngineCore from "chat-engine";
import ChatEngineGravatar from "chat-engine-gravatar";

import MessageEntry from "./components/MessageEntry";
import MessageList from "./components/MessageList";
import UserList from "./components/UserList";
import ChatList from "./components/ChatList";

import LoginScreen from "./screens/Login";
import Chat from "./screens/Chat";

const ChatEngine = ChatEngineCore.create(
  {
    publishKey: 'pub-c-d8599c43-cecf-42ba-a72f-aa3b24653c2b',
    subscribeKey: 'sub-c-6c6c021c-c4e2-11e7-9628-f616d8b03518'
  },
  {
    globalChannel: "ajb-global-test-channel-345346685234356343"
  }
);

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chat: null,
      renderChat: false,
      me: null,
      globalChat: null
    };
  }

  componentDidMount() {
    //chatengine throws some warning about timing that is a part of the library itself
    // console.disableYellowBox = true;
    console.ignoredYellowBox = ["Setting a timer"];
  }

  loginWithName = (username) => {
    const now = new Date().getTime();

    if(username === ""){
      return; //do nothing on empty username
    }

    ChatEngine.connect(
      username,
      {
        name: username,
        signedOnTime: now
      }
    );

    ChatEngine.on("$.ready", data => {
      const me = data.me;

      this.setState({
        renderChat: true,
        me: data.me,
        globalChat: ChatEngine.global
      });

    });
  }

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        {Platform.OS === "android" && <View style={styles.statusBarUnderlay} />}

        {!this.state.renderChat ? (
          <LoginScreen loginWithName={this.loginWithName} />
        ) : (
          <View style={{ flex: 1 }}>
            <Chat chatEngine={ChatEngine}/>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: "rgba(0,0,0,0.2)"
  }
});

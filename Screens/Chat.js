import React, { useEffect, useState, useRef } from "react";
import {
  useColorScheme,
  Text,
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Button,
  TouchableOpacity,
  Image
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider as ChatOverlayProvider,
  Message,
  DeepPartial, 
  Theme,
  RootSvg,
  RootPath, 
  useMessageContext,
  useMessageInputContext,
  ImageUploadPreview,
  FileUploadPreview,
  AutoCompleteInput,
  MessageAvatar,
  MessageSimple
} from "stream-chat-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StreamChat } from 'stream-chat';
import {users} from "./users";


const ChannelScreen = ({chatClient, channel, navigation}) => {
  const { bottom }      = useSafeAreaInsets();
  const colorScheme     = useColorScheme();
  const textInput       = useRef(null);
  const [user, setuser] = useState({ ImageKey: "", Name: "" });


  const showUserRole = (id) => {
    let roleArr = id.split("-");
    let role;
    if(roleArr[1] == 'admin') {
      role = 'Admin';
    }else{
      role = 'Member';
    }
    return role;
  }

  const SmallerMessageAvatar = () => <MessageAvatar size={25} />

  const CustomAvatar = (props) => {
    const { message } = useMessageContext();
    return (
      <MessageAvatar
        {...props}
        size={25}
        alignment="left"
        showAvatar={message.groupStyles[0] === 'single' || message.groupStyles[0] === 'top'}
      />
    )
  }

  const CustomMessage = () => {
    const { message } = useMessageContext();
    return (
      <MessageSimple
        MessageAvatar={CustomAvatar}
      />
    )
  }

  const CustomInput = props => {
    const { sendMessage, text, toggleAttachmentPicker, openCommandsPicker } = useMessageInputContext();
  
    return (
      <View style={styles.fullWidth}>
        <ImageUploadPreview />
        <FileUploadPreview />
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          {/* <Button title='Attach' onPress={toggleAttachmentPicker} /> */}
          <TouchableOpacity style={{width: '10%', padding:5}} onPress={toggleAttachmentPicker}>
            <Image 
            style={{width: '100%', height: 18, marginTop: 5}}
            source={require('../images/camera.png')} />
          </TouchableOpacity>
          <View style={{width: '90%', backgroundColor:'#F5F5F5', borderRadius: 15, padding: 5}}>
            <AutoCompleteInput />
          </View>
          <View 
          style={{
            width: 27, 
            height: 27, 
            borderRadius: 50, 
            backgroundColor: '#ff8c04',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            position: "absolute",
            right: 4,
            top: 2.5,
            marginTop: 0
          }} 
          >
            <TouchableOpacity onPress={sendMessage}>
              <Image 
                style={{width: 13, height: 15}}
                source={require('../images/arrow.png')} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };




  const myMessageTheme = {
    messageSimple: {
      content: {
        replyBorder: {
          borderColor: 'transparent',
        },
        containerInner: {
          backgroundColor: '#ffd798',
          borderWidth: 0,
        },
        deletedContainerInner: {
          backgroundColor: '#ffd798',
          borderWidth: 0,
        },
      },
      replies: {
        container: {
          backgroundColor: '#ffd798',
        },
      },
      
    },
  }

  const themeStyle = {
    messageSimple: {
      content: {
        markdown: {
          heading1: {
            color: 'pink',
          },
          inlineCode: {
            fontSize: 10,
          },
          text:{
            color: '#000'
          }
        },
        containerInner: {
          borderWidth: 0,
        },
        container:{
        }
      },
      avatarWrapper:{
        container:{
          display: 'flex',
          alignSelf: 'center',
          margintop: 100
        }
      },
      container: {}
    },
    messageList: {
      container: {
        backgroundColor: 'transparent',
      },
    },
  };
  
  return (
    <SafeAreaView edges={['bottom']}>
      {Platform.OS == "ios" ? (
        <StatusBar  barStyle="dark-content" hidden = {false}/>
      ) : null}
      <View>
      <ChatOverlayProvider
        translucentStatusBar={false}
        bottomInset={bottom}
        topInset={0}
      >
        <Chat style={themeStyle} client={chatClient}>
          {/* Setting keyboardVerticalOffset as 0, since we don't have any header yet */}
          <Channel
            //MessageAvatar={CustomAvatar}
            MessageSimple={CustomMessage}
            Input={CustomInput}
            myMessageTheme={myMessageTheme}
            channel={channel}
            keyboardVerticalOffset={5}
            MessageHeader={(props) =>
              props.message?.user?.id !== chatClient.userID ? (
                <View
                  style={{ flexDirection: 'row' }}
                >
                  {Object.keys(props.members).length > 2 &&
                    props.message.user?.id ? (
                      <Text style={[{ color: '#ccc', marginRight: 8 }]}>
                        {showUserRole(props.message.user.id)}
                      </Text>
                    ) : null}
                </View>
              ) : null
            }
          >
            {/* <View style={{backgroundColor: '#000'}}> */}
              <View>
                  <Button
                  title="Disconnect"
                  onPress={async() => {
                    await chatClient.disconnect();
                    navigation.navigate('Home')
                  }}
                  />
              </View>
              <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <MessageList />
                <MessageInput />
              </View>
            {/* </View> */}
          </Channel>
        </Chat>
      </ChatOverlayProvider>
      </View>
    </SafeAreaView>
  );
};

function ChatScreen(props) {

  const [ready, setReady] = useState(false);
  const [channelId, setChannel] = useState({});
  const client = StreamChat.getInstance('sxddnv6syrx8');
  
  useEffect(() => {
    const connectStreamUser = async () => {
      try {
        let channel;
        if(!props.route.params?.channel){
          channel = client.channel("team", props.route.params?.channel_name, {
            name : props.route.params?.channel_name,
            members: users
          });
        }else{
          channel = props.route.params?.channel;
        }
        setChannel(channel);
        await channel.watch();
        setReady(true);
      } catch (err) {
        console.log(err);
      }
      return () => {};
    };
    const start = async () => {
      connectStreamUser();
    };
    start();
    //  return () => chatClient.disconnectUser();
  }, []);
  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          top: "20%",
        }}
      >
        <Text style={{ marginBottom: 50 }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View>
      <ChannelScreen
        navigation={props.navigation}
        channel={channelId}
        chatClient={client}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1 },
  fullWidth: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    height: 40,
  },
  menuUserImg: {
    width: 56,
    height: 56,
    borderRadius: 30,
    borderWidth: 0.3,
    padding: 5,
  },
  userInfo: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 10,
  },
  userName: {
    color: "#000000",
    fontSize: 16,
  },
  headerBox: {
    width: "100%",
    marginTop: 50,
    paddingLeft:20,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 20,
    borderBottomWidth: 2,
    borderColor: "#eee"
  },
});
export default ChatScreen;


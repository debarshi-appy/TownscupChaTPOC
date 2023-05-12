import React, {useState, useEffect} from 'react';
import  {View, Button, TextInput, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { StreamChat } from 'stream-chat';
import {
    Chat,
    OverlayProvider as ChatOverlayProvider,
    ChannelList,
} from 'stream-chat-react-native';
import {users} from "./users";

export default function ChatList(props){

    const [channels, setChannels] = useState([]);

    const chatClient = StreamChat.getInstance('sxddnv6syrx8');

    const filter = { members: { $in: ['123'] } };
    const sort = [{ last_message_at: -1 }];


    useEffect(()=> {
        getUserChannel();
    },[])


    const getUserChannel = async() => {

        const channels = await chatClient.queryChannels(filter, sort, {
            watch: true, // this is the default
            state: true,
        });

        console.log("channels", channels)

        setChannels(channels)

    //     channels.map((channel) => {
    //         console.log("Members", channel.state.members)
    //    })
    }

    return (
        <View style={{flex: 1}}>
            <View>
                <Button
                  title="Disconnect"
                  onPress={async() => {
                    await chatClient.disconnect();
                    props.navigation.navigate('Home')
                  }}
                  />
            </View>
            {/* <View style={{marginTop: 10}}>
                <Text>Chat List</Text>
                {
                channels.map((channel , key) => (
                    <TouchableOpacity
                        key={key}
                        style={{
                            display: 'flex',
                            backgroundColor: '#ccc',
                            marginTop: 10,
                            padding: 10
                        }}
                        onPress = {() => props.navigation.navigate('Chat', {channel : channel})}
                    >
                        <View style={{flexDirection: 'column'}}>
                            <Text>Channel name : {channel.data.name}</Text>
                            <Text>Unread message: {channel.state.unreadCount}</Text>
                        </View>
                    </TouchableOpacity>
                ))
                }
            </View> */}
            <ChatOverlayProvider>
                <Chat client={chatClient}>
                    {/* <ChannelList 
                    filters={filter}
                    onSelect={(channel) => props.navigation.navigate('Chat', {channel : channel})}
                    /> */}

                    <ChannelList 
                    filters={filter}
                    onSelect={(channel) => props.navigation.navigate('Chat', {channel : channel})}
                    />
                </Chat>
            </ChatOverlayProvider>
        </View>
    )
}
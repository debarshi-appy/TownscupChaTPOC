import React, {useState} from 'react';
import  {View, Button, TextInput, StyleSheet} from 'react-native';
import { StreamChat } from 'stream-chat';
import {users} from "./users";
import Asyncstorage from '@react-native-async-storage/async-storage';
const client = StreamChat.getInstance('sxddnv6syrx8');

export default function Home(props) {

  const [userID, setUserID] = useState('');

  const switchUser = async(users) => {
    let profile = users.find((item) => { return item.user.id === userID});
    if(profile) {
      let user = await client.connectUser(
        {
          id: profile.user.id,
          name: profile.user.name,
        },
        profile.user.token,
      );
      let current_user = await Asyncstorage.getItem("current_user");
      if(!current_user) {
        await Asyncstorage.setItem("current_user", profile.user.id);
      }
      props.navigation.navigate("Chat" , {channel_name : 'Football-group-0011'});
    }
  }


  const goToChatList = async() => {
    let profile = users.find((item) => { return item.user.id === userID});
    if(profile) {
      let user = await client.connectUser(
        {
          id: profile.user.id,
          name: profile.user.name,
        },
        profile.user.token,
      );
      let current_user = await Asyncstorage.getItem("current_user");
      if(!current_user) {
        await Asyncstorage.setItem("current_user", profile.user.id);
      }
      props.navigation.navigate("ChatList");
    }
  }

  return (
    <View style={{
      width: '95%', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={{marginBottom:10}}>
        <Button
          style={{marginTop:10}}
          title="Go to Chat List"
          onPress={() => goToChatList(users)}
        />
      </View>

      <View>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setUserID(text)}
          value={userID}
        />
      </View>

      <View style={{marginBottom:10}}>
        <Button
          title="Join Chat"
          onPress={() => switchUser(users)}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    display: 'flex',
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width:'100%',
    backgroundColor: '#eee'
  },
});
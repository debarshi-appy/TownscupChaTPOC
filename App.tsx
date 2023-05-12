import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Asyncstorage from '@react-native-async-storage/async-storage';
import { StreamChat } from 'stream-chat';
import Home from "./Screens";
import Chat from "./Screens/Chat";
import ChatList from "./Screens/ChatList";

const client = StreamChat.getInstance('sxddnv6syrx8');
const Stack = createStackNavigator();

export default function App() {
  useEffect(()=>{
    storeClient()
  },[]);

  const storeClient = async() => {
    let login = await Asyncstorage.getItem("is_login");
    // await client.connectUser(
    //   {
    //     id : '101112', 
    //     name : "Pratik", 
    //   },
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTAxMTEyIn0.90P7CUrqzt9jVB7Pz32L4czPFytdNMTnbylczSjbGnQ',
    // );
    // await client.disconnect();
    // console.log('connected')
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
      screenOptions={{
        headerShown: false
      }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="ChatList" component={ChatList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
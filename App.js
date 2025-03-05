import { Button, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { addDoc, collection, firestore, MESSAGES, orderBy,
  onSnapshot, query, serverTimestamp, doc, deleteDoc } from './firebase/Config';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')


  useEffect(() => {
    const q = query(collection(firestore,MESSAGES),orderBy('created','desc'))
    const unsubscribe = onSnapshot(q,(querySnapshot) => {
      const tempMessages = []
      querySnapshot.forEach((doc) => {
        tempMessages.push({...doc.data(), id: doc.id})
      })
      setMessages(tempMessages)
    })
    return () => {
      unsubscribe()
    }
  })

  const save = async () => {
    const docRef = await addDoc(collection(firestore,MESSAGES), {
      text: newMessage,
      created: serverTimestamp()
    }).catch (e => console.log(e))
    setNewMessage('')
    console.log("Saved item to shopping list.")
  }

  const deleteMessage = async (id) => {
    const docRef = await deleteDoc(doc(firestore,'messages',id))
    console.log("Removed item from shopping list.")
  }
  return (
    
<SafeAreaView style={styles.container}>
  <Text style={styles.header}>Shopping list</Text>
  <View style={styles.form}>
    
    <TextInput
      placeholder='Add to list...'
      value = {newMessage}
      onChangeText={text => setNewMessage(text)}
    />
    <Button title="Save" onPress={save} />
  </View>
  <ScrollView>
    {
      messages.map((message) => (
        <View key={message.id} style={styles.message}>
          <Text>{message.text}
            <Pressable onPress={() => deleteMessage(message.id)}>
              <Ionicons name='trash-bin' size={24} style={styles.trash}></Ionicons>
            </Pressable>
          </Text>
          

        </View>
      ))
    }
  </ScrollView>

</SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 8
  },
  form: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  message: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5
  },
  messageInfo: {
    fontSize: 12,
  },
  header: {
    fontSize: 20,
    paddingTop: 10
  },
  trash: {
      paddingLeft: 10
  }
});

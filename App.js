import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskList from './src/components/TaskList';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AnimatableBtn = Animatable.createAnimatableComponent(TouchableOpacity);



export default function App() {
  const [task, setTask] = useState([]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [input2, setInput2] = useState('');

  useEffect(() =>{
    async function loadTasks(){
      const taskStorage = await AsyncStorage.getItem('@task');
  
      if(taskStorage){
        setTask(JSON.parse(taskStorage));
      }
    }
    loadTasks();
  }, [])
  
  //salvando caso tenha alguma variavel alterada
  useEffect(() => {
    async function saveTasks(){
      await AsyncStorage.setItem('@task', JSON.stringify(task));
    }
    saveTasks();
  },[task])
  

  function handleAdd() {
    if (input  === '' || input2 === '') {
    alert("Preencha todos os campos!!")  
      return;
    }
    

    const data = {
      key: input2,
      task: input
    };


    setTask([...task, data]);
    setOpen(false);
    setInput('');
    setInput2('');

  }


  const handleDelete = useCallback((data) => {
      const find = task.filter(r => r.key !== data.key);
      setTask(find);
      
    }
  );


  return (
    <SafeAreaView style={styles.container}>

      <StatusBar backgroundColor='#171d31' barStyle="ligth-content" />
      <View style={styles.content}>
        <Text style={styles.title}> Contatos de Juliana Teixeira </Text>
      </View>
      
      <FlatList //exibição da lista
      
        marginHorizontal={10}
        showsHorizontalScrollIndicator={false} // desativa barra de scroll
        data={task} // contem todos itens da lista
        keyExtractor={(item) => String(item.key)} // cada item tem uma chave
        renderItem={
          ({ item })  => 
          <View>
             <TaskList data={item} handleDelete={handleDelete} /> 
          </View>} // rederiza (mostra) os itens
    
      />

      <Modal animationType="slide" transparent={false} visible={open}>
            <SafeAreaView style={styles.modal}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Ionicons style={{ marginLeft: 5, marginRight: 5 }} name="md-arrow-back" size={40} color={'#fff'}></Ionicons>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Novo contato</Text>
            </View>

        <Animatable.View style={styles.modalBody} animation={"fadeInUp"} useNativeDriver > 
            <TextInput
   
              placeholderTextColor="#000"
              autoCorrect={false}
              placeholder="Entre com o telefone"
              style={styles.input}
              value={input2}
              onChangeText={(text) => setInput2(text)}
            />

             <TextInput
            
              placeholderTextColor="#000"
              autoCorrect={false}
              placeholder="Entre com o nome"
              style={styles.input}
              value={input}
              onChangeText={(text) => setInput(text)}

            />

            <TouchableOpacity style={styles.handleAdd} onPress={handleAdd}>
              <Text style={styles.handleAddText}>Cadastrar</Text>
            </TouchableOpacity>
            </Animatable.View>

        </SafeAreaView>
      </Modal>

      <AnimatableBtn
        style={styles.fab}
        animation="bounceInUp"
        duration={1500}
        onPress={() => setOpen(true)}
      >
        <Ionicons name="ios-add" size={35} color="#FFF" />
      </AnimatableBtn>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#845EC2',
  
  },
  title: {
    marginTop: 10,
    paddingBottom: 10,
    fontSize: 25,
    textAlign: "center",
    color: 'white'
  },
  modal: {
    flex: 1,
    backgroundColor: '#845EC2'
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3,
    }
  },


  modal: {
    flex: 1,
    backgroundColor: '#845EC2',
  },
  modalHeader: {
    marginLeft: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalTitle: {
    marginLeft: 15,
    fontSize: 23,
    color: '#FFF'
  },
  modalBody: {
    marginTop: 30
  },
input:{
  fontSize: 15,
  backgroundColor: '#fff',
  marginLeft: 10,
  marginRight: 10,
  marginTop: 10,
  padding: 9,
  height: 35,
  textAlignVertical: 'top',
  color: '#000',
  borderRadius: 5

},

  handleAdd: {
    backgroundColor: '#FFF',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 5
  },
  handleAddText: {
    fontSize: 20,
  }
})

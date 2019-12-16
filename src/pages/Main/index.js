import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '../../services/api';


import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  } from './styles';



export default class Main extends Component {

  static navigationOptions = {
    title: "Usuários",
  };

  static PropTypes = {
    navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
  };

  state = {
    // amazanamento de dados do - usuário -
    newUser: '',
    users: [],
    loading: false,
  };

  // buscar dados
  async componentDidMount() {

    const users = await AsyncStorage.getItem('users');

    if(users) {
      this.setState({ users: JSON.parse(users) });
    }

  }

  // salvar alterações na variavel - user -
   componentDidUpdate(_, prevState) {

    const { users } = this.state;

    // confirindo se houve mudança de estado
    if(prevState.users !== users) {
        AsyncStorage.setItem('users', JSON.stringify(users)); // apenas reconhece - JSON -
    }
  }


  handleAddUser = async () => {
    const { users, newUser } = this.state;

    this.setState({ loading: true });

    const response = await api.get(`/users/${newUser}`);

    // dados da API do GitHub
    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    this.setState({
      users: [ ...users, data ],
      newUser: '',
      loading: false,
    });

    // teclado ira se recolher assim que o usuário preencher o - input -
    Keyboard.dismiss();
  };

  handleNavigation = (user) => {
    const { navigation } = this.props;

    navigation.navigate('User', { user });
  }

  render() {

    // buscar usuário
    const { users, newUser, loading } = this.state;




    return (
      <Container>
        <Form>
          <Input
            // não corrigir automaticamnete o nome de usuário
            autoCorrect={false}

            // não botar a primeira letra como maiúsculo por padrão
            autoCapitalize="none"
            placeholder="adicionar usuário"
            value={newUser}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />

            <SubmitButton onPress={this.handleAddUser}>
                { loading ? ( <ActivityIndicator color="#fff" /> )
                  : ( <Icon name="add" size={20} color="#fff" /> ) }
            </SubmitButton>
          </Form>

          <List
              data={users}

              // propiedade única
              keyExtractor={ user => user.login }

              // item: acessa todas as informações do usuário, como: name, login, boi...
              renderItem={({ item }) => (

                <User>
                    <Avatar source={{ uri: item.avatar }} />
                    <Name>{item.name}</Name>
                    <Bio>{item.bio}</Bio>

                    <ProfileButton onPress={() => this.handleNavigation(item)}>
                        <ProfileButtonText>Ver perfil</ProfileButtonText>
                    </ProfileButton>
                </User>
              )}
          />


        </Container>
    );

  }
}




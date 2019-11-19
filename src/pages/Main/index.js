import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

// API Import
import api from '../../services/api';

export default class Main extends Component {
    static navigationOptions = {
        title: 'Users',
    };

    static propTypes = {
        navigation: PropTypes.shape({
            navigate: PropTypes.func,
        }).isRequired,
    };

    state = {
        newUser: '',
        users: [],
        loading: false,
    };

    async componentDidMount() {
        const users = await AsyncStorage.getItem('users');

        if (users) this.setState({ users: JSON.parse(users) });
    }

    componentDidUpdate(_, prevState) {
        const { users } = this.state;

        if (prevState.users !== users)
            AsyncStorage.setItem('users', JSON.stringify(users));
    }

    handleAddUser = async () => {
        const { newUser, users } = this.state;

        this.setState({ loading: true });

        try {
            Keyboard.dismiss();
            const response = await api.get(`/users/${newUser}`);

            const data = {
                name: response.data.name,
                login: response.data.login,
                bio: response.data.bio,
                avatar: response.data.avatar_url,
            };

            this.setState({
                users: [...users, data],
                newUser: '',
            });
        } catch (err) {
            Alert.alert('Erro', `This user doesn't exists`, [{ text: 'Ok' }], {
                cancelable: false,
            });
        }

        this.setState({ loading: false });
    };

    handleNavigate = user => {
        const { navigation } = this.props;
        navigation.navigate('User', { user });
    };

    render() {
        const { users, loading } = this.state;
        return (
            <Container>
                <Form>
                    <Input
                        autoCorrect={false}
                        autoCaptalize="none"
                        placeholder="Add User"
                        onChangeText={text => this.setState({ newUser: text })}
                        returnKeyType="send"
                        onSubmitEditing={this.handleAddUser}
                    />
                    <SubmitButton
                        loading={loading}
                        onPress={this.handleAddUser}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Icon name="add" size={20} color="#fff" />
                        )}
                    </SubmitButton>
                </Form>
                <List
                    data={users}
                    keyExtractor={user => user.login}
                    renderItem={({ item }) => (
                        <User>
                            <Avatar source={{ uri: item.avatar }} />
                            <Name>{item.name}</Name>
                            <Bio>{item.bio}</Bio>

                            <ProfileButton
                                onPress={() => this.handleNavigate(item)}>
                                <ProfileButtonText>
                                    See Profile
                                </ProfileButtonText>
                            </ProfileButton>
                        </User>
                    )}
                />
            </Container>
        );
    }
}

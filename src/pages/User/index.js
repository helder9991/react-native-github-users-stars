import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
    Container,
    Header,
    Avatar,
    Name,
    Bio,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
    Loading,
} from './styles';

export default class User extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('user').name,
    });

    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
        }).isRequired,
    };

    state = {
        stars: [],
        loading: true,
        page: 2,
        refreshing: false,
    };

    async componentDidMount() {
        const { navigation } = this.props;
        const user = navigation.getParam('user');

        const response = await api.get(`/users/${user.login}/starred`);
        this.setState({ stars: response.data, loading: false });
    }

    handleList = async () => {
        const { page, stars } = this.state;
        const { navigation } = this.props;
        const user = navigation.getParam('user');

        const response = await api.get(`/users/${user.login}/starred`, {
            params: {
                page,
            },
        });

        if (response)
            this.setState({
                stars: [...stars, ...response.data],
                page: page + 1,
            });
    };

    handleNavigate = repository => {
        const { navigation } = this.props;
        navigation.navigate('Web', { repository });
    };

    refreshList = async () => {
        this.setState({ refreshing: true });

        const { navigation } = this.props;
        const user = navigation.getParam('user');

        const response = await api.get(`/users/${user.login}/starred`);

        if (response)
            this.setState({
                stars: response.data,
                page: 2,
            });

        this.setState({ refreshing: false });
    };

    render() {
        const { navigation } = this.props;
        const { stars, loading } = this.state;
        const user = navigation.getParam('user');
        return (
            <Container>
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <Header>
                            <Avatar source={{ uri: user.avatar }} />
                            <Name>{user.name}</Name>
                            <Bio>{user.bio}</Bio>
                        </Header>
                        <Stars
                            data={stars}
                            keyExtractor={star => String(star.id)}
                            renderItem={({ item }) => (
                                <Starred
                                    onPress={() => this.handleNavigate(item)}>
                                    <OwnerAvatar
                                        source={{ uri: item.owner.avatar_url }}
                                    />
                                    <Info>
                                        <Title>{item.name}</Title>
                                        <Author>{item.owner.login}</Author>
                                    </Info>
                                </Starred>
                            )}
                            onEndReached={this.handleList}
                            onEndReachedThreshold={0.25}
                            onRefresh={this.refreshList}
                            refreshing={this.state.refreshing}
                        />
                    </>
                )}
            </Container>
        );
    }
}

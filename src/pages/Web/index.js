import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

// import { Container } from './styles';

export default class Web extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('repository').name,
    });

    state = {
        url: '',
        loading: true,
    };

    componentDidMount() {
        const { navigation } = this.props;
        const { html_url } = navigation.getParam('repository');

        this.setState({ url: html_url, loading: false });
    }

    render() {
        const { url, loading } = this.state;
        return loading ? (
            <ActivityIndicator style={{ flex: 1 }} size="large" />
        ) : (
            <WebView source={{ uri: url }} />
        );
    }
}

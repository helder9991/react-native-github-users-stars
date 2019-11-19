import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// Pages imports
import Main from './pages/Main';
import User from './pages/User';
import Web from './pages/Web';

const Routes = createAppContainer(
    createStackNavigator(
        {
            Main,
            User,
            Web,
        },
        {
            headerLayoutPreset: 'center',
            headerBackTitleVisible: false,
            defaultNavigationOptions: {
                headerStyle: {
                    backgroundColor: '#7159c1',
                },
                headerTintColor: '#fff',
            },
        },
    ),
);

export default Routes;

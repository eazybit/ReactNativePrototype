import React, { Component, PropTypes } from 'react';
import { AppRegistry, NavigatorIOS, Text, View } from 'react-native';

import Login from './views/login';

export default class ReactNativePrototype extends Component {
  render() {
    return (
        <NavigatorIOS
            initialRoute={{
                component: Login,
                title: 'Tamale RMS'
            }}
            style={{flex: 1}}
        />
    )
  }
}

AppRegistry.registerComponent('ReactNativePrototype', () => ReactNativePrototype);
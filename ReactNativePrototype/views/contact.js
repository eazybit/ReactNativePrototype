/**
 * Created by yxzhang on 10/5/16.
 */
import React, { Component, PropTypes } from 'react';
import { ListView, View, Text, StyleSheet, TouchableHighlight, Alert, NativeModules      } from 'react-native';
var ReactNative = require('react-native');
var Contacts = ReactNative.NativeModules.Contacts;

export default class Contact extends Component {
    constructor(props, context) {
        super(props, context);
        try {
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.state = {
                dataSource: ds.cloneWithRows([{familyName: 'test1', givenName: 'test1'}])
            };
            Contacts.checkPermission( (err, permission) => {
                // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
                if(permission === 'undefined'){
                    Contacts.requestPermission( (err, permission) => {
                        // ...
                    })
                }
                if(permission === 'authorized'){
                    Contacts.getAll((err, contacts) => {
                        if(err && err.type === 'permissionDenied'){
                            // x.x
                        } else {
                            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                            this.setState({
                                dataSource: ds.cloneWithRows(contacts)
                            });
                        }
                    })
                }
                if(permission === 'denied'){
                    // x.x
                }
            });
        } catch(e) {

        }
    }

    renderRow(data: String) {
        if(data == null) {
            return (<Text>Empty</Text>);
        }
        return (
            <TouchableHighlight>
                <View style={styles.container}>
                    <Text style={styles.title}>{`${data.givenName}`} {`${data.familyName}`}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    render() {
        return (
            <View style={{marginTop: 100}}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(data) => this.renderRow({...data})}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        flexDirection: 'column',
        alignItems: 'center',
        borderBottomColor: 'gray',
        borderBottomWidth: 1
    },
    title: {
        fontSize: 20,
        fontWeight: '400'
    },
    subTitle: {
        fontSize: 12
    }
});
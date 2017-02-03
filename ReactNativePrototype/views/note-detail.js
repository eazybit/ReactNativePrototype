/**
 * Created by yxzhang on 10/5/16.
 */
import React, { Component, PropTypes } from 'react';
import { ListView, View, Text, StyleSheet, TouchableHighlight, Alert } from 'react-native';
// var LocalNotification = require('@remobile/react-native-local-notifications');

export default class NoteDetail extends Component {
    static propTypes = {
        note: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>234</Text>
                <Text style={styles.title}>{`${this.props.note.title}`}</Text>
                <Text style={styles.subTitle}>{`${this.props.note.entryType}`}</Text>
                <Text style={styles.subTitle}>{`${this.props.note.displayDate}`}</Text>
                <Text style={styles.subTitle}>{`${this.props.note.submitter}`}</Text>
                <Text style={styles.subTitle}>{`${this.props.note.priority}`}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 100,
        padding: 12,
        flexDirection: 'column',
        alignItems: 'center'
    },
    title: {
        fontSize: 30,
        fontWeight: '400',
        marginBottom: 20
    },
    subTitle: {
        fontSize: 16
    }
});
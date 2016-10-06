/**
 * Created by yxzhang on 10/4/16.
 */
import React, { Component, PropTypes } from 'react';
import { ListView, View, Text, StyleSheet, TouchableHighlight, Alert } from 'react-native';

export default class Research extends Component {
    static propTypes = {
        token: PropTypes.string.isRequired
    };

    constructor(props, context) {
        super(props, context);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([null])
        };
        this.getNotes()
            .then((response) => response.json())
            .then((responseJson) => this.setNotes(responseJson['thread-list']))
            .catch((error) => {
                console.error(error);
            });
    }

    getNotes() {
        return fetch('http://tamaledev.gencos.com/restapi/2.0/thread/?expand=thread;entry;entities;entity;source;submitter;&outputformat=json&page=1&rpp=20&showpermission=true&sortby=lastediteddate&sortorder=desc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic [token' + this.props.token + 'token]'
            },
            body: ''
        });
    }

    setNotes(data) {
        var notes: Array<Object> = [];
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        for(let note of data) {
            var tmpNote: Object  = {};
            let noteData = note.notes[0]["data"];
            tmpNote["id"] = noteData["id"];
            tmpNote["title"] = noteData["title"];
            tmpNote["entryType"] = noteData["entry-type"].link.phid;
            tmpNote["priority"] = noteData["priority"];
            tmpNote["sentiment"] = noteData["sentiment"];
            tmpNote["submitter"] = noteData["submitter"].link.phid;
            tmpNote["displayDate"] = new Date(noteData["display-date"]);
            notes.push(tmpNote);
        }
        this.setState({
            dataSource: ds.cloneWithRows(notes)
        });
    }


    render() {
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data) => <Row {...data} />}
            />
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

const Row = (props) => (
    <TouchableHighlight
       onPress={() => Alert.alert(
            `${props.title}`,
            `${props.id}`,
            [
              {text: 'Download', onPress: () => downloadNote(`${props.id}`)},
              {text: 'Detail', onPress: () => console.log('Cancel Pressed!')},
              {text: 'Edit', onPress: () => alert('Edit')},
              {text: 'Delete', onPress: () => alert('Delete')},
              {text: 'Add Sidenote', onPress: () => alert('Add sidenote')},
              {text: 'Cancel'}
            ]
          )}>
        <View style={styles.container}>
            <Text style={styles.title}>{`${props.title}`}</Text>
            <Text style={styles.subTitle}>{`${props.entryType}`}</Text>
            <Text style={styles.subTitle}>{`${props.displayDate}`}</Text>
            <Text style={styles.subTitle}>{`${props.submitter}`}</Text>
            <Text style={styles.subTitle}>{`${props.priority}`}</Text>
        </View>
    </TouchableHighlight>
);

function downloadNote(id) {
    try {
        var RNFS = require('react-native-fs');
    } catch(e) {
        alert(e);
    }

}
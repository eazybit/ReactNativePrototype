/**
 * Created by yxzhang on 10/4/16.
 */
import React, { Component, PropTypes } from 'react';
import { ListView, View, Text, StyleSheet, TouchableHighlight, Alert, RNFSManager } from 'react-native';
import NoteDetail from './note-detail';
import Contact from './contact';
var RNFS = require('react-native-fs');

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

    renderRow(data: String) {
        if(data == null) {
            return (<Text>Empty</Text>);
        }
        return (
            <TouchableHighlight
                onPress={() => Alert.alert(
                `${data.title}`,
                `${data.id}`,
                [
                  {text: 'Download', onPress: () => this.downloadNote(data)},
                  {text: 'Detail', onPress: () => this.showDetail(data.id)},
                  {text: 'Edit', onPress: () => alert('Edit')},
                  {text: 'Delete', onPress: () => alert('Delete')},
                  {text: 'Add Sidenote', onPress: () => alert('Add sidenote')},
                  {text: 'Cancel'}
                ]
              )}>
                    <View style={styles.container}>
                        <Text style={styles.title}>{`${data.title}`}</Text>
                        <Text style={styles.subTitle}>{`${data.entryType}`}</Text>
                        <Text style={styles.subTitle}>{`${data.displayDate}`}</Text>
                        <Text style={styles.subTitle}>{`${data.submitter}`}</Text>
                        <Text style={styles.subTitle}>{`${data.priority}`}</Text>
                    </View>
            </TouchableHighlight>
        )
    }

    downloadNote(data) {
        try {
            // var data = JSON.parse(dataString);
            var path = RNFS.DocumentDirectoryPath + '/' + data.id + '.json';
            console.log(path);
            RNFS.writeFile(path, JSON.stringify(data), 'utf8')
                .then((success) => {
                    alert('save file success at: ' + path);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch(e) {
            alert(e);
        }
    }

    showDetail(id) {
        try {
            var path = RNFS.DocumentDirectoryPath + '/' + id + '.json';
            console.log(path);
            RNFS.readFile(path, 'utf8')
                .then((content) => {
                    this.props.navigator.push( {
                        component: NoteDetail,
                        title: 'Note Detail',
                        passProps: {
                            note: JSON.parse(content)
                        }
                    });
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch(e) {
            alert(e);
        }
    }

    goToContact() {
        this.props.navigator.push( {
            component: Contact,
            title: 'Contact List'
        });
    }


    render() {
        return (
            <View style={{
                    marginTop: 100
                }}>
                <TouchableHighlight onPress={() => this.goToContact()}>
                    <Text>Contact</Text>
                </TouchableHighlight>
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
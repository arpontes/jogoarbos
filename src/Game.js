import React, { Component, Fragment } from 'react';
import localforage from 'localforage';

import GameStore from "./GameStore";
import TopBar from "./TopBar";

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = { isDataLoaded: false };
    }

    componentDidMount() {
        var fnSetState = this.setState.bind(this);
        localforage.getItem('dataStore').then(function (value) {
            fnSetState({ isDataLoaded: true, startData: value });
        }).catch(function (err) {
            console.log(err);
        });
    }
    updateDataStore(value) {
        localforage.setItem("dataStore", value);
    }
    render() {
        if (!this.state.isDataLoaded)
            return <Fragment />;
        return (
            <GameStore startData={this.state.startData} updateDataStore={val => this.updateDataStore(val)} >
                <TopBar />
            </GameStore>
        );
    }
} export default Game;
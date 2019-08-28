import React, { Component } from 'react';
import { StoreContext } from "./StoreContext";

class GameStore extends Component {
    constructor(props) {
        super(props);

        var st = props.startData;
        if (st)
            for (var item of Object.keys(st.Games))
                for (var player of Object.keys(st.Games[item].Players))
                    st.Games[item].Players[player].PictLink = this.buildPictLink(st.Games[item].Players[player].Pict);

        this.state = st ? st : { Games: {}, SelectedGameId: null, SelectedPlayerId: null, TransferFromId: null, TransferToId: 0, ShowHistoricOf: null };

        this.Functions = {
            CreateGame: () => this.createGame(),
            CreatePlayer: (name, pict, startTotal) => this.createPlayer(name, pict, startTotal),
            SavePlayer: (name, pict) => this.savePlayer(name, pict),
            DeletePlayer: id => this.deletePlayer(id),
            SelectGame: id => {
                if (this.state.SelectedGameId != id)
                    this.setAndSaveState({ SelectedGameId: id, SelectedPlayerId: null, TransferFromId: null, TransferToId: 0, ShowHistoricOf: null })
            },
            SelectPlayer: id => this.setAndSaveState({ SelectedPlayerId: id }),
            SetTransfer: id => this.setAndSaveState({ TransferFromId: id, TransferToId: 0 }),
            SetTransferTo: id => this.setAndSaveState({ TransferToId: id }),
            Transfer: val => this.transfer(this.state.TransferFromId, this.state.TransferToId, val),
            OpenHistoric: id => this.setAndSaveState({ ShowHistoricOf: id }),
        };
    }

    setAndSaveState(obj) {
        this.setState(obj, () => this.props.updateDataStore(this.state));
    }

    buildPictLink(pict) {
        if (pict == null) return null;
        var blob = new Blob([new Uint8Array(pict)], { type: "image/jpeg" });
        var urlCreator = window.URL || window.webkitURL;
        return urlCreator.createObjectURL(blob);
    }

    createGame() {
        var games = { ...this.state.Games };

        var newId;
        do { newId = Math.floor(Math.random() * 100000000).toString(); }
        while (games[newId]);

        games[newId] = { Start: new Date(), Players: {}, Transactions: [{ Dt: new Date(), Act: "Iniciando jogo", Val: 1000000 }], TotalBank: 1000000, PrevTotalBank: 0 };
        this.setAndSaveState({ Games: games, SelectedGameId: newId });
    }

    deletePlayer(id) {
        var gameId = this.state.SelectedGameId;
        var games = this.state.Games;
        var game = games[gameId];

        var player = game.Players[id];
        this.transfer(id, 0, player.Total, () => delete game.Players[id]);
    }
    savePlayer(playerName, pict) {
        var gameId = this.state.SelectedGameId;
        var games = this.state.Games;
        var game = { ...games[gameId] };

        var player = { ...game.Players[this.state.SelectedPlayerId], Name: playerName, Pict: pict, PictLink: this.buildPictLink(pict), LastChange: new Date() };
        player.PrevTotal = player.Total;
        var players = { ...game.Players, [this.state.SelectedPlayerId]: player };
        this.setAndSaveState({ Games: { ...games, [gameId]: { ...game, Players: players } }, SelectedPlayerId: null });
    }
    createPlayer(playerName, pict, startTotal) {
        var gameId = this.state.SelectedGameId;
        var games = this.state.Games;
        var game = { ...games[gameId] };

        var players = { ...game.Players };
        var newId;
        do { newId = Math.floor(Math.random() * 100000000).toString(); }
        while (players[newId]);

        players[newId] = { Name: playerName, Pict: pict, PictLink: this.buildPictLink(pict), Total: startTotal, Transactions: [{ Dt: new Date(), Act: "Entrando no jogo", Val: 5000 }], LastChange: new Date() };

        this.setAndSaveState({ Games: { ...games, [gameId]: { ...game, Players: players } }, SelectedPlayerId: null });
    }

    transfer(userOriginId, userDestinyId, value, fn) {
        var game = this.state.Games[this.state.SelectedGameId];

        game.Players = { ...game.Players };
        var origin = userOriginId == 0 ? "Banco" : game.Players[userOriginId].Name;
        var destiny = userDestinyId == 0 ? "Banco" : game.Players[userDestinyId].Name;

        if (userOriginId == 0) {
            game.PrevTotalBank = game.TotalBank;
            game.TotalBank -= value;
        } else {
            var originPlayer = game.Players[userOriginId];
            game.Players[userOriginId] = {
                ...originPlayer, PrevTotal: originPlayer.Total, Total: originPlayer.Total - value,
                Transactions: originPlayer.Transactions.concat([{ Dt: new Date(), Act: "Transferiu para " + destiny, Val: value }]),
                LastChange: new Date()
            };
        }

        if (userDestinyId == 0) {
            game.PrevTotalBank = game.TotalBank;
            game.TotalBank += value;
        } else {
            var destinyPlayer = game.Players[userDestinyId];
            game.Players[userDestinyId] = {
                ...destinyPlayer, PrevTotal: destinyPlayer.Total, Total: destinyPlayer.Total + value,
                Transactions: destinyPlayer.Transactions.concat([{ Dt: new Date(), Act: "Recebeu de " + origin, Val: value }]),
                LastChange: new Date()
            };
        }
        game.Transactions = game.Transactions.concat([{ Dt: new Date(), Act: origin + " transferiu para " + destiny, Val: value }]);

        if (fn) fn();
        this.setAndSaveState({ Games: { ...this.state.Games }, SelectedPlayerId: null, TransferFromId: null, TransferToId: 0 });
    }

    render() {
        return (
            <StoreContext.Provider value={{ Data: this.state, Functions: this.Functions }}>
                {this.props.children}
            </StoreContext.Provider>
        );
    }
} export default GameStore;

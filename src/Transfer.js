import React, { Component, Fragment } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import { wrapStoreContext } from "./StoreContext";
import NumericTextBox from "./NumericTextBox";
import { default as FormatNumber } from 'format-number';

var numberFormatter = FormatNumber({ prefix: "R$ ", decimal: ",", integerSeparator: "." });
class Transfer extends Component {
    constructor(props) {
        super(props);
        this.state = { value: 0 };
    }
    handleClose() {
        this.props.Functions.SetTransfer(null);
    }
    transfer() {
        if (this.state.value == 0) {
            alert("Preencha o valor para transferir!");
            return;
        }
        this.props.Functions.Transfer(this.state.value);
    }

    render() {
        var open = this.props.Data.TransferFromId != null;
        var originPlayer = {};
        if (open) {
            var game = this.props.Data.Games[this.props.Data.SelectedGameId];
            if (this.props.Data.TransferFromId == 0)
                originPlayer = { Name: "Banco", Total: game.TotalBank };
            else
                originPlayer = game.Players[this.props.Data.TransferFromId];
        }
        return (
            <Dialog open={open} onClose={() => this.handleClose()} size="xg">
                <DialogTitle id="form-dialog-title">Transferência de dinheiro de {originPlayer.Name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>Escolha quem vai receber o dinheiro</DialogContentText>
                    <div style={{ overflow: "auto", maxHeight: "200px", marginBottom: ".5em" }}>
                        <PlayerList />
                    </div>
                    <NumericTextBox MinValue="0" MaxValue={originPlayer.Total} fullWidth decimalScale={0} prefix="R$ " label={`Valor a transferir (max: ${numberFormatter(originPlayer.Total)})`}
                        value={this.state.value} onValueChange={evt => this.setState({ value: evt.floatValue })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.handleClose()} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={() => this.transfer()} color="primary">
                        Transferir
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
} export default wrapStoreContext()(Transfer);

const PlayerList = wrapStoreContext()(class extends Component {
    constructor(props) {
        super(props);

        var game = props.Data.Games[props.Data.SelectedGameId];
        var players = Object.keys(game.Players)
            .map(x => ({ Id: x, ...game.Players[x] })).sort((a, b) => a.Name.toUpperCase() < b.Name.toUpperCase() ? -1 : (a.Name.toUpperCase() > b.Name.toUpperCase() ? 1 : 0));
        this.players = [{ Id: 0, Name: "Banco" }].concat(players).filter(x => x.Id != props.Data.TransferFromId);
    }
    render() {
        var transferTo = this.props.Data.TransferToId;
        return (
            <List dense>
                {this.players.map(player => {
                    return (
                        <ListItem key={player.Id} button selected={player.Id == transferTo} onClick={() => this.props.Functions.SetTransferTo(player.Id)}>
                            <ListItemAvatar>
                                {player.PictLink == null ? <Avatar>{player.Name.substring(0, 1)}</Avatar> : <Avatar src={player.PictLink} />}
                            </ListItemAvatar>
                            <ListItemText primary={player.Name} />
                        </ListItem>
                    );
                })}
            </List>
        );
    }
});
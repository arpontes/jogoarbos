import React, { Component, Fragment } from 'react';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

import { wrapStoreContext } from "./StoreContext";

class EditPlayer extends Component {
    constructor(props) {
        super(props);

        this.open = this.props.Data.SelectedPlayerId != null;
        if (!this.open || this.props.Data.SelectedPlayerId == 0)
            this.state = { name: "", pict: null };
        else {
            var player = this.props.Data.Games[this.props.Data.SelectedGameId].Players[this.props.Data.SelectedPlayerId];
            this.state = { name: player.Name, pict: player.Pict };
        }
    }
    handleClose() {
        this.props.Functions.SelectPlayer(null);
    }
    save() {
        if (this.props.Data.SelectedPlayerId == 0)
            this.props.Functions.CreatePlayer(this.state.name, this.state.pict, 5000);
        else
            this.props.Functions.SavePlayer(this.state.name, this.state.pict);
    }
    openFile(file) {
        if (file.files.length != 1 || file.files[0].type.indexOf("image") == -1)
            alert("Escolha uma imagem!");
        else {
            var reader = new FileReader();
            var fnState = this.setState.bind(this);
            reader.onload = function () {
                fnState({ pict: Array.from(new Uint8Array(this.result)) });
            };
            reader.readAsArrayBuffer(file.files[0]);
        }
    }
    render() {
        var title = this.props.Data.SelectedPlayerId == 0 ? "Novo jogador" : "Editar jogador";
        return (
            <Dialog open={this.open} onClose={() => this.handleClose()} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Nome" fullWidth value={this.state.name} onChange={evt => this.setState({ name: evt.target.value })} />

                    <DialogContentText style={{ marginTop: "1em", marginBottom: 0 }}>Escolha a foto do jogador</DialogContentText>
                    <Input margin="dense" label="Nome" type="file" onChange={evt => this.openFile(evt.target)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.handleClose()} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={() => this.save()} color="primary">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
} export default wrapStoreContext()(EditPlayer);
import React, { Component, Fragment } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import dateformat from 'dateformat';
import { default as FormatNumber } from 'format-number';

import { wrapStoreContext } from "./StoreContext";

var numberFormatter = FormatNumber({ prefix: "R$ ", decimal: ",", integerSeparator: "." });
class Historic extends Component {
    constructor(props) {
        super(props);
        var game = props.Data.Games[props.Data.SelectedGameId];
        this.Entity = props.Data.ShowHistoricOf == 0 ? { Name: "Banco", Transactions: game.Transactions } : game.Players[props.Data.ShowHistoricOf];
    }
    handleClose() {
        this.props.Functions.OpenHistoric(null);
    }
    render() {
        var title = "Extrato de " + this.Entity.Name;
        return (
            <Dialog open={true} onClose={() => this.handleClose()}>
                <DialogTitle id="form-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Data</TableCell>
                                <TableCell>Movimentação</TableCell>
                                <TableCell align="right">Valor</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.Entity.Transactions.map(row => (
                                <TableRow key={row.Dt}>
                                    <TableCell component="th">
                                        {dateformat(row.Dt, "dd/mm/yyyy HH:MM")}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.Act}
                                    </TableCell>
                                    <TableCell align="right">{numberFormatter(row.Val)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.handleClose()} color="primary">
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
} export default wrapStoreContext()(Historic);
import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';

import { wrapStoreContext } from "./StoreContext";
import EditPlayer from './EditPlayer';
import Transfer from './Transfer';
import Historic from './Historic';
import CountUp from './CountUp';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import FaceIcon from '@material-ui/icons/Face';
import EditIcon from '@material-ui/icons/Edit';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import dateformat from 'dateformat';

class GameDashboard extends Component {
    createNewPlayer() {
        this.props.Functions.SelectPlayer(0);
    }
    selectPlayer(id) {
        this.props.Functions.SelectPlayer(id);
    }
    deletePlayer(id) {
        if (window.confirm("Tem certeza que deseja excluir este jogador?\nO dinheiro será transferido para o banco!"))
            this.props.Functions.DeletePlayer(id);
    }
    openTransfer(id) {
        this.props.Functions.SetTransfer(id);
    }
    openHistoric(id) {
        this.props.Functions.OpenHistoric(id);
    }

    render() {
        var selectedId = this.props.Data.SelectedGameId;
        if (selectedId == null)
            return "Selecione ou crie um jogo!";

        var game = this.props.Data.Games[selectedId];
        var players = Object.keys(game.Players).map(x => ({ Id: x, ...game.Players[x] })).sort((a, b) => a.Name.toUpperCase() < b.Name.toUpperCase() ? -1 : (a.Name.toUpperCase() > b.Name.toUpperCase() ? 1 : 0));
        return (
            <Fragment>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", margin: "1em" }}>
                    <Typography>
                        <div style={{ whiteSpace: "nowrap" }}>Jogo: {dateformat(game.Start, "dd/mm/yyyy HH:MM")}</div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            Jogadores: {Object.keys(game.Players).length}
                            <Fab size="small" color="primary" onClick={() => this.createNewPlayer()} style={{ marginLeft: ".5em" }}><PersonAddIcon /></Fab>
                        </div>
                    </Typography>

                    <Typography style={{ whiteSpace: "nowrap" }}>
                        Banco: <Button size="small" onClick={() => this.openHistoric(0)}> <CountUp Start={game.PrevTotalBank} Value={game.TotalBank} /></Button>
                        <Fab size="small" color="primary" onClick={() => this.openTransfer(0)} disabled={Object.keys(game.Players).length == 0 || game.TotalBank == 0}>
                            <MonetizationOnIcon />
                        </Fab>
                    </Typography>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                    {players.map(x => <Player key={`${x.Id}-${x.LastChange}`} Player={x}
                        SelectPlayer={() => this.selectPlayer(x.Id)} DeletePlayer={() => this.deletePlayer(x.Id)}
                        OpenTransfer={() => this.openTransfer(x.Id)} OpenHistoric={() => this.openHistoric(x.Id)} />)}
                </div>
                {this.props.Data.SelectedPlayerId != null && <EditPlayer key={this.props.Data.SelectedPlayerId} />}
                {this.props.Data.TransferFromId != null && <Transfer key={this.props.Data.TransferFromId} />}
                {this.props.Data.ShowHistoricOf != null && <Historic key={this.props.Data.ShowHistoricOf} />}
            </Fragment>
        );
    }
} export default wrapStoreContext()(GameDashboard);


const useStyles = withStyles({
    card: { width: 240, margin: "2em" },
    media: { height: 140 }
});
const Player = useStyles(class extends Component {
    constructor(props) {
        super(props);
        this.player = this.props.Player;
    }
    render() {
        var classes = this.props.classes;
        return (
            <Card className={classes.card}>
                <CardActionArea style={{ textAlign: "center" }} onClick={this.props.OpenHistoric}>
                    {this.player.PictLink != null && <CardMedia className={classes.media} image={this.player.PictLink} />}
                    {this.player.PictLink == null && <FaceIcon fontSize="large" className={classes.media} color="primary" />}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {this.player.Name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            <CountUp Start={this.player.PrevTotal} Value={this.player.Total} />
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <div style={{ flexGrow: 1 }}>
                        <Fab size="small" color="secondary" onClick={this.props.DeletePlayer}>
                            <DeleteIcon />
                        </Fab>
                    </div>
                    <Fab size="small" color="primary" onClick={this.props.SelectPlayer}>
                        <EditIcon />
                    </Fab>
                    <Fab size="small" color="primary" onClick={this.props.OpenTransfer} disabled={this.player.Total == 0}>
                        <MonetizationOnIcon />
                    </Fab>
                </CardActions>
            </Card>
        );
    }
});
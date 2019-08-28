import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import StarIcon from '@material-ui/icons/Star';

import { wrapStoreContext } from "./StoreContext";
import GameDashboard from "./GameDashboard";

import dateformat from 'dateformat';

const useStyles = withStyles(theme => ({
    menuButton: {
        marginRight: theme.spacing(2)
    }
}));

class TopBar extends Component {
    constructor(props) {
        super(props);

        this.state = { drawerIsOpen: false };
    }

    toggleDrawer(open) {
        this.setState({ drawerIsOpen: open });
    }

    editGame(id) {
        this.props.Functions.SelectGame(id);
        this.toggleDrawer(false);
    }
    newGame() {
        this.props.Functions.CreateGame();
        this.toggleDrawer(false);
    }
    render() {
        var classes = this.props.classes;
        var data = this.props.Data;
        return (
            <Fragment>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => this.toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Jogo 6º C - Colégio Arbos
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer open={this.state.drawerIsOpen} onClose={() => this.toggleDrawer(false)}>
                    <List>
                        <ListItem button onClick={() => this.newGame()}>
                            <ListItemIcon><StarIcon /></ListItemIcon>
                            <ListItemText primary="Novo Jogo" />
                        </ListItem>
                        {Object.keys(data.Games).map(gameId => (
                            <ListItem button key={gameId} onClick={() => this.editGame(gameId)}>
                                <ListItemIcon><VideogameAssetIcon color="primary" /></ListItemIcon>
                                <ListItemText primary={dateformat(data.Games[gameId].Start, "dd/mm/yyyy HH:MM")} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <GameDashboard />
            </Fragment>
        );
    }
} export default wrapStoreContext()(useStyles(TopBar));
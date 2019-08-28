import React, { Component } from 'react';
import Game from './Game';
import { withStyles } from '@material-ui/core/styles';

const useStyles = withStyles({
    '@global': {
        body: { margin: 0, padding: 0 }
    }
});

class App extends Component {
    render() { return <Game />; }
}
export default useStyles(App);

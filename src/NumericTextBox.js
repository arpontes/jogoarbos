import React, { Component, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import NumberFormat from 'react-number-format';

class NumericTextBox extends Component {
    render() {
        const { MinValue, MaxValue, ...otherProps } = this.props;
        return (
            <NumberFormat variant="outlined" {...otherProps} 
                InputLabelProps={{ shrink: true }}// Esta linha foi colocada por causa de um bug no TextField (https://github.com/mui-org/material-ui/issues/13033). Quando for corrigido, esta linha deverá ser excluída.
                thousandSeparator="." decimalSeparator="," customInput={TextField}
                fixedDecimalScale={true} isAllowed={tgt => tgt.floatValue == null || (tgt.floatValue >= MinValue && tgt.floatValue <= MaxValue)}
            />
        );
    }
} export default NumericTextBox;

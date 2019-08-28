import React from 'react';

export const StoreContext = React.createContext({});
export function wrapStoreContext(ctxProps) {
    return WrappedCpt => React.forwardRef((props, ref) =>
        <StoreContext.Consumer>{ctx => {
            var sc = {};

            if (typeof (ctxProps) === "undefined")
                sc = { ...ctx };
            else {
                if (typeof (ctxProps) === "function")
                    ctxProps = ctxProps(ctx);

                for (var p in ctxProps) {
                    var dataProp = ctxProps[p].split(".");
                    var data = ctx;
                    for (var i = 0; i < dataProp.length && data != null; i++)
                        data = data[dataProp[i]];
                    sc[p] = data;
                }
            }

            return <WrappedCpt {...props} ref={ref} {...sc} />;
        }}</StoreContext.Consumer>
    );
}
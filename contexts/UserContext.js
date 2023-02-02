import createNewContext from './createNewContext';

const reducer = ( state, action ) => {
    switch( action.type ) {
        case 'set':
            return action.payload;
        case 'reset':
            return null;
        default:
            return null;
    }
}

const set = dispatch => (payload) => {
    dispatch({type: 'set', payload});
}

const reset = dispatch => () => {
    dispatch({type: 'reset'});
}

export const { Context, Provider } = createNewContext( reducer, { set, reset }, null);
import { propLess } from '../propless';
import * as t from '../../constant/initialType';

let data = {
    cancelToken: [],
    postList: false
}

const postReducer = (state = data, action) => {
    switch(action.type) {
        case t.CLEAR_POST:
            if (!action.payload && state.cancelToken && state.cancelToken[t.CLEAR_POST])
                state.cancelToken[t.CLEAR_POST].map((v, i) => v.cancel('Post got unmounted '+i));

            state = {
                ...state,
                postList: (!action.payload) ? false : state.postList,
                cancelToken: propLess(action, state, 'cancelToken')
            }
            break;
        case t.LOAD_POST:
            state = {
                ...state,
                postList: propLess(action, state, 'postList')
            }
            break;
        default:
    }

    return state;
}

export default postReducer;
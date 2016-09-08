import concatenateReducers from 'redux-concatenate-reducers'
import { handleAction, handleActions } from 'redux-actions'

import {
  prizes,
} from 'util/index'

import {
  changePage,
  fallChartButton,
  reset,
  intoLoading,
  exitLoading,
} from './actions.js'

const initialState = {
  participants: {},
  pairs: {},
  loading: true,
  results: {},
  chart_round: 1,
}

const reducer = concatenateReducers([
  handleActions({
    'sync game progress': ({}, { payload }) => ({ game_progress: payload }),
    [changePage]: (_, { payload }) => ({ game_page: payload, game_progress: 0 }),
    [intoLoading]: ({}) => ({ loading: true }),
    [exitLoading]: ({}) => ({ loading: false }),
    'update contents': (_, { payload }) => payload,
    'join': ({ participants }, { payload: { id, participant } }) => ({
      participants: Object.assign({}, participants, {
        [id]: participant
      })
    }),
    'reseted': (_, { payload: { participants }}) => ({participants: participants}),
    [reset]: ({}) => ({
      game_page: "waiting", chart_round: 1,
      pairs: {},
      results: {},
    }),

    'give': ({ pairs, participants }, { payload: {id, target_id, pair_id }}) => ({
      pairs: Object.assign({}, pairs, {
        [pair_id]: Object.assign({}, pairs[pair_id], {
          pair_state: pairs[pair_id].pair_turn < 10? "during" : "finished",
          pair_turn: pairs[pair_id].pair_turn < 10? pairs[pair_id].pair_turn+1 : pairs[pair_id].pair_turn,
        })
      }),
      participants: Object.assign({}, participants, {
        [id]: Object.assign({}, participants[id], {
          point: pairs[pair_id].pair_turn < 10?
            prizes[participants[id].role][pairs[pair_id].pair_turn]
          : prizes[participants[id].role][10]
        }),
        [target_id]: Object.assign({}, participants[target_id], {
          point: pairs[pair_id].pair_turn < 10?
            prizes[participants[target_id].role][pairs[pair_id].pair_turn]
            : prizes[participants[target_id].role][10]
        }),
      })
    }),
    'take': ({ pairs, participants }, { payload: {id, target_id, pair_id} }) => ({
      pairs: Object.assign({}, pairs, {
        [pair_id]: Object.assign({}, pairs[pair_id], {
          pair_state: "finished",
        })
      }),
      participants: Object.assign({}, participants, {
        [id]: Object.assign({}, participants[id], {
          point: prizes[participants[id].role][pairs[pair_id].pair_turn]
        }),
        [target_id]: Object.assign({}, participants[target_id], {
          point: prizes[participants[target_id].role][pairs[pair_id].pair_turn]
        }),
      }),
    }),

    'matched': (_, { payload: { participants, pairs } }) => ({
      participants, pairs
    }),
    [fallChartButton]: () => ({ chart_button: false}),
  }, initialState),
])

export default reducer

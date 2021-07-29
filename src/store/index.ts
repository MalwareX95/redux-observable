declare global {
    interface Window {
      process?: Object;
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
  }

import { compose, StoreEnhancer } from 'redux';
import counter from './counter'
import createSagaMiddleware from 'redux-saga';
// import rootSaga from './sagas/app'
import { configureStore } from '@reduxjs/toolkit';
import rootSaga from './sagas/app';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { pingEpic, searchEpic } from './epics';
import { ajax } from 'rxjs/ajax';

const devCompose: <Ext0, Ext1, StateExt0, StateExt1>(
    f1: StoreEnhancer<Ext0, StateExt0>, f2: StoreEnhancer<Ext1, StateExt1>
  ) => StoreEnhancer<Ext0 & Ext1, StateExt0 & StateExt1> =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware()
const epicMiddleware = createEpicMiddleware({
  dependencies: {
    ajax    
  }
});

const middlewares = [sagaMiddleware, epicMiddleware]

export const store = configureStore({
  reducer: {
    counter
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middlewares),
})

sagaMiddleware.run(rootSaga)
epicMiddleware.run(combineEpics(pingEpic, searchEpic))

// export const store = createStore(
//     state => state as Reducer<any, any>,
//     devCompose(
//         lazyReducerEnhancer(combineReducers),
//         applyMiddleware(sagaMiddleware)))


// store.addReducers({
//   counter
// })





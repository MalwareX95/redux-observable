import * as effects from 'redux-saga/effects'
import { CallEffect } from 'redux-saga/effects'
import { all, call, fork } from 'redux-saga/effects';
import {counterActions} from '../counter'

const apiCall = async (id: number) => {
    return new Promise(res => {
        setTimeout(() => res(undefined), 1000)
    })
    .then(() => fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)) 
    .then(response => response.json());
}

function* fetchToDosSaga() {
    const results = yield all([1, 2]
                            .map(id => effects.call(apiCall, id)))
    return results
}

function* rootSaga() {
    yield effects.takeLeading(counterActions.fetchToDos, fetchToDosSaga)
}

export default rootSaga;
import { Epic, ofType } from 'redux-observable'
import { delay, filter, mapTo, tap, debounceTime, exhaust, exhaustMap, startWith, map, distinctUntilChanged, switchMap, switchMapTo, } from 'rxjs/operators'
import counter, { counterActions } from '../counter'
import { PayloadAction, ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { combineLatest, forkJoin, from, of } from 'rxjs'
import { AjaxCreationMethod } from 'rxjs/internal/observable/dom/AjaxObservable'

type Actions = typeof counterActions

type PingAction = PayloadAction<string|undefined>

type Search = typeof counterActions.search

export const searchEpic: Epic = 
      (action$, state$, { ajax }: {ajax: AjaxCreationMethod}) => 
            action$
                  .pipe(ofType<PayloadAction<string>>(counterActions.search.type),
                        debounceTime(500),
                        map(x => x.payload),
                        distinctUntilChanged(),
                        switchMap(term => {
                            return ajax.getJSON(`http://localhost:30613/api/Product?term=${term}`)
                                       .pipe(tap(console.log),
                                             mapTo(counterActions.noop));
                        }));



export const pingEpic: Epic = 
    action$ => action$
                 .pipe(ofType<PingAction>(counterActions.ping.type),
                       exhaustMap(_ => { 
                            const array = [1, 2]
                                            .map(id => fetch('https://jsonplaceholder.typicode.com/todos/' + id).then(_ => _.json()))
                                            .map(promise => from(promise)
                                                                .pipe(delay(1000), 
                                                                      startWith(null)));
                            return combineLatest(array)
                                        .pipe(map(x => x.filter(_ => _ != null)),
                                              tap(console.log),
                                              map(x => counterActions.pong(x)));
                       }));


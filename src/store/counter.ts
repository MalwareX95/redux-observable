import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  counter: number,
  showCounter: boolean,
  todos: any,
  readonly clicked: Promise<any>,
}

const waitOneSymbol = Symbol('waitOneSymbol')
const signalSymbol = Symbol('signalSymbol')

interface Subscription {
   signal;
}

type Signal = (value: unknown) => void

function* channelGenerator(): Generator<any, any, any> {
   const subscriptions: Signal[] = [];
   let symbol = null;

   while(true) {
     if(symbol == waitOneSymbol) {
        symbol = yield new Promise(res => { subscriptions.push(res) })
     }
     else if(symbol == signalSymbol) {
        subscriptions.forEach(signal => signal(undefined))
        symbol = yield;
     }
     else symbol = yield;
   }
}

const channel = channelGenerator();

const initialCounterState: CounterState = 
{ 
  counter: 0,
  showCounter: true,
  todos: [],
  get clicked() { return channel.next(waitOneSymbol).value as Promise<any>},
};

const counterSlice = createSlice({
    name: 'counter',
    initialState: initialCounterState,
    reducers: {
      increment(state) {
        state.counter++;
      },
      search(state, action: PayloadAction<string>) {},
      noop(){},
      decrement(state) {
        state.counter--;
      },
      increase(state, action) {
        state.counter = state.counter + action.payload;
      },
      toggleCounter(state) {
        state.showCounter = !state.showCounter;
      },
      clicked() { 
        console.log('before produce');
        channel.next(signalSymbol);
        console.log('after produce');
      },
      fetchToDos(){},
      ping(state, action: PayloadAction<number | undefined>) {},
      pong(state, action) {
        // console.log(action);
        // console.error('pong');
      },
      fetchToDosSuccess(state, action){
        state.todos = action;
      }
    },
    // extraReducers: {
    //   [fetchToDos.fulfilled as any]: (state, action) => {
    //     state.todos = action
    //   }
    // }
  });
  
export const counterActions = counterSlice.actions;

export default counterSlice.reducer;
import { html, css, LitElement, property, state, query } from 'lit-element';
import { connect } from 'pwa-helpers'
import { BehaviorSubject, fromEvent, of, Observable, Subscription } from 'rxjs';
import { concatMap, debounce, debounceTime, map, take, tap } from 'rxjs/operators';
import { store } from './store';
import { counterActions } from './store/counter'


const idleSymbol = Symbol('idleSymbol')
const signalSymbol = Symbol('signalSymbol')


export class MapsTest extends connect(store)(LitElement) {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--maps-test-text-color, #000);
    }
  `;
  stateChanged(state: any) {}

  @property({ type: String }) 
  title = 'Hey there';
  
  @property({ type: Number }) 
  counter = 5;
  
  _increment() {  
    store.dispatch(counterActions.fetchToDos());
  }

  _fetchToDos() {
    const result = store.dispatch(counterActions.fetchToDos());
    console.log(result);
  }
  
  async _click1() {
     const state = store.getState()
     console.log('waiting');
     await state.counter.clicked;
     console.log('after waiting');
  }

  _click2() {
    store.dispatch(counterActions.clicked());
    console.log('after dispatch clicked');
  }

  searchHandler(e: InputEvent) { 
    const term = (e.target as HTMLInputElement).value;
    store.dispatch(counterActions.search(term));
  }

  render() {
    return html`
      <!-- <h2>${this.title} Nr. ${this.counter}!</h2>
      <button @click=${this._increment}>increment</button>
      <button @click=${this._fetchToDos}>fetch</button>
      <button @click=${() => store.dispatch(counterActions.ping())}>ping</button>
      <input id="foo" type="text" /> -->
      <input type="text" @input=${this.searchHandler}>
      <button @click=${this._click1}>button1</button>
      <button @click=${this._click2}>button2</button>
    `;
  }
}

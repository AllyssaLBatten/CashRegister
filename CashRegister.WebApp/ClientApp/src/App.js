import React, { Component } from 'react';
import { Route } from 'react-router';
import { CashRegister } from './components/CashRegister';

export default class App extends Component {
  displayName = App.name

  render() {
    return (
        <Route exact path='/' component={CashRegister} />
    );
  }
}

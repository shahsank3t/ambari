import React, {Component} from 'react';
import BaseContainer from './BaseContainer';

export default class Dashboard extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BaseContainer>
        <h1>Dashboard</h1>
      </BaseContainer>
    );
  }
}

import React, {Component} from 'react';
import Footer from '../components/Footer';
import {Confirm} from '../components/FSModel';

export default class BaseContainer extends Component {

  constructor(props) {
    super(props);
  }

  handleKeyPress = (event) => {
    event.key === "Enter"
      ? this.refs.Confirm.state.show
        ? this.refs.Confirm.sure()
        : ''
    :event.key === "Escape"
      ? this.refs.Confirm.state.show
        ? this.refs.Confirm.cancel()
        : ''
    :'';
  }

  render() {
    return (
      <div className="container-fluid">
        {this.props.children}
        <Confirm ref="Confirm" onKeyUp={this.handleKeyPress}/>
        <Footer />
      </div>
    );
  }
}

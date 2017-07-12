import React, {Component} from 'react';
import Footer from '../components/Footer';

export default class BaseContainer extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid">
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

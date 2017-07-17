import React, {Component} from 'react';
import TopologyREST from '../rest/TopologyREST';
import {toastOpt,pageSize} from '../utils/Constants';
import Utils from '../utils/Utils';
import FSReactToastr from './FSReactToastr';
import CommonNotification from './CommonNotification';

export default class RebalanceTopology extends Component{
  constructor(props){
    super(props);
    this.state = {
      freeSlot : 0,
      waitTime : 30
    };
    this.fetchData();
  }

  fetchData = () => {
    TopologyREST.getSummary('cluster').then(() => {

    });
  }

  rangeBandChange = (e) => {
    console.log(e.target.value);
  }

  render(){
    return(
      <div>
        <div className="form-group">
          <div className="col-sm-3">
            <label>Workers:<span className="text-danger">*</span></label>
          </div>
          <div className="col-sm-7">
            <input type="range" min={0} max={100} onChange={this.rangeBandChange.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
}

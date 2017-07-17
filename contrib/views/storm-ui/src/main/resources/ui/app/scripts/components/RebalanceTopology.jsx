import React, {Component} from 'react';
import TopologyREST from '../rest/TopologyREST';
import {toastOpt,pageSize} from '../utils/Constants';
import Utils from '../utils/Utils';
import FSReactToastr from './FSReactToastr';
import CommonNotification from './CommonNotification';
import _  from 'lodash';

export default class RebalanceTopology extends Component{
  constructor(props){
    super(props);
    this.state = {
      freeSlot : 0,
      waitTime : 30,
      rebalanceData : {}
    };
    this.fetchData();
  }

  fetchData = () => {
    const {topologyExecutors,spoutArr,boltArr} = this.props;
    TopologyREST.getSummary('cluster').then((result) => {
      if(result.responseMessage !== undefined){
        FSReactToastr.error(
          <CommonNotification flag="error" content={result.responseMessage}/>, '', toastOpt);
      } else {
        let stateObj = {};
        stateObj.freeSlot = result.slotsFree;
        stateObj.rebalanceData={};
        stateObj.rebalanceData.workers = topologyExecutors + stateObj.freeSlot;
        _.map(spoutArr, (s) => {
          stateObj.rebalanceData[s.spoutId] = s.executors;
        });
        _.map(boltArr, (b) => {
          stateObj.rebalanceData[b.boltId] = b.executors;
        });
        this.setState(stateObj);
      }
    });
  }

  rebalanceValueChange = (type,e) => {
    let data = _.cloneDeep(this.state.rebalanceData);
    data[type] = +e.target.value;
    this.setState({rebalanceData : data});
  }

  waitTimeChange = (e) => {
    this.setState({waitTime : +e.target.value});
  }

  validateData = () => {
    const {rebalanceData,waitTime} = this.state;
    let errorFlag = [];
    _.map(_.keys(rebalanceData), (key) => {
      if(rebalanceData[key] === ''){
        errorFlag.push(false);
      }
    });
    if(waitTime === ''){
      errorFlag.push(false);
    }
    return errorFlag.length ? false : true;
  }

  handleSave = () => {
    const {rebalanceData,waitTime} = this.state;
    const {topologyId} = this.props;
    let finalData = {
  			"rebalanceOptions": {
  				"executors": {}
  			}
    };
    _.map(_.keys(rebalanceData), (key) => {
      if(key === "workers"){
        finalData.rebalanceOptions.numWorkers = rebalanceData[key];
      } else {
        finalData.rebalanceOptions.executors[key] = rebalanceData[key];
      }
    });

    return TopologyREST.postActionOnTopology(topologyId,'rebalance',waitTime,{body : JSON.stringify(finalData)});
  }

  render(){
    const {freeSlot,waitTime,rebalanceData} = this.state;
    const {spoutArr,boltArr}= this.props;
    return(
      <div>
        <div className="form-group row">
          <div className="col-sm-3">
            <label>Workers:<span className="text-danger">*</span></label>
          </div>
          <div className="col-sm-7">
            <span style={{float : 'left'}}>0</span><input type="range" min={0} style={{width : '90%', float : 'left',margin : '0 7px' }} max={rebalanceData.workers} onChange={this.rebalanceValueChange.bind(this,'workers')} /><span style={{float : 'left', clear : 'right'}}>{rebalanceData.workers}</span>
          </div>
        </div>
        {
          _.map(spoutArr, (s , i) => {
            return  <div className="form-group row" key={i}>
                      <div className="col-sm-3">
                        <label>{s.spoutId}:<span className="text-danger">*</span></label>
                      </div>
                      <div className="col-sm-7">
                        <input type="number" className="form-control" min={0} defaultValue={s.executors} onChange={this.rebalanceValueChange.bind(this,s.spoutId)} />
                      </div>
                    </div>;
          })
        }
        {
          _.map(boltArr, (b , n) => {
            return  <div className="form-group row" key={n}>
                      <div className="col-sm-3">
                        <label>{b.boltId}:<span className="text-danger">*</span></label>
                      </div>
                      <div className="col-sm-7">
                        <input type="number" className="form-control" min={0} defaultValue={b.executors} onChange={this.rebalanceValueChange.bind(this,b.boltId)} />
                      </div>
                    </div>;
          })
        }
        <div className="form-group row">
          <div className="col-sm-3">
            <label>Wait Time:<span className="text-danger">*</span></label>
          </div>
          <div className="col-sm-7">
            <input type="number" className="form-control" min={0} value={waitTime} onChange={this.waitTimeChange.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
}

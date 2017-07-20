import React, {Component} from 'react';
import Select from 'react-select';
import CommonSwitchComponent from './CommonSwitchComponent';

export default class CommonWindowPanel extends Component{
  constructor(props){
    super(props);
  }

  windowChange = (obj) => {
    this.props.handleWindowChange(obj);
  }

  commonToggleChange = (params) => {
    this.props.toggleSystem(params);
  }

  commonTopologyActionHandler = (action) => {
    this.props.handleTopologyAction(action);
  }

  render(){
    const {selectedWindowKey,windowOptions,systemFlag,debugFlag,handleLogLevel,topologyStatus,KYC,handleProfiling} = this.props;
    return(
      <div className="form-group no-margin">
        <label className="col-sm-1 control-label">Window</label>
        <div className="col-sm-2">
          <Select value={selectedWindowKey} options={windowOptions} onChange={this.windowChange.bind(this)} valueKey="label" labelKey="label" clearable={false}/>
        </div>
        <label className="col-sm-2 control-label">System Summary</label>
        <div className="col-sm-2">
          <CommonSwitchComponent checked={systemFlag} switchCallBack={this.commonToggleChange.bind(this,'systemFlag')}/>
        </div>
        <label className="col-sm-1 control-label">Debug</label>
        <div className="col-sm-1">
          <CommonSwitchComponent checked={debugFlag} switchCallBack={this.commonToggleChange.bind(this,'debugFlag')}/>
        </div>
        <div className="col-sm-3 text-right">
          <div className="btn-group" role="group">
            {
              KYC === 'detailView'
              ? [<button key={1} type="button" className="btn btn-primary" onClick={this.commonTopologyActionHandler.bind(this,'activate')} title="Activate" data-rel="tooltip" disabled={topologyStatus === 'ACTIVE' ? "disabled" : null}>
                <i className="fa fa-play"></i>
                </button>,
                <button key={2} type="button" className="btn btn-primary" onClick={this.commonTopologyActionHandler.bind(this,'deactivate')} title="Deactivate" data-rel="tooltip" disabled={topologyStatus === 'INACTIVE' ? "disabled" : null}>
                  <i className="fa fa-stop"></i>
                </button>,
                <button key={3} type="button" className="btn btn-primary" onClick={this.commonTopologyActionHandler.bind(this,'rebalance')} title="Rebalance" data-rel="tooltip" disabled={topologyStatus === 'REBALANCING' ? "disabled" : null}>
                  <i className="fa fa-balance-scale"></i>
                </button>,
                <button key={4} type="button" className="btn btn-primary" onClick={this.commonTopologyActionHandler.bind(this,'kill')} title="Kill" data-rel="tooltip" disabled={topologyStatus === 'KILLED' ? "disabled" : null}>
                  <i className="fa fa-ban"></i>
                </button>,
                <button key={5} type="button" className="btn btn-primary" onClick={handleLogLevel} title="Change Log Level" data-rel="tooltip">
                  <i className="fa fa-file-o"></i>
                </button>]
              : <button type="button" className="btn btn-primary" onClick={handleProfiling} title="Profiling & Debugging" data-rel="tooltip">
									<i className="fa fa-cogs"></i>
								</button>
            }
          </div>
        </div>
      </div>
    );
  }
}

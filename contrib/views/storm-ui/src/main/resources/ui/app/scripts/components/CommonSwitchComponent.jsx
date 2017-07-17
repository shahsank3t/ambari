import React, {Component} from 'react';

export default class CommonSwitchComponent extends Component {
  render(){
    const {switchCallBack,checked} = this.props;
    let switchId = "switch-"+((Math.random())*100).toFixed(0);
    return (
      <div className="switchWrapper">
        <span className={`switchSlider ${checked ?  'onSlider' : 'offSlider'}`} onClick={switchCallBack}>
          <span className="switchItemOn sliderText">ON</span>
          <span className="switchItemMid"></span>
          <span className="switchItemOff sliderText">OFF</span>
        </span>
      </div>

    );
  }
}

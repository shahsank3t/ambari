import React, {Component} from 'react';

export default class CommonSwitchComponent extends Component {
  render(){
    const {switchCallBack,checked,textON,textOFF,KYC} = this.props;
    let switchId = "switch-"+((Math.random())*100).toFixed(0);
    return (
      <div className={`switchWrapper ${!!KYC ? 'lagSwitchSetting pull-right' : ''}`}>
        <span className={`switchSlider ${checked ?  'onSlider' : 'offSlider'}`} onClick={switchCallBack}>
          <span className="switchItemOn sliderText">{textON}</span>
          <span className="switchItemMid"></span>
          <span className="switchItemOff sliderText">{textOFF}</span>
        </span>
      </div>

    );
  }
}

CommonSwitchComponent.defaultProps = {
  textON : "ON",
  textOFF : "OFF"
};

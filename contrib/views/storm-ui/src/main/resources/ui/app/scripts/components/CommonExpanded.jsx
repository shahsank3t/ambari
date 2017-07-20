import React, {Component} from 'react';

const CommonExpanded = (props) => {
  const {expandFlag} = props;
  return (
    <div className="box-control pull-right" style={{marginLeft : '17px',marginTop : '-2px'}}>
      <span className="primary"><i className={`fa ${expandFlag ? 'fa-expand' : 'fa-compress'}`}></i></span>
    </div>
  );
};

export default CommonExpanded;

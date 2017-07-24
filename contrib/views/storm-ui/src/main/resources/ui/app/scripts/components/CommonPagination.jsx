import React, {Component} from 'react';
import _ from 'lodash';
import {Pagination} from 'react-bootstrap';

export default class CommonPagination extends Component{
  constructor(props){
    super(props);
  }

  handleSelect = (eventKey) => {
    this.props.callBackFunction(eventKey,this.props.tableName);
  }

  render(){
    const {activePage,pageSize,filteredEntities} = this.props;
    const totalPages = Math.ceil(filteredEntities.length / pageSize);

    return(
      <div className="pagination-wrapper">
        <div className="pull-left">
          <span>{`Showing ${activePage > 1 ? (activePage-1)*pageSize : activePage }  to ${activePage*pageSize > filteredEntities.length ? filteredEntities.length : (activePage*pageSize)} of ${filteredEntities.length} entries`}</span>
        </div>
        <Pagination
         className={`${filteredEntities.length === 0? 'hidden':'shown pull-right'}`}
         prev
         next
         first
         last
         ellipsis
         items={totalPages}
         maxButtons={5}
         activePage={activePage}
         onSelect={this.handleSelect}>
      </Pagination>
      </div>
    );
  }
}

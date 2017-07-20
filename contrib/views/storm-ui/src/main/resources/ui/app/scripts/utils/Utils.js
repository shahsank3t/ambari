import React from 'react';
import _ from 'lodash';

const filterByKey = function(entities, filterValue,entity) {
  let matchFilter = new RegExp(filterValue, 'i');
  return entities.filter(filteredList => !filterValue || _.isEmpty(entity) ? matchFilter.test(filteredList) : matchFilter.test(filteredList[entity]));
};

const hideFSModal = function(modal,callback){
  this.refs[modal].hide();
  if(!!callback){
    return  new Promise((resolve,reject) => {
      return resolve(callback);
    });
  }
};

const populateWindowsOptions = function(optionsArr){
  let options=[];
  _.map(optionsArr, (opt) => {
    options.push({
      label : opt.windowPretty,
      value : opt.window
    });
  });
  return options;
};

export default{
  filterByKey,
  hideFSModal,
  populateWindowsOptions
};

import React from 'react';
import _ from 'lodash';

const filterByKey = function(entities, filterValue,entity) {
  let matchFilter = new RegExp(filterValue, 'i');
  return entities.filter(filteredList => !filterValue || matchFilter.test(filteredList[entity].name));
};

export default{
  filterByKey
};

import React from 'react';
import _ from 'lodash';

const filterByKey = function(entities, filterValue,entity) {
  let matchFilter = new RegExp(filterValue, 'i');
  return entities.filter(filteredList => !filterValue || _.isEmpty(entity) ? matchFilter.test(filteredList) : matchFilter.test(filteredList[entity]));
};

export default{
  filterByKey
};

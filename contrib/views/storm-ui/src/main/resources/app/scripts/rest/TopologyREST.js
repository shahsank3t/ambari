import fetch from 'isomorphic-fetch';
import {baseUrl} from '../utils/Constants';

const topology = 'topology';
const cluster = 'cluster';

const TopologyREST = {
  getSummary(entity,options) {
    options = options || {};
    options.method = options.method || 'GET';
    return fetch(baseUrl+entity+'/summary', options)
      .then((response) => {
        return response.json();
      });
  },
  getClusterConfig(options) {
    options = options || {};
    options.method = options.method || 'GET';
    return fetch(baseUrl+'cluster/configuration', options)
      .then((response) => {
        return response.json();
      });
  },
  getTopologyGraphData(id,options) {
    options = options || {};
    options.method = options.method || 'GET';
    return fetch(baseUrl+'topology/'+id+'/visualization', options)
      .then((response) => {
        return response.json();
      });
  },
  getTopologyDetails(id, options){
    options = options || {};
    options.method = options.method || 'GET';
    return fetch(baseUrl+'topology/'+id, options)
      .then((response) => {
        return response.json();
      });
  }
};

export default TopologyREST;

// import fetch from 'isomorphic-fetch';
import {baseUrl} from '../utils/Constants';

const topology = 'topology';
const cluster = 'cluster';

const TopologyREST = {
  getSummary(entity,options) {
    options = options || {};
    options.method = options.method || 'GET';
    return this.requestCall(baseUrl+entity+'/summary', options);
  },
  getClusterConfig(options) {
    options = options || {};
    options.method = options.method || 'GET';
    return this.requestCall(baseUrl+'cluster/configuration', options);
  },
  getTopologyGraphData(id,windowSize,options) {
    options = options || {};
    options.method = options.method || 'GET';
    return this.requestCall(baseUrl+'topology/'+id+'/visualization?window='+windowSize, options);
  },
  getTopologyDetails(id,windowSize,systemFlag, options){
    options = options || {};
    options.method = options.method || 'GET';
    let url = baseUrl+'topology/'+id+'?window='+windowSize;
    if(systemFlag !== '' && systemFlag !== undefined){
      url += '&sys='+systemFlag;
    }
    return this.requestCall(url, options);
  },
  getTopologyComponentDetail(TopId, CompName, options){
    options = options || {};
    options.method = options.method || 'GET';
    return this.requestCall(baseUrl+'topology/'+TopId+'/component/'+CompName, options);
  },
  postDebugTopology(id,type,percent,options){
    options = options || {};
    options.method = options.method || 'POST';
    options.headers = options.headers || {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    return this.requestCall(baseUrl+'topology/'+id+'/debug/'+type+'/'+percent,options);
  },
  postActionOnTopology(id,type,waitTime,options){
    options = options || {};
    options.method = options.method || 'POST';
    options.headers = options.headers || {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    let url = baseUrl+'topology/'+id+'/'+type;
    if(!!waitTime){
      url += '/'+waitTime;
    }
    return this.requestCall(url,options);
  },
  requestCall(url, options){
    // let urlPart = url.split('url=')[0];
    // let stormUrlPart = url.split('url=')[1];
    // urlPart += 'url=' + encodeURIComponent(stormUrlPart);
    // url = urlPart;
    options.credentials = 'same-origin';
    return fetch(url, options)
      .then((response) => {
        return response.json();
      });
  }
};

export default TopologyREST;

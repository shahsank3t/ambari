import TopologyREST from '../rest/TopologyREST';
const baseUrl = '/api/v1/';
// const baseUrl = location.pathname+'proxy?url=/api/v1/';
const toastOpt = {
  timeOut: 0,
  closeButton: true,
  tapToDismiss: false,
  extendedTimeOut: 0,
  preventDuplicates:true
};

const pageSize = 25;

let stormVersion = '';
function getStormVersion(){
  return TopologyREST.getSummary('cluster').then((res) => {
    stormVersion = res.stormVersion;
  });
}

export {
  baseUrl,
  toastOpt,
  pageSize,
  getStormVersion,
  stormVersion
};

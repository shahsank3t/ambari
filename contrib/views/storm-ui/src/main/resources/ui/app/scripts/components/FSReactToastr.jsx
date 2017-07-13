import React, {Component}from 'react';
import { render } from 'react-dom';
import ReactToastr, {ToastMessage, ToastContainer} from "react-toastr";
import CustomToastContainer from './CustomToastContainer';
var {animation}  = ToastMessage;

var ToastMessageFactory = React.createFactory(animation);

var container = document.createElement('div');
var body = document.getElementsByTagName('body').item(0);
body.appendChild(container);

const FSReactToastr = render(
    <CustomToastContainer
		  toastMessageFactory={ToastMessageFactory}
		  className="toast-top-right" />, container
);

export default FSReactToastr;

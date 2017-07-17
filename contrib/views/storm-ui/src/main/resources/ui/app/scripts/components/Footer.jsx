import React, {Component} from 'react';
import {stormVersion} from '../utils/Constants';

const Footer = () =>{
  return(
    <p className="text-center">Apache Storm - {stormVersion}</p>
  );
};

export default Footer;

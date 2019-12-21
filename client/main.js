import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

log = console.log

Meteor.startup(function(){
  Meteor.call('getSetting',null,(err,data)=>{
    log(err,data)
    if(data){
      App.setSetting(data)
    }
    
  })
})

Template.remoteFiles.helpers({
  files(){
    return App.getSetting('files')
  }
})


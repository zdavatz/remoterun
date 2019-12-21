import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

log = console.log


/**
 * 
 */

Meteor.startup(function(){
  Meteor.call('getSetting',null,(err,data)=>{
    log(err,data)
    if(data){
      App.setSetting(data)
    } 
  })

  /**
   * 
   */


})
/**
 * 
 */
Template.remoteFiles.onCreated(function(){
  var logs = []
  logs.push({title:'',msg:'The script x run successfully'})
  App.setSetting({logs:logs})
})

/**
 * 
 */
Template.remoteFiles.helpers({
  files(){
    return App.getSetting('files')
  }
})

Template.remoteFiles.events({
  'click .runCommand':(e)=>{
    e.preventDefault();
    var command = $(e.currentTarget).attr('data-val')

    log('command',command)

    Meteor.call('runCommand' , command , (err, result)=>{
      if(result){
        log('result',result)
      }
    })
  }
})
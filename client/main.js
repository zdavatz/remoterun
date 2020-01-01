import { Template } from 'meteor/templating';


import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';
import _ from 'lodash'
const stripAnsi = require('strip-ansi');

//
/**
 * 
 */
Events = new Mongo.Collection('events');
Logs = new Mongo.Collection('logs');
/**
 * 
 */
log = console.log
/**
 * 
 */
Meteor.startup(function(){


})
/**
 * 
 */
Template.remoteFiles.onCreated(function(){
  var logs = []
  logs.push({title:'',msg:'The script x run successfully'})
  App.setSetting({logs:[]})
})
/**
 * 
 */
Template.remoteFiles.helpers({
  files(){
    return App.getSetting('files')
  },

})
Template.remoteFiles.events({

  'click .runCommand':(e)=>{
    e.preventDefault();
    var command = $(e.currentTarget).attr('data-val')
    log('command',command)
    Meteor.call('runCommand' , command , (err, result)=>{
      if(result){
        log('result',result)
        App.pushSetting({logs:result})
      }
    })
  }
})

/**
 * 
 */

 Template.login.events({
  'keyup .check':(e)=>{

    if(e.which === 13){
      var key = $(e.currentTarget).val()
     
      Meteor.call('checkPasskey',key,(err,data)=>{
        // log(data)
        if(!err){
          App.setSetting(data)
        }else{
          log(err)
          alert(err.reason)
          App.setSetting({error:err})
        }
      })
    }

  },
 })

/**
 * 
 */

 Template.logs.onRendered(function(){
  // var term = new Terminal();
  // term.open(document.getElementById('terminal'));

  // term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
 })
 /**
  * 
  */
Template.logs.helpers({
  // group
  logs(){
    var logs =  Logs.find({},{sort: {createdAt: -1},limit:50}).fetch()

    // var logs = _.groupBy(logs, function(b) { return b.group})
    // log(logs)
    return logs
  },
  logX(){
     var logX = Logs.findOne()
     log(logX)
    //  var logX = JSON.parse(logX)
    // term.write(logX.log)
    if(logX){
      return logX.log
    }
  },
  getLog(data){
    if(!data){
      return
    }
    //var data = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, " ")
    var data = data.replace(/otify;/g, "")
    var data = data.replace(/777;preexec/g, "")
    return stripAnsi(data)
  }
})



Template.registerHelper('lineSplit',(str)=>{
  if(!str || !_.isString(str)){
    return
  }
  return str.split(/\r?\n/)
})


/** */

Template.registerHelper('toString',(json)=>{
  log(json)
  if(!json|| !_.isSObject(json)){
    return
  }
  return JSON.stringify(json)
})
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

const stripAnsi = require('strip-ansi');


/**
 * 
 */
Logs = new Mongo.Collection('logs')
/**
 * 
 */
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
        log(data)
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

  logs(){
    return Logs.find({},{sort: {createdAt: -1},limit:100})
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
import {
  Template
} from 'meteor/templating';
import {
  ReactiveVar
} from 'meteor/reactive-var';
import './main.html';
import _ from 'lodash'
const stripAnsi = require('strip-ansi');
/**
 * Local Collection
 */
Locale = new Mongo.Collection(null);
var Localebserver = new LocalPersist(Locale, 'Locale-S', { // options are optional!
  maxDocuments: 1, // maximum number of line items in cart
  storageFull: function (col, doc) { // function to handle maximum being exceeded
    // col.remove({ _id: doc._id });
    log(doc, col)
    log('S. is full');
  }
});
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
Meteor.startup(function () {
  Tracker.autorun(function () {
    // Keep logging
    var k = Locale.findOne({
      isLogged: true
    })
    if (k) {
      // 
      log('Is Logged: Tracker', k)
      //
      Meteor.call('getSetting', "", (err, data) => {
        // log(data)
        if (!err) {
          App.setSetting(data)
          LocalStore.set({
            isLogged: true
          })
        } else {
          log(err)
          alert(err.reason)
          App.setSetting({
            error: err
          })
        }
      })
    }
  })
})
/**
 * 
 */
Template.login.events({
  /**Key check */
  'keyup .check': (e) => {
    if (e.which === 13) {
      var key = $(e.currentTarget).val()
      Meteor.call('checkPasskey', key, (err, data) => {
        // log(data)
        if (!err) {
          App.setSetting(data)
          // Session.set({isLogged:true})
          Locale.insert({
            isLogged: true
          })
        } else {
          log(err)
          alert(err.reason)
          App.setSetting({
            error: err
          })
        }
      })
    }
  },
})
/**
 * 
 */
Template.remoteFiles.helpers({
  files() {
    return App.getSetting('files')
  },
})
Template.remoteFiles.events({
  'click .runCommand': (e) => {
    e.preventDefault();
    var command = $(e.currentTarget).attr('data-val')
    log('command', command)
    Meteor.call('runCommand', command, (err, result) => {
      if (result) {
        log('result', result)
        App.pushSetting({
          logs: result
        })
      }
    })
  },
  'click .exit': (e) => {
    e.preventDefault()
    log('remove')
    Locale.remove({})
    App.setSetting({
      files: null
    })
  }
})
/**
 * 
 */
Template.logs.onRendered(function () {
  // var term = new Terminal();
  // term.open(document.getElementById('terminal'));
  // term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
})
/**
 * 
 */
Template.logs.helpers({
  // group
  eventsList() {
    return Events.find({}, {
      sort: {
        createdAt: -1
      }
    })
  },
  logs() {
    var logs = Logs.find({}, {
      sort: {
        createdAt: -1
      }
    }).fetch()
    // var logs = _.groupBy(logs, function(b) { return b.group})
    // log(logs)
    return logs
  },
  logX() {
    var logX = Logs.findOne()
    log(logX)
    //  var logX = JSON.parse(logX)
    // term.write(logX.log)
    if (logX) {
      return logX.log
    }
  }
})
/** */
Template.registerHelper('getLog', (data) => {
  if (!data) {
    return
  }
  //var data = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, " ")
  var data = data.replace(/otify;/g, "")
  var data = data.replace(/777;preexec/g, "")
  return stripAnsi(data)
})
/** Clean Log */
/** Render log */
Template.registerHelper('mkLine', (str) => {
  if (!str) {
    return
  }
  var str = str.trim()
  var str = str.replace(/otify;/g, "")
  var str = str.replace(/777;preexec/g, "")
  var str = stripAnsi(str)
  return str.split(/\r?\n/)
})
/** Convert Object to string */
Template.registerHelper('toString', (json) => {
  log(json)
  if (!json || !_.isSObject(json)) {
    return
  }
  return JSON.stringify(json)
})
/**
 * 
 */
Template.registerHelper("isLoggedSession", function () {
  if (App.getSetting('files') && Locale.findOne({
      isLogged: true
    })) {
    return true
  }
});
/**
 * Timer
 */
Template.registerHelper('timer', function (time) {
  var now = Chronos.now()
  var end = moment(time)
  var durtion = moment.duration(end.diff(now))
  var countDown = moment.utc(durtion.asMilliseconds()).format('mm:ss')
  var durationAsMs = durtion.asMilliseconds()
  if (durationAsMs == 0 || durationAsMs < 600) {
    var countDown = '00:01'
  }
  return countDown
})
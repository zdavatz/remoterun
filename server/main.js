/**
 * 
 */
import YAML from 'yaml'
import _ from 'lodash'
import {
  Meteor
} from 'meteor/meteor';
/** */
const pty = require('pty.js');
const stripAnsi = require('strip-ansi');
/** */
var exec = require('child_process').exec;
const {
  execSync
} = require('child_process');
/**
 * Run a child process
 */
const {
  spawnSync
} = require('child_process');
/**
 * 
 */
Logs = new Mongo.Collection('logs')
/**
 * 
 */
log = console.log
/**
 * Loading the Setting file
 */
const file = Assets.getText('settings.yaml')
const settings = YAML.parse(file)
const files = settings.files;
log('Loading Setting file: ', files)
/**
 * 
 */
// Meteor.startup(function(){
//   run('eopkg search text')
// })
/**
 * 
 */
const term = pty.spawn('bash', [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env
});
/**
 * 
 */
Meteor.methods({
  /**
   * Loading the settings file (masked)
   */
  getSetting() {
    log('Loading settings: --- ', settings)
    /**
     * 
     */
    var files = settings.files;
    var files = _.map(files, (file) => {
      return {
        name: file.name,
        id: file.id
      }
    })
    settings.files = files
    log('Loading Masked Files: ', files)
    return settings
  },
  /**
   * 
   * Running a file
   */
  runCommand(command) {
    /**
     * Get the command based on the ID
     */
    log('Requesting a file with id: ', command)
    var file = _.find(files, (i) => {
      return i.id === command
    })
    log('Getting Setting File: ', file)
    if (!file || !file.file) {
      throw new Meteor.Error('command-err', 'Command does not exist')
      return
    }
    var command = file.file;
    /** Running a command with paramters
     * 
     *  Test file : '/home/neox/run/log.js' 
     */
    log('--Running command', command)
    term.write(command + '\r')
    /**
     * Run Command: run()
     */
    // try {
    //   var result = run(command)
    //   log('Result',result.split('\n'))
    //   var logData = result.split('\n')
    //   Logs.insert({
    //     log: logData,
    //     createdAt: new Date()
    //   })
    //   // return {
    //   //   log: result,
    //   //   err: null,
    //   //   status: 'Success'
    //   // }
    // } catch (err) {
    //   console.error(err);
    //   return {
    //     log: 'ERROR: ' + err,
    //     err: null,
    //     status: 'Success'
    //   }
    // }
  }
})
/**
 *  Run Command
 * === Child execSync
 */
function run(command) {
  log('Running: ', command)
  return execSync(command).toString().trim();
}
/** */
// function termData() {
  term.on('data', Meteor.bindEnvironment(function (data) {
    console.log(data);
    // var logData = data.split('\n')
    var d = cleanData(data)
    if(data.includes("neox@neoxnuc ~ $") || data.includes("Command completed") || data.includes('neox@neoxnuc')){
      return
    }
    Logs.insert({
      log: d,
      createdAt: new Date()
    })
  }));
// }
/**
 * Publish
 */
Meteor.publish(null, () => {
  return Logs.find({},{limit:100})
})
/**
 * 
 * Clean and Filter Data 
 * === (For pty.js)
 * /*

    // term.write('ls\r');
    // term.resize(100, 40);
    // term.write('ls /\r');


    // WORKING
    // term.write('eopkg search inkscape\r');

    // term.write('ls /\r')
 */
function cleanData(data){
  // return data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, " ")
  var data = data.replace(/otify;/g, "")
  var data = data.replace(/777;preexec/g, "")
  // return data = data.replace(/\033\[[0-9;]*m/,"")
  return stripAnsi(data)
}
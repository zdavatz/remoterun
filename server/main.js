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

  checkPasskey(pass){
    log(settings.passkey , pass)
    if(settings.passkey === pass){
      log('Passkey confirmed', getFiles())
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
    }else{
      throw new Meteor.Error('passkey-error', 'Wrong passkey, please enter the correct one')
    }
  },
  /**
   * Loading the settings file (masked)
   */
  getSetting() {

  },
  // 
  /**
   * 
   * Running a file
   */
  runCommand(command) {
    /**
     * Get the command based on the ID
     */

    var id = command;
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

    /**Working */
    // term.write(command + '\r')
    /**
     * Run Command: run()
     */


    var obj = {
      log: "Starting a job",
      group: id,
      name: file.name,
      command: command,
      createdAt: new Date(),
      status: 'success',
      isBlock: true,
      type: 'start',
      isStart: true
    }

    setLog(obj)




    // try {
      var result = run(command)
      log('Result', result.split('\n'))
      var logArr = result.split('\n')

      // logArr.unshift('starting' + ': ' + command)
      // logArr.push('ending' + ': ' + command )

      log('LogArr', logArr)

      _.each(logArr, (item) => {
        var item = cleanData(item)
        log('item:', item)

        var obj = {
          log: item,
          group: id,
          name: file.name,
          command: command,
          createdAt: new Date(),
          status: 'success'
        }
        //
        if (item.includes('ending')) {
          obj.isBlock = true
          obj.type = 'end'
          obj.isEnd = true
        } else {
          obj.isBlock = false
          obj.isLog = true
          obj.type = 'msg'
        }
        //
        Logs.insert(obj)
      });

      /** Setting end of a job */

      var obj = {
        log: "Starting a job",
        group: id,
        name: file.name,
        command: command,
        createdAt: new Date(),
        status: 'success',
        isBlock: true,
        type: 'end',
        isEnd: true
      }

      setLog(obj)


    // } catch (err) {
    //   console.error(err);
    //   return {
    //     log: ['ERROR: ' + err],
    //     err: null,
    //     group: id,
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
// term.on('data', Meteor.bindEnvironment(function (data) {
//   console.log(data);
//   // var logData = data.split('\n')
//   var d = cleanData(data)
//   if(data.includes("neox@neoxnuc ~ $") || data.includes("Command completed") || data.includes('neox@neoxnuc')){
//     return
//   }
//   Logs.insert({
//     log: d,
//     createdAt: new Date()
//   })
// }));
// }
/**
 * Publish
 */
Meteor.publish(null, () => {
  return Logs.find({})
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
function cleanData(data) {
  // return data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, " ")
  var data = data.replace(/otify;/g, "")
  var data = data.replace(/777;preexec/g, "")
  // return data = data.replace(/\033\[[0-9;]*m/,"")
  return stripAnsi(data)
}

function setLog(obj) {

  Logs.insert(obj)

}

/**
 * getFiles
 */

function getFiles(){

}
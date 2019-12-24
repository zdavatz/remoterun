/**
 * 
 */
import YAML from 'yaml'
import _ from 'lodash'
import {
  Meteor
} from 'meteor/meteor';
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
    try {
      var d = run(command)
      log('d', d)
      return {
        log: d,
        err: null,
        status: 'Success'
      }
    } catch (err) {
      console.error(err);
      return {
        log: 'ERROR: ' + err,
        err: null,
        status: 'Success'
      }
      return
    }
  }
})
/**
 * 
 */
function run(command) {
  return execSync(command).toString().trim();
}
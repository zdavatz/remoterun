/**
 * 
 */
import YAML from 'yaml'
import _ from 'lodash'
import {
  Meteor
} from 'meteor/meteor';
/**
 * Run a child process
 */
const { spawnSync} = require('child_process');
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
log('Loading Setting file: ',files)
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
    var files = _.map(files,(file)=>{
      return {name:file.name, id: file.id}
    })
    settings.files = files
    log('Loading Masked Files: ',files)
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
    log('Getting Setting File: ',file)
    if(!file || !file.file){
      throw new Meteor.Error('command-err','Command does not exist')
      return
    }
    var command = file.file;
    /** Running a command with paramters
     * 
     *  Test file : '/home/neox/run/log.js' 
     */
    log('--Runnung command',command)
    const ls = spawnSync( command , [] );
    if(ls.stdout){
      log('Success',ls.stdout.toString())
      return {log:ls.stdout.toString(), err: null, status:'Success'}
    }

    if(ls.stderr){
      log('ERROR',ls.stderr.toString())
      return{log: null, err: 'Error: Command/ File not found', status: 'Error'}
    }

  }
})
/**
 * 
 */

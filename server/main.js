/**
 * 
 */
import YAML from 'yaml'
import _ from 'lodash'
import {
  Meteor
} from 'meteor/meteor';
const {
  exec
} = require('child_process');
const { spawnSync } = require( 'child_process' );
log = console.log
Meteor.startup(() => {
  // code to run on server at startup
});
const file = Assets.getText('settings.yaml')
const settings = YAML.parse(file)
/**
 * 
 */
Meteor.methods({
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
    log('files',files)
    return settings
  },
  /**
   * 
   * @param {*} command 
   */
  runCommand(command) {
    /**
     * Get the command based on the ID
     */
    var file = _.find(settings.files, (i) => {
      return i.id = command
    })

    if(!file){
      throw new Meteor.Error('command-err','Command does not exist')
      return
    }
    log('file',file.file)
    var command = file.file;
    var result = {}
    /**
     * Running a command with paramters
     * const child = spawnSync('ls', ['-lh', '/usr']);
     */
    const commandRun = spawnSync( command );
    result.log = commandRun.stdout.toString()
    result.err = commandRun.stderr.toString()
    return result
  }
})
/**
 * 
 */
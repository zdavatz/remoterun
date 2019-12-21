/**
 * 
 */

import YAML from 'yaml'
import {
  Meteor
} from 'meteor/meteor';


log = console.log
Meteor.startup(() => {
  // code to run on server at startup
});



/**
 * 
 */
Meteor.methods({
  getSetting() {
    var settingFile = Assets.getText('settings.yaml')
    var setting = YAML.parse(settingFile)
    log('Loading settings: --- ',setting)
    return setting
  }
})
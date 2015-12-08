module.exports = function($http) {
    "use strict";
    var g13Service = {};

    function load() {
        $http.get('/data/skill-to-key.json').then(
            function successCallback(response) {
                g13Service.mappings = response.data;
            },
            function errorCallback(response){
                $log.error('unable to access to skills !');
            });                    
    }

    function computeKeyMacro(key, delay) {
        // for simple key :
        //  <key value="1" direction="down"/>
        //  <delay milliseconds="100"/>
        //  <key value="1" direction="up"/>
        //  <delay milliseconds="100"/>
        // for key + shif
        //  <key value="LSHIFT" direction="down"/>
        //  <delay milliseconds="100"/>
        //  <key value="0" direction="down"/>
        //  <delay milliseconds="100"/>
        //  <key value="0" direction="up"/>
        //  <delay milliseconds="100"/>
        //  <key value="LSHIFT" direction="up"/>
        //  <delay milliseconds="1500"/>
        var keyCommand = '';
        if (key.shift) {
            keyCommand = keyCommand.concat('  <key value="LSHIFT" direction="down" />\n  <delay milliseconds="100"/>\n');
        }
        if (key.ctrl) {
            keyCommand = keyCommand.concat('  <key value="LCTRL" direction="down" />\n  <delay milliseconds="100"/>\n');
        }
        keyCommand = keyCommand.concat('  <key value="', key.key,'" direction="down" />\n  <delay milliseconds="100"/>\n');
        keyCommand = keyCommand.concat('  <key value="', key.key, '" direction="up" />\n  <delay milliseconds="100"/>\n');
        if (key.ctrl) {
            keyCommand = keyCommand.concat('  <key value="LCTRL" direction="up" />\n  <delay milliseconds="100"/>\n');
        }
        if (key.shift) {
            keyCommand = keyCommand.concat('  <key value="LSHIFT" direction="up" />\n  <delay milliseconds="100"/>\n');
        }

        return keyCommand;
    }

    g13Service.computeCommands = function(skills) {
        var commands = [];
        angular.forEach(skills, function(skill) {
            var command = {};
            command.skill = skill;                
            commands.push(command);
        });
        // update timeline
        var time = 0;
        angular.forEach(commands, function(command) {
            command.trigger_time = time;
            time = time + parseInt(command.skill.recast_time);
        });
        return commands;
    };

    g13Service.computeMacro = function(commands) {
        var macro = '';
        angular.forEach(commands, function(command) {
            macro = macro.concat(computeKeyMacro(command.skill.key, command.skill.recast_time));
        });
        return macro;
    };   

    load();
    return g13Service;
};
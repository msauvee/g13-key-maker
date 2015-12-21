module.exports = function($http) {
    "use strict";
    var g13Service = {};
    g13Service.gcd_duration=2.5;

    function load() {
        $http.get('/data/skill-to-key.json').then(
            function successCallback(response) {
                g13Service.mappings = response.data;
            },
            function errorCallback(response){
                $log.error('unable to access to skills !');
            });                    
    }

    // delay in seconds
    function computeKeyMacro(key, delay) {
        var keyCommand = '';
        if (key.shift) {
            keyCommand = keyCommand.concat('  <key value="LSHIFT" direction="down" />\n  <delay milliseconds="100"/>\n');
        }
        if (key.ctrl) {
            keyCommand = keyCommand.concat('  <key value="LCTRL" direction="down" />\n  <delay milliseconds="100"/>\n');
        }
        keyCommand = keyCommand.concat('  <key value="', key.key, '" direction="down" />\n  <delay milliseconds="100"/>\n');
        
        //last keys, compute delay for key (if no shift and no ctrl)
        var keyDelay = 0.1; // by default thre is shift or ctrl => 100 ms
        if (!key.shift && !key.ctrl) {
            keyDelay = delay-0.1;
        }
        if (keyDelay < 0.1) { 
            keyDelay = 0.1;
        }        
        keyCommand = keyCommand.concat('  <key value="', key.key, '" direction="up" />\n  <delay milliseconds="', keyDelay * 1000, '"/>\n');
        if (key.ctrl) {
            // if no shift but ctrl, then put delay here
            var keyCrtlDelay = 0.1;
            if (!key.shift) {
                keyCrtlDelay = delay-0.4;
            }
            if (keyCrtlDelay < 0.1) { 
                keyCrtlDelay = 0.1;
            }
            keyCommand = keyCommand.concat('  <key value="LCTRL" direction="up" />\n  <delay milliseconds="', keyCrtlDelay * 1000, '"/>\n');
        }
        if (key.shift) {
            // if shift or ctrl, then put delay here
            var keyShiftDelay = delay-0.4; // by default only shift
            if (key.ctrl) {
                keyShiftDelay = delay-0.6;
            }
            if (keyShiftDelay < 0.1) { 
                keyShiftDelay = 0.1;
            }
            keyCommand = keyCommand.concat('  <key value="LSHIFT" direction="up" />\n  <delay milliseconds="', keyShiftDelay * 1000, '"/>\n');
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
        for(var index = 0, len = commands.length; index < len; index++) {            
            var recast = parseInt(commands[index].skill.recast_time);
            time = time + g13Service.gcd_duration;
            // check there where no recast time issue with previous command
            for(var index_prev = 0; index_prev < index; index_prev++) {
                if (commands[index].id === commands[index_prev].id && time < commands[index_prev].trigger_time + recast) {
                    time = commands[index_prev].trigger_time + recast;
                }
            }
            commands[index].trigger_time = time;
        };
        return commands;
    };

    g13Service.computeMacro = function(commands) {
        var macro = '';
        for(var index = 0, len = commands.length; index < len; index++) {    
            var delay = 0;
            if (index + 1 < commands.length) {
                delay = commands[index+1].trigger_time - commands[index].trigger_time;
            }
            macro = macro.concat(computeKeyMacro(commands[index].skill.key, delay));
        }
        return macro;
    };   

    load();
    return g13Service;
};
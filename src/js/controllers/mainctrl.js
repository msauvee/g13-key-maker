module.exports = function($scope, $http, $log, ffxivdb) {

    function computeCommands() {
        var commands = [];
        angular.forEach($scope.select, function(skill) {
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

    function computeMacro(commands) {
        var macro = '';
        angular.forEach(commands, function(command) {
            macro = macro.concat(computeKeyMacro(command.skill.key, command.skill.recast_time));
        });
        return macro;
    }

    function updateSkill() {
        if ($scope.selectedClass) {
            // id start at 1.
            var classJobId = $scope.classJobs.indexOf($scope.selectedClass) + 1; 

            $http.get('/data/skills.json').then(
                function successCallback(response) {
                    if (!angular.isArray(response.data)){
                        $log.error("bad format for skills !");
                    }

                    var skills = [];
                    // filter on spells ("action_category": "4")
                    angular.forEach(response.data, function(skill) {
                        if (parseInt(skill.classjob.id) === classJobId) {
                            skills.push(skill);
                        }
                    });   

                    $http.get('/data/skill-to-key.json').then(
                        function successCallback(response) {
                            if (!angular.isArray(response.data)){
                                $log.error('bad format of mapping skill to key !');
                            }
                        
                            angular.forEach(response.data, function(mapping) {
                                for(var index = 0; index < skills.length; index++) {
                                    if (skills[index] && skills[index].id === mapping.id) {
                                        skills[index].key = mapping.key;
                                        break;
                                    }
                                }
                            });

                            // add view object inside model
                            // url: "http://xivdb.com/images/icons/000000/000606.png",
                            angular.forEach(skills, function(skill) {
                                if (skill) {
                                    skill.view = {};
                                    skill.view.icon = 'http://xivdb.com' + skill.icon;
                                    skill.view.class = (skill.key) ? 'enabled' : 'disabled';
                                }
                            });



                            $scope.skills = skills;
                            var commands = computeCommands();
                            $scope.commands = commands;
                            $scope.macro = computeMacro(commands);
                        },
                        function errorCallback(response){
                            $log.error('unable to access to mapping skill to key !');
                        });            
                },
                function errorCallback(response){
                    $log.error('unable to access to skills !');
                });

        }
    }

    $scope.addToSelectedSkills = function(skill_name) {
        angular.forEach($scope.skills, function(skill) {
            if (skill.name === skill_name) {
                if (skill.key) {
                    $scope.select.push(skill);
                }
                return false;
            }            
        });  
        $scope.commands = computeCommands();    
        $scope.macro = computeMacro($scope.commands);
    };

    $scope.removeFromSectedSkills = function(skill_name) {
        var index = 0;
        angular.forEach($scope.select, function(skill) {
            if (skill.name === skill_name) {
                $scope.select.splice(index, 1);
                return false;
            }
            index++;
        });        
        $scope.commands = computeCommands();
        $scope.macro = computeMacro($scope.commands);
    };

    $scope.classSelected = function(clazz) {
        //$scope.selectedClass = clazz;
        //updateSkill();
    };


    $scope.skills = [];    
    $scope.select = [];   
    $scope.commands = [];
    $scope.macro ='';
//    $scope.classJobs = ffxivdb.classFullList();
    $scope.classJobs = ['gladiator', 'pugilist', 'marauder', 'lancer', 'archer', 'conjurer', 'thaumaturge', 'carpenter', 'blacksmith', 'armorer', 'goldsmith', 'leatherworker', 'weaver', 'alchemist', 'culinarian', 'miner', 'botanist', 'fisher', 'paladin', 'monk', 'warrior', 'dragoon', 'bard', 'whitemage', 'blackmage', 'arcanist', 'summoner', 'scholar', 'rogue', 'ninja', 'machinist', 'darkknight', 'astrologian'];

};

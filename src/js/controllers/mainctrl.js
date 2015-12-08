module.exports = function($scope, $http, $log, ffxivdb, g13) {

    function updateSkill() {
        if ($scope.selectedClass) {
            var skills = ffxivdb.skillList($scope.selectedClass);
            // add view object inside model
            // url: "http://xivdb.com/images/icons/000000/000606.png",
            angular.forEach(skills, function(skill) {
                if (skill) {
                    skill.view = {};
                    skill.view.icon = 'http://xivdb.com' + skill.icon;
                    skill.view.class = (skill.key) ? 'enabled' : 'disabled';
                }
            });

            angular.forEach(g13.mappings, function(mapping) {
                for(var index = 0; index < skills.length; index++) {
                    if (skills[index] && skills[index].id === mapping.id) {
                        skills[index].key = mapping.key;
                        break;
                    }
                }
            });

            $scope.skills = skills;
            var commands = g13.computeCommands($scope.select);
            $scope.commands = commands;
            $scope.macro = g13.computeMacro(commands);
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
        $scope.commands = g13.computeCommands($scope.select);    
        $scope.macro = g13.computeMacro($scope.commands);
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
        $scope.commands = g13.computeCommands($scope.select);
        $scope.macro = g13.computeMacro($scope.commands);
    };

    $scope.classSelected = function(clazz) {
        $scope.selectedClass = clazz;
        updateSkill();
    };


    $scope.skills = [];    
    $scope.select = [];   
    $scope.commands = [];
    $scope.macro ='';
    $scope.selectedClass = 'Classe';
    $scope.classJobs = ffxivdb.classFullList();   
};

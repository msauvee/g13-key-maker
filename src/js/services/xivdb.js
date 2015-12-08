module.exports = function($http) {
    var ffxivdb = {};

    function load() {
        $http.get('/data/skills.json').then(
            function successCallback(response) {
                ffxivdb.skills = response.data;
            },
            function errorCallback(response){
                $log.error('unable to access to skills !');
            });                    
    }

    ffxivdb.classFullList = function() {
        return ['gladiator', 'pugilist', 'marauder', 'lancer', 'archer', 'conjurer', 'thaumaturge', 'carpenter', 'blacksmith', 'armorer', 'goldsmith', 'leatherworker', 'weaver', 'alchemist', 'culinarian', 'miner', 'botanist', 'fisher', 'paladin', 'monk', 'warrior', 'dragoon', 'bard', 'whitemage', 'blackmage', 'arcanist', 'summoner', 'scholar', 'rogue', 'ninja', 'machinist', 'darkknight', 'astrologian'];
    };

    ffxivdb.skillList = function(clazz) {
        // id start at 1.
        var classJobId = ffxivdb.classFullList().indexOf(clazz) + 1;
        var skills = [];
        if (classJobId !== 0 && ffxivdb.skills) {
            angular.forEach(ffxivdb.skills, function(skill) {
                if (parseInt(skill.classjob.id) === classJobId) {
                    skills.push(skill);
                }
            });
        }
        return skills;
    };

    load();
    return ffxivdb;
};

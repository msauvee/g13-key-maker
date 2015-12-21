module.exports = function($http) {
    var ffxivdb = {};
    ffxivdb.classList = ['gladiator', 'pugilist', 'marauder', 'lancer', 'archer', 'conjurer', 'thaumaturge', 'arcanist', 'rogue'];
    ffxivdb.jobList = ['paladin', 'monk', 'warrior', 'dragoon', 'bard', 'whitemage', 'blackmage', 'summoner', 'scholar', 'ninja', 'machinist', 'darkknight', 'astrologian'];
    ffxivdb.craftingList = ['carpenter', 'blacksmith', 'armorer', 'goldsmith', 'leatherworker', 'weaver', 'alchemist', 'culinarian'];
    ffxivdb.gatheringList = ['miner', 'botanist', 'fisher'];

    function load() {
        $http.get('/data/skills.json').then(
            function successCallback(response) {
                ffxivdb.skills = response.data;
            },
            function errorCallback(response){
                $log.error('unable to access to skills !');
            });
    }

    function getXivdbClassJobId(clazzOrJob) {
        var clazzIndex = ffxivdb.classList.indexOf(clazzOrJob);
        if (clazzIndex !== -1) {
            if (clazzOrJob === 'arcanist') {
                return 26;
            }
            if (clazzOrJob === 'rogue') {
                return 29;
            }
            return clazzIndex + 1;
        }
        var jobIndex = ffxivdb.jobList.indexOf(clazzOrJob);
        if (jobIndex !== -1) {
            if (jobIndex >= 9) { // 'ninja', 'machinist', 'darkknight', 'astrologian' 
                return jobIndex + 21;
            }
            if (jobIndex >= 7) { // summoner, cholar
                return jobIndex + 20;
            }
            return jobIndex + 19;
        }
        var craftingIndex = ffxivdb.craftingList.indexOf(clazzOrJob);
        if (craftingIndex !== -1) {
            return craftingIndex + 8;
        }
        var gatheringIndex = ffxivdb.gatheringList.indexOf(clazzOrJob);
        if (gatheringIndex !== -1) {
            return gatheringIndex + 16;
        }
        return -1;
    }
    

    ffxivdb.classOfJob = function(job) {
        if (job === 'paladin')      return 'gladiator';
        if (job === 'monk')         return 'pugilist';
        if (job === 'warrior')      return 'marauder';
        if (job === 'dragoon')      return 'lancer';
        if (job === 'bard')         return 'archer';
        if (job === 'whitemage')    return 'conjurer';
        if (job === 'blackmage')    return 'thaumaturge';
        if (job === 'summoner')     return 'arcanist';
        if (job === 'scholar')      return 'conjurer';
        if (job === 'ninja')        return 'rogue';
        return undefined;
    };

    ffxivdb.skillListOfClass = function(clazz) {
        // xivdb.id start at 1 for gladiator, and order in ffxivdb.classList is respected
        // arcanist is 26
        var classId = getXivdbClassJobId(clazz);
        var skills = [];
        if (classId !== 0 && ffxivdb.skills) {
            angular.forEach(ffxivdb.skills, function(skill) {
                if (parseInt(skill.classjob.id) === classId) {
                    skills.push(skill);
                }
            });
        }
        return skills;
    };

    ffxivdb.skillListOfJob = function(job) {
        // xivdb.id start at 19 for paladin, and order in ffxivdb.classList is respected
        var jobId = getXivdbClassJobId(job);
        var skills = [];
        if (jobId !== 0 && ffxivdb.skills) {
            angular.forEach(ffxivdb.skills, function(skill) {
                if (parseInt(skill.classjob.id) === jobId) {
                    skills.push(skill);
                }
            });
        }
        var classOfJob = ffxivdb.classOfJob(job);
        if (classOfJob) {
            skills = skills.concat(ffxivdb.skillListOfClass(classOfJob));   
        }
        return skills;
    };

    load();
    return ffxivdb;
};

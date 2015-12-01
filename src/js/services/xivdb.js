module.exports = function() {
    var ffxivdb = {};

    ffxivdb.load = function(data) {
        ffxivdb.skills = data;
    };

    ffxivdb.classFullList = function() {
        return ['gladiator', 'pugilist', 'marauder', 'lancer', 'archer', 'conjurer', 'thaumaturge', 'carpenter', 'blacksmith', 'armorer', 'goldsmith', 'leatherworker', 'weaver', 'alchemist', 'culinarian', 'miner', 'botanist', 'fisher', 'paladin', 'monk', 'warrior', 'dragoon', 'bard', 'whitemage', 'blackmage', 'arcanist', 'summoner', 'scholar', 'rogue', 'ninja', 'machinist', 'darkknight', 'astrologian'];
    };

    return ffxivdb;
};

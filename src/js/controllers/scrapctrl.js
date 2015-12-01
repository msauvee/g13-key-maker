module.exports = function($scope, $http, $log, cheerio) {

    var parseSkills = function(response) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(response.data, 'text/html');

        //var div = angular.element(response.data);
        var abilities = doc.firstChild.querySelectorAll('div img.st-skill-icon');
        //.querySelector('#sr-page-abilities');
        var i = 3;
    };

    var skills = $http.get('http://www.xivdb.com/modules/search/search.php?query=&page=1&pagearray=%7B%7D&language=1&filters=%22SKILLS%3AASA_ROGUE%3AACA_INGAME_1%22&showview=0').then(parseSkills);    
};
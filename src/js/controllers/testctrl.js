module.exports = function($scope, $http, $log) {
    $scope.classSelected = function(clazz) {
        //$scope.selectedClass = clazz;
        //alert("drop box item selected");
        $scope.spice = clazz;
    };

    $scope.items = ['one','two','three','four'];
    $scope.selected = "Tutorial";
    $scope.setTutorial = function(value) {
      $scope.selected = value;
    };
};

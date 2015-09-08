app.controller('AgmController',function($scope){
    $scope.noEnter = function(e){
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();
            return false;
        }
    };
});
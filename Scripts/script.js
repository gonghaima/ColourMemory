var app = angular.module('test', []);

app.controller('testCtrl', function ($scope) {
    //total attempt
    $scope.attemptCount = 0;
    //correct pair
    $scope.correctPair = 0;

    //flag - show greetings
    $scope.showGreetings = false;

    //randomize an array
    var shuffleArray = function (array) {
        var m = array.length, t, i;

        // While there remain elements to shuffle
        while (m) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    }

    $scope.records = [];
    $scope.colors = ['#0EE836', '#0EE836',
        '#D6E80E', '#D6E80E',
 '#E80E69', '#E80E69',
 '#E8410E', '#E8410E',
 '#650EE8', '#650EE8',
 '#A1892A', '#A1892A',
        '#200EE8', '#200EE8',
        '#0EE88D', '#0EE88D'];
    $scope.defaultOverlayColour = "lightgray";
    //get a random colour array
    $scope.randomColors = shuffleArray($scope.colors);

    //hold current active element
    //$scope.activeElementIndex = -1;
    $scope.activeRecord = null;

    //assign ramdom color to list
    //active 0-no 1-yes 2-done
    for (var i = 1; i <= 16; i++) {
        $scope.records.push({
            id: i, navIndex: i,
            name: 'record ' + i,
            color: $scope.randomColors[i-1],
            defaultColour: $scope.defaultOverlayColour,
            active: 0
        });
    }

    $scope.focusIndex = 0;

    $scope.open = function (index) {
        var record;
        for (var i = 0; i < $scope.records.length; i++) {
            if ($scope.records[i].navIndex !== index) { continue; }
            record = $scope.records[i];
        }
        //console.log('opening : ', record);
    };

    $scope.keys = [];
    $scope.keys.push({ code: 13, action: function () { $scope.open($scope.focusIndex); } });
    $scope.keys.push({
        //Key up
        code: 38, action: function () {
            if (($scope.focusIndex - 4) > 0) {
                $scope.focusIndex -= 4;
            }

        }
    });
    $scope.keys.push({
        //key down
        code: 40, action: function () {
            if (($scope.focusIndex + 4) <= 16) {
                $scope.focusIndex += 4;
            }
        }
    });
    $scope.keys.push({
        //key left
        code: 37, action: function () {
            if (($scope.focusIndex - 1) > 0) {
                $scope.focusIndex--;
            }
        }
    });
    $scope.keys.push({
        //key right
        code: 39, action: function () {
            if (($scope.focusIndex + 1) <= 16) {
                $scope.focusIndex++;
            }
        }
    });
    $scope.keys.push({
        //key enter
        code: 13, action: function (elementIndex) {
            //var element = $event.target;
            //console.log($scope.records[elementIndex]);
            //$scope.records[elementIndex].defaultColor = $scope.records[elementIndex].color;
            //currentStyle = "{'background-color':'" + $scope.records[elementIndex].color + "'}";
            //currentStyle = { 'background-color': 'blue' }

            var trueIndex = elementIndex - 1;

            //only work on records not "done" - active !=2
            if ($scope.records[trueIndex].active != 2) {
                //if a record has been activated, and not the same one - in case double enter-click on the same record
                if (($scope.activeRecord != null) && ($scope.activeRecord != $scope.records[trueIndex])) {
                    //total attempt count increase
                    $scope.attemptCount++;
                    //if match, diable two records
                    if ($scope.records[trueIndex].color == $scope.activeRecord.color) {
                        
                        //disable the two matched record
                        $scope.records[trueIndex].defaultColour = "#000";
                        $scope.records[trueIndex].active = 2;
                        $scope.records[$scope.activeRecord.navIndex - 1].defaultColour = "#000";
                        $scope.records[$scope.activeRecord.navIndex - 1].active = 2;
                        $scope.activeRecord = null;

                        //correct pair count increase, hide play panel/show greetings if all correct
                        $scope.correctPair += 2;
                        console.log("correct Pair number: " + $scope.correctPair);
                        if ($scope.correctPair == 16) {
                            $scope.showGreetings = true;
                        }
                    } else {//otherwise, turn both record back to default colour, reset active record to empty
                        $scope.records[trueIndex].defaultColour = $scope.defaultOverlayColour;
                        $scope.records[$scope.activeRecord.navIndex - 1].defaultColour = $scope.defaultOverlayColour;
                        $scope.records[trueIndex].active = 0;
                        console.log($scope.activeRecord.navIndex);
                        $scope.records[$scope.activeRecord.navIndex - 1].active = 0;
                        $scope.activeRecord = null;
                    }
                } else {
                    $scope.records[trueIndex].defaultColour = $scope.records[trueIndex].color;
                    $scope.records[trueIndex].active = 1;
                    $scope.activeRecord = $scope.records[trueIndex];
                }

            }
        }
    });

    $scope.$on('keydown', function (event, code) {
        $scope.keys.forEach(function (o) {
            if (o.code !== code) { return; }
            o.action(event.currentScope.focusIndex);
            $scope.$apply();
        });
    });

});


app.directive('keyTrap', function () {
    return function (scope, elem) {
        elem.bind('keydown', function (event) {
            scope.$broadcast('keydown', event.keyCode);
        });
    };
});
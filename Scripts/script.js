/// <reference path="angular.min.js" />

var app = angular.module('test', []);
app
    .constant("apiUri", "http://54.66.218.13:2403/players")
    .controller('testCtrl', function ($scope, $http, $filter, apiUri) {

        //prototype sort
        Array.prototype.sortBy = function (p) {
            return this.slice(0).sort(function (a, b) {
                return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
            });
        }

        //get Players list
        $scope.showRankings = false;
        $scope.Rankedplayers = [];
        $scope.listPlayers= function () {
            $http.get(apiUri).success(function (data) {
                $scope.players = data;
                $scope.players = $scope.players.sortBy('score').reverse();
            });
        }
        $scope.listPlayers();
        $scope.currentPlayer = {};
        $scope.currentPlayer.score = 0;

        //create a player
        $scope.createPlayer = function (currentPlayer) {
            $scope.showform = false;
            $http.post(apiUri, currentPlayer)
                .success(function (data) {
                    $scope.currentPlayer = data;

                    $scope.players.push($scope.currentPlayer);
                    $scope.players = $scope.players.sortBy('score').reverse();
                    $scope.myRanking = _.indexOf($scope.players, $scope.currentPlayer);
                    if ($scope.myRanking = -1) {
                        $scope.myRanking = $scope.players.length;
                    }
                    
                    $scope.showRankings = true;
                    $scope.showGreetings = true;

                }).error(function (data, status, headers, config) {
                    console.log("error");
                    return status;
                });
        }

    //total attempt
        $scope.attemptCount = 0;

        
    //correct pair
    $scope.correctPair = 0;

    //flag - show greetings - show form
    $scope.showGreetings = false;
    $scope.showform= false;

    //function randomize an array
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

        //initialize 8 pairs of colours
    $scope.colors = [];
    for(i=1;i<=8;i++){
        $scope.colors.push('Images/colour' + i + '.png');
        $scope.colors.push('Images/colour' + i + '.png');
    }
    $scope.defaultOverlayColour = "Images/card_bg.png";
    //get a random colour array
    $scope.randomColors = shuffleArray($scope.colors);

    //hold current active element
    $scope.activeRecord = null;

    //assign random color to list
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

    $scope.focusIndex = 1;

    $scope.open = function (index) {
        var record;
        for (var i = 0; i < $scope.records.length; i++) {
            if ($scope.records[i].navIndex !== index) { continue; }
            record = $scope.records[i];
        }
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

            var trueIndex = elementIndex - 1;

            //only work on records not "done" - active !=2
            if ($scope.records[trueIndex].active != 2) {
                //if a record has been activated, and not the same one - in case double enter-click on the same record
                if (($scope.activeRecord != null) && ($scope.activeRecord != $scope.records[trueIndex])) {
                    //total attempt count increase
                    $scope.attemptCount++;
                    //if match, diable two records
                    if ($scope.records[trueIndex].color == $scope.activeRecord.color) {
                        //get one score
                        $scope.currentPlayer.score++;

                        //disable the two matched record
                        $scope.records[trueIndex].defaultColour = "Images/bigSmiles.png";
                        $scope.records[trueIndex].active = 2;
                        $scope.records[$scope.activeRecord.navIndex - 1].defaultColour = "Images/bigSmiles.png";
                        $scope.records[$scope.activeRecord.navIndex - 1].active = 2;
                        $scope.activeRecord = null;

                        //correct pair count increase, hide play panel/show greetings if all correct
                        $scope.correctPair += 2;
                        //console.log("correct Pair number: " + $scope.correctPair);
                        if ($scope.correctPair == 16) {
                            //greeting message
                            $scope.greetings = "Congratulations, " + $scope.attemptCount + " attempts. Scores: " + $scope.currentPlayer.score;
                            $scope.showGreetings = true;
                            $scope.showform = true;
                        }
                    } else {//otherwise, turn both record back to default colour, reset active record to empty
                        //otherwise, turn active record to default colour, set active record to current record
                        //lose one scope
                        $scope.currentPlayer.score--;

                        //$scope.records[trueIndex].defaultColour = $scope.defaultOverlayColour;
                        //$scope.records[$scope.activeRecord.navIndex - 1].defaultColour = $scope.defaultOverlayColour;
                        //$scope.records[trueIndex].active = 0;
                        //$scope.records[$scope.activeRecord.navIndex - 1].active = 0;
                        //$scope.activeRecord = null;

                        //current record become active
                        $scope.records[trueIndex].defaultColour = $scope.records[trueIndex].color;
                        $scope.records[trueIndex].active = 1;

                        $scope.records[$scope.activeRecord.navIndex - 1].active = 0;
                        $scope.records[$scope.activeRecord.navIndex - 1].defaultColour = $scope.defaultOverlayColour;
                        $scope.activeRecord = $scope.records[trueIndex];
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

//detecting key stroke
app.directive('keyTrap', function () {
    return function (scope, elem) {
        elem.bind('keydown', function (event) {
            scope.$broadcast('keydown', event.keyCode);
        });
    };
});
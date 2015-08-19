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
                //$scope.players = _.map(_.sortBy($scope.players, ['score']), _.values).reverse();
                //$scope.myRanking = _.indexOf($scope.players, $scope.currentPlayer);
                //$scope.showRankings = true;
                
            });
        }
        $scope.listPlayers();
        $scope.currentPlayer = {};
        //$scope.currentPlayer = { "name": "Bob", "email": "bob@gmail.com", "score": 5, "id": "cc8f752f8393383c" };
        $scope.currentPlayer.score = 0;
        

        //$scope.showForm = true;

        //create a player
        $scope.createPlayer = function (currentPlayer) {
            $scope.showform = false;
            $http.post(apiUri, currentPlayer)
                .success(function (data) {
                    $scope.currentPlayer = data;

                    //show top players
                    //$scope.listPlayers().then(function () {
                    //    $scope.myRanking = _.indexOf($scope.players, $scope.currentPlayer);
                    //    if ($scope.myRanking = -1) {
                    //        $scope.myRanking = $scope.players.length();
                    //    }
                    //});
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
    $scope.colors = ['Images/colour1.png', 'Images/colour1.png',
        'Images/colour2.png', 'Images/colour2.png',
 'Images/colour3.png', 'Images/colour3.png',
 'Images/colour4.png', 'Images/colour4.png',
 'Images/colour5.png', 'Images/colour5.png',
 'Images/colour6.png', 'Images/colour6.png',
        'Images/colour7.png', 'Images/colour7.png',
        'Images/colour8.png', 'Images/colour8.png'];
    $scope.defaultOverlayColour = "Images/card_bg.png";
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
                        console.log("correct Pair number: " + $scope.correctPair);
                        if ($scope.correctPair == 16) {
                            //greeting message
                            $scope.greetings = "Congratulations, " + $scope.attemptCount + " attempts. Scores: " + $scope.currentPlayer.score;
                            $scope.showGreetings = true;
                            $scope.showform = true;
                        }
                    } else {//otherwise, turn both record back to default colour, reset active record to empty
                        //lose one scope
                        $scope.currentPlayer.score--;

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

//detecting key stroke
app.directive('keyTrap', function () {
    return function (scope, elem) {
        elem.bind('keydown', function (event) {
            scope.$broadcast('keydown', event.keyCode);
        });
    };
});
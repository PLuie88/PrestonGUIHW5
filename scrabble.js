/*
Preston Luie
Preston_luie@student.uml.edu
01971155
 */


//initialize gameboard with all blank values
//if most recent tile is not put on a "doubler" then the double score does not calculate correctly in regards to putting back in the rack
// Double Letters functions properly with addition / double words does not function properly with addition if the double word tile is not the last one placed
// Double letters do not subtract properly if not the most recent tile placed (is the same case for double words)
// On double word it does not calculate properly 
// NOTE FOR README If i get rid of the current score tracker then maybe I can say that there are less bugs instead just saying that the double word does not work properly unless it is the last tile placed
//possibly change the values in the array object if placed on a doubler and then change them back when placed back onto the rack or moved
var gameBoard = new Array(15);
var wordMultiplyTracker = new Array(15);
var letterMultiplyTracker = new Array(15);
for (var i = 0; i < gameBoard.length; i++) {
    gameBoard[i] = null;
    wordMultiplyTracker[i] = '1';
    letterMultiplyTracker[i] = '1';
}


//Locations for the word multipliers / letter multipliers resepectively on the gameboard
wordMultiplyTracker[2] = '2'; 
wordMultiplyTracker[12] = '2';
letterMultiplyTracker[6] = '2';
letterMultiplyTracker[8] = '2';


var totalScore = 0; //starting score
var curScore = 0; //starting word score *CHANGE THIS TO SCORE PER ROUND
var dTileOnArray; // NEW TESTING THIS THEORY


var ScrabbleTiles = []; //from prof heines
ScrabbleTiles["A"] = { "value": 1, "original-distribution": 9, "number-remaining": 9 };
ScrabbleTiles["B"] = { "value": 3, "original-distribution": 2, "number-remaining": 2 };
ScrabbleTiles["C"] = { "value": 3, "original-distribution": 2, "number-remaining": 2 };
ScrabbleTiles["D"] = { "value": 2, "original-distribution": 4, "number-remaining": 4 };
ScrabbleTiles["E"] = { "value": 1, "original-distribution": 12, "number-remaining": 12 };
ScrabbleTiles["F"] = { "value": 4, "original-distribution": 2, "number-remaining": 2 };
ScrabbleTiles["G"] = { "value": 2, "original-distribution": 3, "number-remaining": 3 };
ScrabbleTiles["H"] = { "value": 4, "original-distribution": 2, "number-remaining": 2 };
ScrabbleTiles["I"] = { "value": 1, "original-distribution": 9, "number-remaining": 9 };
ScrabbleTiles["J"] = { "value": 8, "original-distribution": 1, "number-remaining": 1 };
ScrabbleTiles["K"] = { "value": 5, "original-distribution": 1, "number-remaining": 1 };
ScrabbleTiles["L"] = { "value": 1, "original-distribution": 4, "number-remaining": 4 };
ScrabbleTiles["M"] = { "value": 3, "original-distribution": 2, "number-remaining": 2 };
ScrabbleTiles["N"] = { "value": 1, "original-distribution": 6, "number-remaining": 6 };
ScrabbleTiles["O"] = { "value": 1, "original-distribution": 8, "number-remaining": 8 };
ScrabbleTiles["P"] = { "value": 3, "original-distribution": 2, "number-remaining": 2 };
ScrabbleTiles["Q"] = { "value": 10, "original-distribution": 1, "number-remaining": 1 };
ScrabbleTiles["R"] = { "value": 1, "original-distribution": 6, "number-remaining": 6 };
ScrabbleTiles["S"] = { "value": 1, "original-distribution": 4, "number-remaining": 4 };
ScrabbleTiles["T"] = { "value": 1, "original-distribution": 6, "number-remaining": 6 };
ScrabbleTiles["U"] = { "value": 1, "original-distribution": 4, "number-remaining": 4 };
ScrabbleTiles["V"] = { "value": 4, "original-distribution": 2, "number-remaining": 2 };
ScrabbleTiles["W"] = { "value": 4, "original-distribution": 2, "number-remaining": 2 };
ScrabbleTiles["X"] = { "value": 8, "original-distribution": 1, "number-remaining": 1 };
ScrabbleTiles["Y"] = { "value": 4, "original-distribution": 2, "number-remaining": 2 };
ScrabbleTiles["Z"] = { "value": 10, "original-distribution": 1, "number-remaining": 1 };
ScrabbleTiles["Blank"] = { "value": 0, "original-distribution": 2, "number-remaining": 2 }; //had to change this so images can load properly


//used to track original location of the pieces when the page first starts so that they can be reffered to later on to update the position for next as well as restart / new game
var positionTop = new Array(7);
var positionLeft = new Array(7);


//traverses through the entire array and ensures that only valid random tiles are output back into the playing field.
function randomTileGen() {
    const totalTiles = Object.keys(ScrabbleTiles).filter(tile => ScrabbleTiles[tile]["number-remaining"] > 0); //https://www.w3schools.com/jsref/jsref_obj_array.asp
    const randomTile = totalTiles[Math.floor(Math.random() * totalTiles.length)];
    return randomTile;
}


//initializes all of the tiles with their allowed scrabble tile images to ensure that the game is working properly
$(function () {
    for (var i = 1; i <= 7; i++) { //changed from i = 0 to 1
        var randomTile = randomTileGen();
        var tileOnRack = $('#tile' + i); //position from HTML rack
        tileOnRack.attr('src', './alltiles/Scrabble_Tile_' + randomTile + '.jpg'); //draws form legally found random tile
        tileOnRack.attr('letter', randomTile);
        console.log('Tiles on rack: ' + randomTile);
        ScrabbleTiles[randomTile]["number-remaining"]--;
        var position = tileOnRack.position();
        positionTop[i] = position.top;
        positionLeft[i] = position.left;
        console.log('Tile' + i + 'grid-column: ' + i);
        console.log('PosTop:' + positionTop[i] + 'PosLeft:' + positionLeft[i] + 'index:' + i);


    }
});


/*
function for the draggable / droppable zones. The draggables work properly besides the fact that the double word multiplier
only works when it is the last tile placed onto the board. Otherwise the score as well as the abliltiy to place on the board as well as the rack
are working properly.
NOTE: The score output is a running score of all words that are created and placed onto the board (including if there is only one tile on the board)
 */
$(function () {

    $('.draggable').draggable({ //to check for adjacent check to see if left and right are null items? check the same way as $(this).attr('boardPos')
        revert: 'invalid' //maybe write something here that is a function that loops thruogh rack tiles, if and puts it back there? if (invalid) look through rack, whatever rack is empty return that and then make it go there?
    });

    $('.scrabbleBoard').droppable({
        accept: '.draggable',
        drop: function (event, ui) {
            const draggableId = ui.draggable.attr('id');
            const droppableId = $(this).attr('id');
            dTileOnArray = $(this).attr('boardPos'); 
            const tileLetter = $('#' + draggableId).attr('letter');
            console.log("This is the tileLetter: " + tileLetter);

            gameBoard[dTileOnArray] = tileLetter; //push letter into board array maybecheck the board positions?

            var tileValue = ScrabbleTiles[tileLetter]["value"];
            console.log("letterMultiplyTracker[dTileOnArray] is BOARD: ", letterMultiplyTracker[dTileOnArray]);
            if (letterMultiplyTracker[dTileOnArray] == '2') { //if placed on lettter multiplier
                tileValue *= 2;
                console.log("went into doubleLetter from board");

            }
            curScore += tileValue;
            console.log("wordMultiplyTracker[dTileOnArray] is BOARD: ", wordMultiplyTracker[dTileOnArray]);
            if (wordMultiplyTracker[dTileOnArray] == '2') { // if placed on word multiplier
                curScore *= 2;
                console.log("went into doubleWord from board");
            }

            console.log('Dropped ' + draggableId + 'on' + droppableId);
            totalScore += curScore;
            $('#totalScore').text('Running Total Score: ' + totalScore);
            console.log("This is additioanl Score from BOARD: ", curScore);
          //  $('#curWordScore').text('Current Word Score: ' + curScore);
        }
    });


    $('#gridForRackAndPlayer').droppable({
        accept: '.draggable',
        drop: function (event, ui) {
            const draggableId = ui.draggable.attr('id');
            const droppableId = $(this).attr('id');
            const tileLetter = $('#' + draggableId).attr('letter'); 
            var tileValue = ScrabbleTiles[tileLetter]["value"];
            console.log("letterMultiplyTracker[dTileOnArray] is RACK: ", letterMultiplyTracker[dTileOnArray]);
            if (letterMultiplyTracker[dTileOnArray] == '2') {
                tileValue *= 2;
                console.log("went into doubleLetter from rack");
            }
            curScore -= tileValue;
            console.log("letterWordTracker[dTileOnArray] is RACK: ", wordMultiplyTracker[dTileOnArray]);
            if (wordMultiplyTracker[dTileOnArray] == '2') { //check the minus one index Only if it dTileOnArray >= 1
                //curScore /= 2; //does not work for odd numbers
                //tempScore /= 2;
                //curScore -= tempScore; //currently if the double word score is not taken off first then it will only take off the tile value and not do the multiplication factor
                curScore -= tileValue * 2;
            }
         //   console.log("This is additioanl Score from RACK: ", curScore);
            if (curScore <= 0) {
                curScore = 0;
            }
         //   $('#curWordScore').text('Current Word Score: ' + curScore);

        }
    });

});

$(function () {
    /*If the restart button is clicked this resets the game pieces to the amount that they original started with It also repalces the tiles in the players
    hand respectively it also resets the game board to allow for the user to place tiles back onto the board and have it calculate properly. */
    $('#restartButton').click(function () {
        for (var i in ScrabbleTiles) {
            ScrabbleTiles[i]["number-remaining"] = ScrabbleTiles[i]["original-distribution"];
        }

        for (var i = 1; i <= 7; i++) { //changed from i = 0 to i = 1
            var tileOnRack = $('#tile' + i);
            console.log('Tiles on rack: ' + randomTile);
            console.log('This is i count: ', i);

            var randomTile = randomTileGen();
            tileOnRack.attr('src', './alltiles/Scrabble_Tile_' + randomTile + '.jpg');
            tileOnRack.attr('letter', randomTile);
            tileOnRack.css({
                'position': 'absolute',
                'top': positionTop[i] + 'px',
                'left': positionLeft[i] + 'px',
                //'border': '4px solid red'
            });
            ScrabbleTiles[randomTile]["number-remaining"]--;
        }
        totalScore = 0;
        for (var i = 0; i < gameBoard.length; i++) { //resets the game board
            gameBoard[i] = null;
        }

        $('#totalScore').text('Running Total Score: ' + totalScore);

        // https://www.w3schools.com/jsref/met_loc_reload.asp
        //  location.reload(); //refreshes the entire page use This if not sorted out

    });

    /*Updates the current score so that the next round can be tracked properly works to replace on the necceary tiles from when
    a word is played (although sometimes not working proeprly see write up) */
    $('#nextButton').click(function () {
        curScore = 0;
        console.log("nextButtonClicked")
        $('#totalScore').text('Running Total Score: ' + totalScore);
      //  $('#curWordScore').text('Current Score: ' + curScore);
        for (var i = 1; i <= 7; i++) { //changed from i = 0 to i = 1
            var tileOnRack = $('#tile' + i);
            console.log('Tiles on rack: ' + randomTile);
            console.log('This is i count: ', i);
            if (gameBoard[i] === null) { //if still on rack
                tileOnRack.css({
                    'position': 'absolute',
                    'top': positionTop[i] + 'px',
                    'left': positionLeft[i] + 'px',
                    // 'border': '4px solid red'
                });
            }
            else { //if not on rack 
                var randomTile = randomTileGen();
                tileOnRack.attr('src', './alltiles/Scrabble_Tile_' + randomTile + '.jpg');
                tileOnRack.attr('letter', randomTile);
                tileOnRack.css({
                    'position': 'absolute',
                    'top': positionTop[i] + 'px',
                    'left': positionLeft[i] + 'px',
                    // 'border': '4px solid red'
                });
                ScrabbleTiles[randomTile]["number-remaining"]--;
            }
        }
        for (var i = 0; i < gameBoard.length; i++) { //resets the game board
            gameBoard[i] = null;
        }
    });
});

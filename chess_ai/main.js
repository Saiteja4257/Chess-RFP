let board;

let config = {
  position: 'start',
  showNotation: true,
  draggable: true,
  dropOffBoard: 'snapback',
  snapbackSpeed: 200,
  snapSpeed: 50
}

$(document).ready(function(){
  board = Chessboard('chessboard',config);

  $('#resetButton').on('click', function(){
    board.start(false); //false means instant snapback
  })
})
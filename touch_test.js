var canvas=createCanvas();
var context = canvas.getContext('2d');
function touchMove(touches, changedTouches, timestamp){
  if(!changedTouches.length){
      return;
  }

  var i = 0;
  context.fillStyle = 'red';
  context.clearRect(0, 0, canvas.width, canvas.height);
  for(; i < changedTouches.length; i++){
      var touchEvent = changedTouches[i];
        context.fillRect(touchEvent.screenX, touchEvent.screenY, 200, 200);
  }
};
onTouchMove(touchMove);
onTouchEnd(touchMove);
onTouchStart(touchMove);

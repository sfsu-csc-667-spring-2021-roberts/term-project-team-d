var notifyDiv;
var container = document.querySelector('#notify-container');
var visible = false;
var queue = [];

var sfx_errors = [];
var sfx_chat = [];
var sfx_notifs = [];

export function soundsInit(){
  sfx_errors = [
    new Audio('/sfx/error1.wav'),
    new Audio('/sfx/error2.wav'),
    new Audio('/sfx/error3.wav'),
    new Audio('/sfx/error4.wav'),
    new Audio('/sfx/error5.wav')
  ];

  sfx_notifs = [
    new Audio('/sfx/chat2.wav')
  ];

  sfx_chat = [
    new Audio('/sfx/chat1.wav')
  ];
}

function playSound(sfxGroup){
  let randIndex = Math.floor(Math.random() * sfxGroup.length);
  if(sfxGroup.length == 0) return;
  sfxGroup[randIndex].play();
}

/*
 * Note: This code is a modified version of this example:
 * https://codeconvey.com/css-notify-message-alert-boxes/
 */

/*
 * Construct a new notification div 
 * This is to be appended to queue, and eventually shown by the #notify-container
 */
export function notifyInit() {
    // Construct notifyDiv element
    notifyDiv = document.createElement('div');
    var btn = document.createElement('button');
    var title = document.createElement('div');
    var msg = document.createElement('div');
    notifyDiv.appendChild(title);
    notifyDiv.appendChild(msg);
    //notifyDiv.appendChild(btn);

    // Give them unique class names (for styling)
    title.className = 'notify-title';
    msg.className = 'notify-message';

    // Hook up 'hide' events
    notifyDiv.addEventListener('click', hide, false);
    /*notifyDiv.addEventListener('animationend', hide, false);
    notifyDiv.addEventListener('webkitAnimationEnd', hide, false);*/
}

/*
 * Replace main notify div with a new one 
 * This new notification is fed in via the queue 
 */
function update(type, title, message) {
    notifyDiv.className = 'notify notify-' + type;
    notifyDiv.querySelector('.notify-title').innerHTML = title;
    notifyDiv.querySelector('.notify-message').innerHTML = message;
}
 
/*
 * Hide current notification
 */
function hide() {
    if (!visible) return;
    visible = false;
    container.removeChild(notifyDiv);

    if (!queue.length) return; 

    notify.apply(null, queue.shift());
}

/*
 * Create a new notification object, append it to the queue.
 * Trigger the update and set it to be visible.
 */
export function notify(type, title, message) {
    if(type == 'err'){
      playSound(sfx_errors);
    }else if(type == 'chat'){
      playSound(sfx_chat);
    }else{
      playSound(sfx_notifs);
    }

    if (visible) {
        update(type, title, message);
        //queue.push([type, title, message]);
        return;
    }

    if (!notify) createnotify();

    update(type, title, message);
    container.appendChild(notifyDiv);
    visible = true;
}

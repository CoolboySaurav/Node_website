const logEvent = require('./logEvents');

const EventEmitter = require('events');

class Emitter extends EventEmitter {};

// create a new instance of the Emitter class
const myEmitter = new Emitter();

// add a listener for the 'log' event
myEmitter.on('log', (msg) => logEvent(msg));

setTimeout(() => {
    myEmitter.emit('log', 'This is an event log message');
}, 2000);
const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  // 7 tests here!

  it("constructor sets position and default values for mode and generatorWatts",function(){
   let rover = new Rover(87382098);
   expect(rover.position).toEqual(87382098)
   expect(rover.mode).toEqual('NORMAL')
   expect(rover.generatorWatts).toEqual(110);
  });
    
 it("response returned by receiveMessage contains name of message", function(){
    let commands= new Command ("MOVE")
    let message = new Message('New message.', commands);
    let rover = new Rover(message.commands.value);
    let response = rover.receiveMessage(message);
  expect(response.message).toEqual('New message.');
  }); 
  
 it("response returned by receiveMessage includes two results if two commands are sent in the message",function() {
   let commands =[new Command('MOVE'), new Command('STATUS_CHECK')];
   let message = new Message('New message.', commands);
   let rover = new Rover(message.commands.value);
   let response = rover.receiveMessage(message);
   expect(response.results.length).toEqual(2);
   });
   
 it("responds correctly to status check command",function(){
   let commands = [new Command('STATUS_CHECK')];
   let message = new Message('New message.', commands);
   let rover = new Rover(87382098);
   let response = rover.receiveMessage(message);
   let roverInfo = {mode: (rover.mode), generatorWatts: (rover.generatorWatts), position: (rover.position)};
   expect(response.results[0].roverStatus).toEqual(roverInfo)
 });
  
 it("responds correctly to mode change command",function(){
  let commands = [new Command('MODE_CHANGE')];
  let message = new Message('New message.', commands);
  let rover = new Rover(87382098);
  let response = rover.receiveMessage(message);
  expect(response.results.completed).toBeTrue;
  expect(rover.commands).toEqual(rover.mode);
});

  //Test this with random numbers
  it("responds with false completed value when attempting to move in LOW_POWER mode", function(){
   let commands = [new Command('MOVE', 150), new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE',500)];
    let message = new Message('New message.', commands);
    let rover = new Rover(message.commands.value);
    let response = rover.receiveMessage(message);
    expect(response.results[2].completed).toBeFalse;
    expect(rover.position).toEqual(150);
  });
  
  it("responds with position for move command", function(){
    let commands = [new Command('MOVE'), new Command('MOVE',87382098)];
    let message = new Message('New message.', commands);
    let rover = new Rover(message.commands.value);
    let response = rover.receiveMessage(message);
    expect(rover.position).toEqual(87382098);
    
  });
  it("Responds to TA message & commands", function() {
    let rover = new Rover(100);
    let commands = [
       new Command('MOVE', 4321),
       new Command('STATUS_CHECK'),
       new Command('MODE_CHANGE', 'LOW_POWER'),
       new Command('MOVE', 3579),
       new Command('STATUS_CHECK')
    ];
    let message = new Message('TA power', commands);
    let response = rover.receiveMessage(message);
    expect(response.message).toEqual('TA power');
    expect(response.results[0].completed).toBeTrue;
    expect(response.results[1].roverStatus.position).toEqual(4321);
    expect(response.results[2].completed).toBeTrue;
    expect(response.results[3].completed).toBeFalse;
    expect(response.results[4].roverStatus.position).toEqual(4321);
    expect(response.results[4].roverStatus.mode).toEqual('LOW_POWER');
    expect(response.results[4].roverStatus.generatorWatts).toEqual(110);
   });

});  

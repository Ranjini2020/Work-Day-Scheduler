
//Global Variable Declaration
var scheduleSection = $(".schedule");
var hourBlocks = $(".hourBar");

//Initializing an array to store the events for for local storage
//The array will store the value of 'hour' and 'task' of each hour
var events = [];

//Setting up the current data variable
var currentDate = moment().format("dddd, MMMM Do");
var currentTime = moment().format('LT');

//Setting up the current hour variable for the color code
var currentHour = moment().format("H");

$(document).ready(function() {

    //Set up the hour block with relevant colors
    colorTheHourBlocks();

    //Setting initial storage set-up process if the local storage does not have any stored events
    if(!localStorage.getItem("eventList")) {
    initialStorageSetup();

    }

    //Display current date at the top
    $("#currentDay").text(currentDate);
    $("#currentTime").text(currentTime);


    //Retrive and display the events data if already stored in local storage
    displayStoredEvents();

    //Setting up save/update events when 'save' button is clicked
    scheduleSection.on("click", "button", saveOrUpdateTheSchedule);

});

//Function to set up the initial data for each hour with empty task
function initialStorageSetup() {

    //Loop through each hour block in the DOM
    hourBlocks.each(function() {
        var thisHour = parseInt($(this).attr("hour"));
        var taskDetail = {hour: thisHour, task: ""}

        events.push(taskDetail);
    });

    //after adding initial data, it's stored in local storage, named "eventalist"
    localStorage.setItem("eventList", JSON.stringify(events));

}

//Function to set-up each hour block with relevant colors based on past/present/future timing
function colorTheHourBlocks() {

    //Loop through each hour block.
    hourBlocks.each(function() {
        var $thisBlock = $(this);
        var $thisHour = parseInt($thisBlock.attr("hour"));

        //If the hour of this block equals the actual current hour, 
        //remove past & future class of this block and add 'present' class 
        if ($thisHour == currentHour) {
            $thisBlock.removeClass("past future");
            $thisBlock.addClass("present");

        }

        if ($thisHour < currentHour) {
            $thisBlock.removeClass("present future");
            $thisBlock.addClass("past");

        }

        if ($thisHour > currentHour) {
            $thisBlock.removeClass("past present");
            $thisBlock.addClass("future");

        }

    });
}

//Function to retrieve and display the events data from local storage
function displayStoredEvents() {

    events = localStorage.getItem("eventList");
    events = JSON.parse(events);

    for (let i = 0; i < events.length; i++) {
        var thisBlockHour = events[i].hour;
        var thisBlockTask = events[i].task;

        //Update the textarea of this block to display the event data
        $("[hour=" + thisBlockHour + "]").children("textarea").val(thisBlockTask);
        
    }
}

//Function is called when clicking the 'save' button
function saveOrUpdateTheSchedule() {

    var $thisBlock =$(this).parent();
    var thisHour = $(this).parent().attr("hour");
    var thisTask = (($(this).parent()).children("textarea")).val();

    //Loop to find the item to be updated based on the hour of the button clicked
    for (let j = 0; j < events.length; j++) {
        if (events[j].hour == thisHour) {
            events[j].task = thisTask;
        } 
    }

    //Update the eventList data in local storage
    localStorage.setItem("eventList", JSON.stringify(events));
    displayStoredEvents();
}
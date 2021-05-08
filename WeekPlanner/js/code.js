const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const day_secs = 86400000;
let week = [
    {id:0, day:getNextDay(0), isToday:true},
    {id:1, day:getNextDay(1)},
    {id:2, day:getNextDay(2)},
    {id:3, day:getNextDay(3)},
    {id:4, day:getNextDay(4)},
    {id:5, day:getNextDay(5)},
    {id:6, day:getNextDay(6)}
];
window.onload = () => {
    console.log("Loadin forever more fun ^^");
    
    for (day of week) {
        $('#day_' + (day.id + 1) + '_title').text(day.day);
        if (day.isToday) 
        $('#day_' + (day.id + 1) + '_title').after('<span>(Today)</span>')
    }
}

function getNextDay(add) {
    let today = new Date();
    return weekdays[new Date(today.getTime() + (add * day_secs)).getDay()]; 
}

function addTask() {
    console.log("Adding fun!");
}
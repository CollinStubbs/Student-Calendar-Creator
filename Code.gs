function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('LS Calendar')
  .addItem('Create Calendar', 'create')
  .addItem('Delete Calendar', 'erase')
  .addToUi();
  //console.log("test1");
}

function create(){
  var ss = SpreadsheetApp.getActive();
  var dataSheet = ss.getSheetByName("data"); 
  
  var dataValues = dataSheet.getDataRange().getDisplayValues();
  var calendarName = 0;
  var firstDay = 0;
  var lastDay = 0;
  var days = 0;
  var regularPeriods = dataSheet.getRange("A3:E9").getValues();
  for(var i = 0; i<dataValues.length; i++){
    if(dataValues[i][0] == "First Day"){
      firstDay = dataValues[i][1]; 
    }
    if(dataValues[i][0] == "Last Day"){
      lastDay = dataValues[i][1];
      
    }
    if(dataValues[i][0] == "Calendar Name"){
     calendarName = dataValues[i][1]; 
      break;
    }
    if(dataValues[i][0] == "Days in Schedule"){
     days = Number(dataValues[i][1]); 
    }
  }
  
var calendar = CalendarApp.createCalendar(calendarName, {
   summary: 'A calendar to organize students with periods in the Student Centre.',
   color: CalendarApp.Color.BLUE
 });  
  
  setDays(days, new Date(firstDay),
     new Date(lastDay), calendar);
  
  var event = calendar.createEvent('Apollo 11 Landing',
     new Date('April 17, 2018 20:00:00 EST'),
     new Date('April 17, 2018 21:00:00 EST'));
  
}
function setDays(days, start, end, calendar){
  
  // Returns an array of dates between the two dates --- from miguelmota on github
var getDates = function(start, end) {
  var dates = [],
      currentDate = startDate,
      addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};
  
  for(var i = 0; i<getDates.length; i++){
    if(getDates[i].getDay() != 0 && getDates[i].getDay() != 6){
      //monday-friday
      //dayoffcheck
      //get school day
      //create event   calendar.createAllDayEvent("Day "+day, date);
    }
  }
}
function createEvents(calendar, regularPeriods, friPeriods){
  
}


function erase(){
  var calendar = CalendarApp.getCalendarsByName("Learning Strategies Students")[0];
  calendar.deleteCalendar();
}
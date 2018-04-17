function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('LS Calendar')
  .addItem('Create Calendar', 'create')
  .addItem('Delete Calendar', 'erase')
  .addItem('Add Students', 'addStudents')
  .addToUi();
}

function create(){
  var ss = SpreadsheetApp.getActive();
  var dataSheet = ss.getSheetByName("data"); 
  
  var dataValues = dataSheet.getDataRange().getDisplayValues();
  var calendarName = 0;
  var firstDay = 0;
  var lastDay = 0;
  var days = 0;
  var noSchool = [];
  for(var i = 0; i<dataValues.length; i++){
    if(dataValues[i][0] == "First Day"){
      firstDay = dataValues[i][1]; 
    }
    if(dataValues[i][0] == "Last Day"){
      lastDay = dataValues[i][1];
      
    }
    if(dataValues[i][0] == "Calendar Name"){
      calendarName = dataValues[i][1]; 
      
    }
    if(dataValues[i][0] == "Days in Schedule"){
      days = Number(dataValues[i][1]); 
    }
    if(dataValues[i][0] == "No School"){
      for(var j = 1; j< dataValues[i].length; j++){
        if(dataValues[i][j] == ""){      
          break;
        }
        else{
          noSchool.push(new Date(dataValues[i][j])); 
        }
      }
      break;
    }
  }
  
  
  
  var calendar = CalendarApp.createCalendar(calendarName, {
    summary: 'A calendar to organize students with periods in the Student Centre.',
    color: CalendarApp.Color.BLUE
  });  
  
  setDays(days, new Date(firstDay),
          new Date(lastDay), calendar, noSchool);
  
  // var event = calendar.createEvent('Apollo 11 Landing',
  //  new Date('April 17, 2018 20:00:00 EST'),
  //   new Date('April 17, 2018 21:00:00 EST'));
  
}

function setDays(days, start, end, calendar, noSchool){
  
  var day = 1;
  // Returns an array of dates between the two dates --- from miguelmota on github
  var getDates = function(startDay, endDay) {
    var dates = [],
        currentDate = startDay,
        addDays = function(days) {
          var date = new Date(this.valueOf());
          date.setDate(date.getDate() + days);
          return date;
        };
    while (currentDate <= endDay) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
  };
  var dates = getDates(start, end);
  
  for(var i = 0; i<dates.length; i++){
    if(dates[i].getDay() != 0 && dates[i].getDay() != 6 ){
      if(!NSCheck(noSchool, dates[i])){
        calendar.createAllDayEvent("Day "+day, dates[i]);
        if(day ==8){
          day = 1; 
        }
        else{
          day++; 
        }
        //monday-friday
        //dayoffcheck
        //get school day
      }
    }
  }
}
function NSCheck(noSchool, date){
  var check = false;
  for(var i = 0; i<noSchool.length; i++){
    if(date.toDateString() == noSchool[i].toDateString()){
      check = true;
    }
  }
  return check;
}


function addStudents(){
  var ss = SpreadsheetApp.getActive();
  var dataSheet = ss.getSheetByName("data"); 
  var dataValues = dataSheet.getDataRange().getValues();
  var sheets = ss.getSheets();
  var calendarName = 0;
  var firstDay = 0;
  var lastDay = 0;
  var days = 0;
  var regularPeriods = dataSheet.getRange("A3:E9").getDisplayValues();
  
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
  }
  
  //track old and new students somehow
  for(var i = 0; i<sheets.length; i++){
    if(sheets[i].getName() != "data"){
     var name = sheets[i].getName();
     var studentSheet = sheets[i].getDataRange().getValues();
      var studentSched = [];
      
      for(var j = 1; j< studentSheet.length; j++){
         console.log(studentSheet[j][0]);
        if(studentSheet[j][0] == "Schedule Day"){
        }else if(studentSheet[j][0] == ""){
          break;
        }
        else{
         studentSched.push([studentSheet[j][0], studentSheet[j][1]]); 
        }
      }
      console.log(studentSched);
    }
    
    
  }
  
}

function createEvents(studentName, studentSched, firstDay, lastDay, calendar){
  
}

function erase(){
  var calendar = CalendarApp.getCalendarsByName("Learning Strategies Students")[0];
  calendar.deleteCalendar();
}
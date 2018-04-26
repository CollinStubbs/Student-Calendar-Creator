function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('LS Calendar')
  .addItem('Create Calendar', 'create')
  .addItem('Delete Calendar', 'erase')
  .addItem('Add Students', 'addStudents')
  .addItem('Clear Student', 'clearStudent')
  .addItem('Clear Full Range', 'clearAll')
  .addItem('New School Year', 'newSchoolYear')
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
    if(dataValues[i][0] == "First Day (Day 1)"){
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
   
}
function newSchoolYear(){
  var ss = SpreadsheetApp.getActive();
  var dataSheet = ss.getSheetByName("data"); 
  
  var dataValues = dataSheet.getDataRange().getDisplayValues();
  var calendarName = 0;
  var firstDay = 0;
  var lastDay = 0;
  var days = 0;
  var noSchool = [];
  for(var i = 0; i<dataValues.length; i++){
    if(dataValues[i][0] == "First Day (Day 1)"){
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
  
  
  
  var calendar = CalendarApp.getCalendarsByName(calendarName)[0];
  
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
  var dataValues = dataSheet.getDataRange().getDisplayValues();
  var sheets = ss.getSheets();
  var calendarName = 0;
  var firstDay = 0;
  var lastDay = 0;
  var days = 0;
  var periodsRange = 0;
  
  
  for(var i = 0; i<dataValues.length; i++){
    if(dataValues[i][0] == "First Day (Day 1)"){
      firstDay = dataValues[i][1]; 
    }
    if(dataValues[i][0] == "Last Day"){
      lastDay = dataValues[i][1];      
    }
    if(dataValues[i][0] == "Calendar Name"){
      calendarName = dataValues[i][1]; 
      break;
    }   
    if(dataValues[i][0] == "Schedule Range"){
      periodsRange = dataValues[i][1]; 
    }
  }
  
  var regularPeriods = dataSheet.getRange(periodsRange).getDisplayValues(); 
  
  for(var i = 0; i<sheets.length; i++){
    if(sheets[i].getName() != "data"){
      var name = sheets[i].getRange(1,1).getDisplayValue();
      var studentSheet = sheets[i].getDataRange().getValues();
      var studentSched = [];
      
      for(var j = 1; j< studentSheet.length; j++){
        // console.log(studentSheet[j][0]);
        if(studentSheet[j][0] == "Schedule Day"){
        }else if(studentSheet[j][0] == ""){
          break;
        }
        else{
          studentSched.push([studentSheet[j][0], studentSheet[j][1]]); 
        }
      }
      // console.log(studentSched);
      createEvents(name, studentSched, new Date(firstDay), new Date(lastDay), CalendarApp.getCalendarsByName(calendarName)[0], regularPeriods);
    }
    
    
  }
  
}
function createEvents(studentName, studentSched, firstDay, lastDay, calendar, periods){
  console.log(calendar.getColor());
  var dateRange = getDates(firstDay, lastDay);
  //console.log(periods);
  for(var i = 0; i < dateRange.length; i++){
    var event = calendar.getEventsForDay(dateRange[i], {search: "day"})[0];
    if(event != undefined){
      for(var j = 0; j<studentSched.length; j++){
        var dayString = "Day "+studentSched[j][0];
        if(event.getTitle() == dayString){
          if(studentSched[j][1].indexOf(',') > -1){
            var schedHolder = studentSched[j][1].split(',');
            for(var k = 0; k<schedHolder.length; k++){
              addToCalendar(periods, schedHolder[k].trim(), studentName, calendar, dateRange[i]);
            }
          }else{
            addToCalendar(periods, studentSched[j][1], studentName, calendar, dateRange[i]);
          }
        }
      }
    }
  }
}

function addToCalendar(periods, lsPeriod, name, calendar, date){
  for(var i = 0; i<periods.length; i++){
    console.log(periods[i][0], lsPeriod);
    if(date.getDay() != 5){
      if(periods[i][0] == lsPeriod){
        var temp = calendar.createEvent("LS - "+name, new Date(date.toDateString()+" "+periods[i][1]), new Date(date.toDateString()+" "+ periods[i][2])); 
        temp.setColor("10");
      }
    }
    else{
      if(periods[i][0] == lsPeriod){
        var temp = calendar.createEvent("LS - "+name, new Date(date.toDateString()+" "+periods[i][3]), new Date(date.toDateString()+" "+ periods[i][4])); 
        temp.setColor("10");
      }
    }
  }
}

function getDates(startDate, stopDate) {
  Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
  }
  
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date (currentDate));
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

function clearStudent(){
  var ss = SpreadsheetApp.getActive();
  var dataSheet = ss.getSheetByName("data"); 
  var dataValues = dataSheet.getDataRange().getDisplayValues();
  var calendarName = 0;
  var name = 0;
  var sDate = 0;
  var eDate = 0;
  for(var i = 0; i<dataValues.length; i++){
    if(dataValues[i][0] == "Student to Clear"){
      name = dataValues[i][1]; 
    }
    if(dataValues[i][0].indexOf("Beginning of Clear Range")>-1){
      sDate = dataValues[i][1]; 
    }
    if(dataValues[i][0] == "End of Clear Range"){
      eDate = dataValues[i][1];      
       break;
    }
    if(dataValues[i][0] == "Calendar Name"){
      calendarName = dataValues[i][1]; 
     
    }   
  }
  var calendar = CalendarApp.getCalendarsByName(calendarName)[0];
  
  
  var dateRange = getDates(new Date(sDate), new Date(eDate));
  
  
  for(var i = 0; i < dateRange.length; i++){
    
    var event = calendar.getEventsForDay(dateRange[i], {search: name}); // look at the console data for this, nothing is read
    
    for(var j = 0; j<event.length; j++){
      event[j].deleteEvent();
    }
  }
}

function clearAll(){
  var ss = SpreadsheetApp.getActive();
  var dataSheet = ss.getSheetByName("data"); 
  var dataValues = dataSheet.getDataRange().getDisplayValues();
  var calendarName = 0;
  var sDate = 0;
  var eDate = 0;
  
  for(var i = 0; i<dataValues.length; i++){
    if(dataValues[i][0] == "Beginning of Clear Range"){
      sDate = dataValues[i][1]; 
    }
    if(dataValues[i][0] == "End of Clear Range"){
      eDate = dataValues[i][1];      
      break;
    }
    if(dataValues[i][0] == "Calendar Name"){
      calendarName = dataValues[i][1]; 
      
    }   
  }
  
  var calendar = CalendarApp.getCalendarsByName(calendarName)[0];
  
  
  var dateRange = getDates(new Date(sDate), new Date(eDate));
  console.log(sDate, eDate);
  
  for(var i = 0; i < dateRange.length; i++){
    var event = calendar.getEventsForDay(dateRange[i], {search: "LS"});
    for(var j = 0; j<event.length; j++){
      event[j].deleteEvent();
    }
  }
}

function erase(){
  var ss = SpreadsheetApp.getActive();
  var dataSheet = ss.getSheetByName("data"); 
  var dataValues = dataSheet.getDataRange().getDisplayValues();
  var calendarName = 0;
  
  
  for(var i = 0; i<dataValues.length; i++){
    if(dataValues[i][0] == "Calendar Name"){
      calendarName = dataValues[i][1]; 
      break;
    }   
  }
  
  var calendar = CalendarApp.getCalendarsByName(calendarName)[0];
  calendar.deleteCalendar();
}
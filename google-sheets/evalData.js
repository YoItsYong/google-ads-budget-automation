function evalData() {
    //Create variables for each spreadsheet being used
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet(); //change to open by URL
    var bulk = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1UUbW79QLEpoOkjMz-YKqxJ25Tyi7zNg6W7BMWy-YTJk/edit?usp=sharing')
    
    var btSheet = spreadsheet.getSheetByName('currentMonth');
    var mtdSheet = spreadsheet.getSheetByName('MTD Src');
    
    //Create date variables
    var date = new Date();
    var endMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var firstNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    
    //Daily spend ranges in Budget Tracker Sheet
    const budget = btSheet.getRange('B4');
    const DS_Range = btSheet.getRange('C4');
    const tDS_Range = btSheet.getRange('E4');
    
    //Target cell ranges in Bulk Upload Template
    const bulkCampID = bulk.getRange('D3');
    const bulkBudget = bulk.getRange('G3');
    const bulkAction = bulk.getRange('A3:A100');
    const bulkCustomerID = bulk.getRange('B3:B100');
    
    //Gets values of daily spend in Budget Tracker Sheet
    const mtdDailySpend = DS_Range.getValue();
    const targetDailySpend = tDS_Range.getValue().toFixed(2);
    
    //Check date and adjust formula for end of month
    var formattedEndMonth = endMonth.toLocaleDateString('en-US');
    var formattedDate = date.toLocaleDateString('en-US');
    var formattedNextMonth = firstNextMonth.toLocaleDateString('en-US');
    
    console.log(`Today's date is ${formattedDate} and the target end date is ${formattedEndMonth}.`)
        
    // Changes cell query formula based on date in current month
    if (formattedDate == formattedEndMonth) { // If today is last day of month...
      console.log('Reaching the end of the month...Creating adjusted query.');
      var dateQuery = `=(B4-D4)/DAYS("${formattedNextMonth}", TODAY())`
      tDS_Range.setValue(dateQuery);
    } else { // If no last day of month...
      console.log('Still in the middle of the month...Keeping default query.');
      var dateQuery = `=(B4-D4)/DAYS("${formattedEndMonth}", TODAY())`
      tDS_Range.setValue(dateQuery);
    }
    
    // Create query formula strings
    var qSrcRange = '"MTD Src!A2:F"'
    var srcURL = '"1a0WDKqj42RGcI5Rz8ngx5rXwyQDAOUqfg6T_Djw4-Ss"'
    var qCampID = `=QUERY(importrange(${srcURL}, ${qSrcRange}), "SELECT Col1 WHERE Col6 != TRUE AND Col2 = TRUE")`;
    
    // Sets query formula in Bulk Upload Template
    function changeBudgets() {
      var qbulkBudget = `=QUERY(importrange(${srcURL}, ${qSrcRange}), "SELECT Col5/${mtdDailySpend}*${targetDailySpend} WHERE Col6 != TRUE AND Col2 = TRUE LABEL(Col5/${mtdDailySpend}*${targetDailySpend})''")`;
      var action = `=IF(D3:D100 = "", "", "Edit")`;
      var customerID = `=IF(D3:D100 = "", "", "994-525-1499")`;
      bulkCampID.setFormula(qCampID);
      bulkBudget.setFormula(qbulkBudget);
      bulkAction.setFormula(action);
      bulkCustomerID.setFormula(customerID);
    }
    
    // If current month-to-date spend is greater than target daily spend...
    if (mtdDailySpend > targetDailySpend) {
      changeBudgets();
      console.log('Budget decreased.')
    // If current month-to-date spend is more than $2 lower than target daily spend...
    } else if (mtdDailySpend < Number(targetDailySpend) - 2) {
        changeBudgets();
        console.log('Budget increased.')
    }
    }
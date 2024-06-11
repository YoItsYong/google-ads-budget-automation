function main() {
    const spreadsheetURL = 'link/to/google/sheets';
    const spreadSheet = SpreadsheetApp.openByUrl(spreadsheetURL);
    const sheetName = spreadSheet.getSheetByName('MTD Src');

    var sheetArray = [['Campaign ID', 'Enabled?', 'Campaign', 'MTD Cost', 'Current Daily Spend', 'Is Experiment?']];

    // Gets Google Ads data for each campaign type
    var searchCamp = AdsApp.campaigns()
        .withCondition('Cost > 0')
        .forDateRange('THIS_MONTH')
        .get();

    var pmaxCamp = AdsApp.performanceMaxCampaigns()
        .withCondition('Cost > 0')
        .forDateRange('THIS_MONTH')
        .get();
  
    var videoCamp = AdsApp.videoCampaigns()
        .withCondition('Cost > 0')
        .forDateRange('THIS_MONTH')
        .get();

    var shoppingCamp = AdsApp.shoppingCampaigns()
        .withCondition('Cost > 0')
        .forDateRange('THIS_MONTH')
        .get();
    
    var budgetSelector = AdsApp
        .budgets()
        .withCondition('Cost > 0')
        .forDateRange('THIS_MONTH');

    // Loop through active campaigns in each campaign type and get data for each
    var budgetIterator = budgetSelector.get();
    while (budgetIterator.hasNext()) {
        var budget = budgetIterator.next();
    }

    while (searchCamp.hasNext()) {
        var campaign = searchCamp.next();
        sheetArray.push([
            campaign.getId(),
            campaign.isEnabled(),
            campaign.getName(),
            campaign.getStatsFor('THIS_MONTH').getCost().toFixed(2),
            campaign.getBudget().getAmount().toFixed(2),
            campaign.isExperimentCampaign(),
        ]);
    }

    while (pmaxCamp.hasNext()) {
        var campaign = pmaxCamp.next();
        sheetArray.push([
            campaign.getId(),
            campaign.isEnabled(),
            campaign.getName(),
            campaign.getStatsFor('THIS_MONTH').getCost().toFixed(2),
            campaign.getBudget().getAmount().toFixed(2),
            campaign.getEntityType(),
        ]);
    }

    while (videoCamp.hasNext()) {
        var campaign = videoCamp.next();
        sheetArray.push([
            campaign.getId(),
            campaign.isEnabled(),
            campaign.getName(),
            campaign.getStatsFor('THIS_MONTH').getCost().toFixed(2),
            campaign.getBudget().getAmount().toFixed(2),
            campaign.getEntityType(),
        ]);
    }
  
    while (shoppingCamp.hasNext()) {
        var campaign = shoppingCamp.next();
        sheetArray.push([
            campaign.getId(),
            campaign.isEnabled(),
            campaign.getName(),
            campaign.getStatsFor('THIS_MONTH').getCost().toFixed(2),
            campaign.getBudget().getAmount().toFixed(2),
            campaign.getEntityType(),
        ]);
    }

    Logger.log(sheetArray);

    // Clear data in destination Google Sheet and dump new data into spreadsheet
    if (sheetArray.length > 0) {
        sheetName.getRange('A2:F100').clearContent()
        console.log('data cleared');
        sheetName.getRange(1, 1, sheetArray.length, sheetArray[0].length).setValues(sheetArray);
    }

}
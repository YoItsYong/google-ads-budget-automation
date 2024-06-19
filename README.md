# Google Ads Budget Automation
This is an overview of the process I implementd for automating Google Ads budget pacing throughout the month.

Sticking to a clients' budgets is key to the success of any agency. How much a campaign can spend can flucatuate depending on a wide variety of factors including the time of day, how much competition is present for a given keyword, etc.

Because of this, I used a combination of **Javascript and SQL** to find a way to automatically evaluate and update budgets daily, saving myself time to put towards larger tasks.

## How It Works
Budgets are shifted up or down in proportion to to how much of the total budget each campaign is used.

For example, if a campaign was using $30 out of a $100 budget, the adjusted budget would still maintain 30% of the new target budget.

To do this, data is passed from Google Ads, to Google Sheets, and is then re-uploaded to Google Ads using a Bulk Upload template.

The diagram below outlines the basic pipeline for how data is extracted, processed, and loaded back to the source.

![Diagram of how data is passed between Google Ads and Google Sheets, using Javascript and SQL.] (/images/budget_pacing_diagram.png)

### 1. Extracting Data from Google Ads
The first step involves pulling data from Google Ads and moving it to Google Sheets. To do this, `getData.js` runs every day to pull performance data for each of the active campaigns across each campaign type.

### 2. Processing Data in Google Sheets
Next, we analyze the data in Google Sheets. Google makes it easy to inject Javascript to simplify a lot of this analysis.

Data is dumped into one sheet and then Google Sheets' built-in `=QUERY` formula function is used to select and filter for the desiered columns. An example of this can be found in `queryData.sql`.

The `evalData.js` code looks at the current daily spend (how much each campaign is spending)and the month-to-date spend and compares it to the target monthly budget.

If budgets need to be adjusted, a new target daily spend is calculated and data is then passed on to the Bulk Upload template.

### 3. Uploading Adjusted Budgets
Once data is passed to the Bulk Upload template, the `uploadData.js` script then uploads the adjusted budget data back to Google Ads.
function main() {
    const URL = 'link/to/google/sheets'
  function bulkUpload(){
    // Built-in methods for opening Google Sheet and selecting cell range
    const spreadSheet = SpreadsheetApp.openByUrl(URL);
    const sheet = spreadSheet.getActiveSheet();
    const range = sheet.getRange('A3:G')
    
    // Set file up as Bulk Upload file
    const upload = AdsApp.bulkUploads().newFileUpload(sheet);
    upload.forCampaignManagement();
    
    // Apply and clear selected cell range
    upload.apply();
    range.clearContent();
  }
  
  bulkUpload();
}
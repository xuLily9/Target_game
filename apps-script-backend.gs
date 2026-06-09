/**
 * Google Apps Script backend for saving team submissions and results.
 *
 * Deploy this file as a Web App and paste the published URL into app.js BACKEND_URL.
 *
 * The doPost() endpoint saves raw team planning inputs into a "Submissions" sheet,
 * and writes a matching row into "Team Results" for later Google Sheet logic.
 */

function doPost(e) {
  try {
    const requestBody = parseRequestBody(e);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    const submissionsSheet = getOrCreateSheet(spreadsheet, "Submissions", [
      "Timestamp",
      "Session ID",
      "Team ID",
      "Team Name",
      "Participants",
      "Strategy",
      "Workers",
      "Basic Robots",
      "Advanced Robots",
      "Multi-Robot Systems",
      "Submission Type",
    ]);

    const teamResultsSheet = getOrCreateSheet(spreadsheet, "Team Results", [
      "Timestamp",
      "Session ID",
      "Team ID",
      "Team Name",
      "Strategy",
      "Workers",
      "Basic Robots",
      "Advanced Robots",
      "Multi-Robot Systems",
      "Total Cost",
      "Capacity",
      "Robot Capacity Share",
      "HRC Strategy Fit",
      "Productivity",
      "Operational Safety",
      "Manual Physical Effort Reduction",
      "Round 1 Eligible",
      "Round 2 Eligible",
      "Final Status",
    ]);

    const timestamp = new Date();
    submissionsSheet.appendRow([
      timestamp,
      requestBody.sessionId,
      requestBody.teamId,
      requestBody.teamName,
      requestBody.participants,
      requestBody.strategy,
      requestBody.workers,
      requestBody.basicRobots,
      requestBody.advancedRobots,
      requestBody.multiRobotSystems,
      requestBody.submissionType,
    ]);

    // The backend writes a row into Team Results.
    // If you have formulas in the sheet, use them to calculate the official values.
    // For now the script writes raw inputs and leaves metric columns for sheet formulas.
    teamResultsSheet.appendRow([
      timestamp,
      requestBody.sessionId,
      requestBody.teamId,
      requestBody.teamName,
      requestBody.strategy,
      requestBody.workers,
      requestBody.basicRobots,
      requestBody.advancedRobots,
      requestBody.multiRobotSystems,
      "", // Total Cost placeholder
      "", // Capacity placeholder
      "", // Robot Capacity Share placeholder
      "", // HRC Strategy Fit placeholder
      "", // Productivity placeholder
      "", // Operational Safety placeholder
      "", // Manual Physical Effort Reduction placeholder
      "", // Round 1 Eligible placeholder
      "", // Round 2 Eligible placeholder
      requestBody.submissionType === "Final" ? "Submitted" : "Draft",
    ]);

    const result = {
      ok: true,
      message: requestBody.submissionType === "Final" ? "Final submission saved." : "Draft saved successfully.",
      teamId: requestBody.teamId,
      savedAt: timestamp.toISOString(),
      resultData: {
        strategy: requestBody.strategy,
        workers: requestBody.workers,
        basicRobots: requestBody.basicRobots,
        advancedRobots: requestBody.advancedRobots,
        multiRobotSystems: requestBody.multiRobotSystems,
      },
    };

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    const result = {
      ok: false,
      message: error.message || "Submission failed.",
      teamId: null,
      savedAt: null,
    };
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }
}

function parseRequestBody(e) {
  if (!e.postData || !e.postData.contents) {
    throw new Error("No POST data received.");
  }
  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    throw new Error("Unable to parse JSON POST data.");
  }
}

function getOrCreateSheet(spreadsheet, sheetName, headers) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  const lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.appendRow(headers);
  } else {
    const existingHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    const needsHeaders = headers.some((header, index) => existingHeaders[index] !== header);
    if (needsHeaders) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  return sheet;
}

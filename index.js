const fs = require('fs');
const readline = require('readline');
const {
  google
} = require('googleapis');

const GOOGLE_SPREADSHEET = require('./constants');

// If modifying these scopes, delete token.json.
const SCOPES = GOOGLE_SPREADSHEET.SCOPE;
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = GOOGLE_SPREADSHEET.TOKEN_PATH;

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  // authorize(JSON.parse(content), getNetWorth);
  authorize(JSON.parse(content), updateCell);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {
    client_secret,
    client_id,
    redirect_uris
  } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the total net worth cell:
 * @see https://docs.google.com/spreadsheets/d/1fgq8ImKrWsrpYUj7gSndnQ4CPyyG7sBUx0JPePh5pJA/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function getNetWorth(auth) {
  const sheets = google.sheets({
    version: 'v4',
    auth
  });
  sheets.spreadsheets.values.get({
    spreadsheetId: GOOGLE_SPREADSHEET.ID,
    range: GOOGLE_SPREADSHEET.NET_WORTH_TOTAL,
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      console.log('Total Net Worth:');
      rows.map((row) => {
        console.log(`${row[0]}`);
      });
    } else {
      console.log('No data found.');
    }
  });
}

function updateCell(auth) {
  var sheets = google.sheets('v4');
  var request = {
    spreadsheetId: GOOGLE_SPREADSHEET.ID,
    range: GOOGLE_SPREADSHEET.RANDOM,
    valueInputOption: GOOGLE_SPREADSHEET.USER_ENTERED,
    resource: {
      values: [
        [Math.random() * 100]
      ],
    },
    auth,
  };

  sheets.spreadsheets.values.update(request, function (err, response) {
    if (err) {
      console.error(err);
      return;
    }
    // var result = response.result;
    console.log(response.data);
    // console.log(`${response} cells updated.`);
  });
};
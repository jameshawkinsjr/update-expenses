const GOOGLE_SPREADSHEET = {
    SCOPE: ['https://www.googleapis.com/auth/spreadsheets'],
    TOKEN_PATH: 'token.json',
    // Spreadsheet ID
    ID: '1fgq8ImKrWsrpYUj7gSndnQ4CPyyG7sBUx0JPePh5pJA',
    USER_ENTERED: 'USER_ENTERED',

    // Cells
    LIQUID_TOTAL: 'Expenses!J22',
    ILLIQUID_TOTAL: 'Expenses!J33',
    NET_WORTH_TOTAL: 'Expenses!J35',
    RANDOM: 'Expenses!J3',
};

module.exports = GOOGLE_SPREADSHEET;
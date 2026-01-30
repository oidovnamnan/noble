const fs = require('fs');

const emailsMap = {
    'Simon Fraser University (SFU)': 'partners@sfu.ca',
    'University of Auckland': 'int-marketing@auckland.ac.nz',
    'University of Canterbury': 'international@canterbury.ac.nz',
    'Lincoln University': 'international@lincoln.ac.nz',
    'IPU New Zealand': 'recruitment@ipu.ac.nz',
    'NZLC (Language Centres)': 'amandaw@nzlc.ac.nz',
    'Languages International': 'brett@languages.ac.nz',
    'Education Planner': 'anna@educationplanner.ca',
    'Toronto Metropolitan University (TMU)': 'international@torontomu.ca',
    'Vancouver Island University (VIU)': 'worldviu@viu.ca',
    'Niagara College Canada': 'international@niagaracollege.ca',
    'George Brown College': 'international@georgebrown.ca',
    'English Teaching College (ETC)': 'peggy@etc.ac.nz',
    'University of Manitoba': 'international@umanitoba.ca',
    'University Canada West (UCW)': 'international@ucanwest.ca',
    'McMaster University': 'international@mcmaster.ca',
    'Red River College Polytechnic': 'international@rrc.ca',
    'Sault College': 'international@saultcollege.ca',
    'Canadore College': 'agent.relations@canadorecollege.ca',
    'University of Otago': 'international.marketing@otago.ac.nz',
    'Otago Polytechnic': 'cameron.james-pirie@op.ac.nz',
    'Fanshawe College': 'international@fanshawec.ca',
    'Algoma University': 'international@algomau.ca',
    'Centennial College': 'seasia@centennialcollege.ca',
    'AUT New Zealand': 'international.agents@aut.ac.nz',
    'University of Waikato': 'partnership.enquiries@waikato.ac.nz'
};

const csvPath = '/Users/suren/Noble/noble-app/school_partnerships.csv';
const content = fs.readFileSync(csvPath, 'utf-8');
const lines = content.split('\n');

const header = lines[0].split(',');
header.push('Email');
const newLines = [header.join(',')];

for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Better CSV split that handles quotes
    const row = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    // Find which column contains a known school name
    let foundEmail = '';
    for (const col of row) {
        const cleanCol = col.replace(/"/g, '').trim();
        if (emailsMap[cleanCol]) {
            foundEmail = emailsMap[cleanCol];
            break;
        }
    }

    row.push(foundEmail);
    newLines.push(row.join(','));
}

fs.writeFileSync(csvPath, newLines.join('\n'), 'utf-8');
console.log('CSV updated with emails.');

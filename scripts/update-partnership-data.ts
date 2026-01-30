import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Defensive init
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        } as any),
    });
}

const db = admin.firestore();

const emailsMap: Record<string, string> = {
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

async function updateFirestore() {
    console.log('--- Updating Firestore Partnerships ---');
    const snapshot = await db.collection('partnerships').get();

    let updatedCount = 0;
    for (const doc of snapshot.docs) {
        const data = doc.data();
        const schoolName = data.name;

        const foundEmail = emailsMap[schoolName];
        if (foundEmail && (!data.contactEmail || data.contactEmail !== foundEmail)) {
            await doc.ref.update({
                contactEmail: foundEmail,
                updatedAt: new Date()
            });
            console.log(`Updated ${schoolName} -> ${foundEmail}`);
            updatedCount++;
        }
    }
    console.log(`Firestore update complete. ${updatedCount} records updated.`);
}

async function updateCSV() {
    console.log('--- Updating Local CSV ---');
    const csvPath = '/Users/suren/Noble/noble-app/school_partnerships.csv';
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n');

    if (lines.length === 0) return;

    // Check if Email column exists
    const header = lines[0].split(',');
    let emailIdx = header.indexOf('Email');
    if (emailIdx === -1) {
        header.push('Email');
        lines[0] = header.join(',');
        emailIdx = header.length - 1;
    }

    const newLines = [lines[0]];
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Simple CSV split
        const schoolName = row[2]?.trim(); // Assuming 3rd column is school name

        const foundEmail = emailsMap[schoolName] || '';

        // Pad row if needed
        while (row.length < header.length) {
            row.push('');
        }

        row[emailIdx] = foundEmail;
        newLines.push(row.join(','));
    }

    fs.writeFileSync(csvPath, newLines.join('\n'), 'utf-8');
    console.log('CSV update complete.');
}

async function run() {
    try {
        await updateFirestore();
        await updateCSV();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();

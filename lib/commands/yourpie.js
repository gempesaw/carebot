import http from '~/lib/http';
export { claimYourpieDeal, getYourpieLink };

async function claimYourpieDeal(event, req = http) {
    const email = parseEmail(event);
    if (! email) {
        return Promise.resolve('Please provide an email, like `.yourpie email@example.org`');
    }
    const url = getYourpieLink(email);

    await req.get(url);
    let response = await req.get(url);
    if (isDealClaimed(response)) {
        return Promise.resolve(`All right, we claimed your [YourPie deal](${url}).`);
    }
    else {
        return Promise.resolve(`Hm, something went wrong; perhaps [try the link](${url}) yourself?`);
    }
}

claimYourpieDeal.description = 'Redeem your $3 discount at yourpie; accepts one argument: your YourPie account email address';

function getYourpieLink(email) {
    const url = `https://www.thelevelup.com/claim_for_user?cohort_code=HDFTYZIPJB&email=${email}`;
    return url;
}

function parseEmail(event) {
    const [command, email] = event.content.split(/\s+/);
    return email;
}

function isDealClaimed(response) {
    return response.indexOf(`Sorry, you've already claimed`) !== -1;
}

export { lunchDeals };

let allDeals = [
    [ // sunday

    ],
    [ // monday
        'Double punch lunch at The Big Ketch',
        '$10 Burger & Beer at The Big Ketch'
    ],
    [ // tuesday
        'Double Stamp Tuesdays at Fado\'s',
        '$3 Discount on Pizza at YourPie'
    ],
    [ // wednesday

    ],
    [ // thursday

    ],
    [ // friday

    ],
    [ // saturday

    ]
];

function lunchDeals(dayNumber = (new Date()).getDay(), deals = allDeals) {
    if (hasDeals(dayNumber, deals)) {
        let todaysDeals = deals[dayNumber]
            .map(desc => `- ${desc}`)
            .join("\n");

        let prefix = "Lunch deals for today:\n\n";

        return Promise.resolve(prefix + todaysDeals);
    }
    else {
        return Promise.resolve(noDailyDeals());
    }
}

function hasDeals(dayNumber = (new Date()).getDay(), deals = allDeals) {
    return deals[dayNumber].length;
}

function noDailyDeals() {
    let lunchSourceUrl = 'https://github.com/gempesaw/flowbot/blob/master/lib/commands/lunch.js';
    return `I don't have any deals for today. Can you [add some](${lunchSourceUrl})?`;
}

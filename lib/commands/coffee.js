import fsp from 'fs-promise';

export { pickCoffee, readCoffeeChoices };

async function pickCoffee(choices) {
    let coffeeChoices = await readCoffeeChoices(choices);

    const max = choices.length;
    const index = Math.floor(Math.random() * max);

    return Promise.resolve(choices[index].imageUrl);
}

async function readCoffeeChoices(choices) {
    if (choices) {
        return choices;
    }
    else {
        const data = await fsp.readFile('data/coffee.json');
        return safeParse(data, []);
    }
}

function safeParse(json, fallback) {
    try {
        return JSON.parse(json);
    }
    catch (error) {
        console.log(error);
        return fallback;
    }
}

export { pickCoffee };

let coffeeChoices = [
    {
        name: 'Hot chocolate',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Hot_chocolate.jpg/320px-Hot_chocolate.jpg'
    }
];

function pickCoffee(choices = coffeeChoices) {
    const max = choices.length;
    const index = Math.floor(Math.random() * max);

    return Promise.resolve(choices[index].imageUrl);
}

let lastTicket = '';
export function getLastTicket() {
    return lastTicket;
}

export function persistJira({ thread_id, content }) {
    maybePersistTicket(content);
}

function maybePersistTicket(content) {
    lastTicket = parseTicket(content);
}

function parseTicket(content) {
    let matches = content.match(/(\w+-\d+)/);
    if (matches) {
        return matches[1];
    }
    else {
        return '';
    }
}

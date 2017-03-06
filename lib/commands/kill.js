const kill = (event) => {
    console.log(event);
    setTimeout(() => process.exit(0), 500);
    return Promise.resolve('Oh, okay then. Bye!');
};
kill.description = 'Kill me in case of emergencies...but I can only be restarted manually...';

export default { kill };

const talks = {
    roomdetective: {
        name: 'Disney\'s Room Detective',
        description: 'Take a glimpse into a real-world IoT solution leveraging Raspberry Pi, passive-infrared sensors, and modern web technologies',
        tags: ['node.js', 'iot'],
        deprecated: true,
    }, 
    emailtesting: {
        name: 'Automated Email Testing with Postfix and Docker',
        description: 'Join us to explore and build a full round-trip, automated email testing system that runs entirely in ephemeral environments',
        tags: ['automation', 'qa', 'docker', 'testing'],
        sort: 5,
    },
    cs101: {
        name: 'Engineering Student Tech Talk',
        description: 'A high level career discussion giving insight into tech evaluation, networking, interviewing, and finding that first job',
        tags: ['mentoring', 'tech talk', 'career'],
        sort: 6,
    },
    serverless101: {
        name: 'Where Have All My Servers Gone?',
        description: '',
        tags: ['serverless', 'cloud', 'architecture'],
        deprecated: true,
    },
    questions: {
        name: 'Learning to Ask the Right Questions',
        description: 'Often, it is more important to know the right questions to ask than to have the right answer - as those questions lead to the answers',
        tags: ['soft skills', 'leadership', 'career'],
        sort: 4,
    },
    jsadoption: {
        name: 'JavaScript: A History of Enterprise Adoption and Usage',
        description: null,
        tags: ['js', 'keynote'],
        deprecated: true,
    },
    realtimedata: {
        name: 'Real Time Data With Node.js and Redis',
        description: 'Enterprise data moves at the speed of light, so let\'s explore how to analyze and evaluate that data as it happens',
        tags: ['js', 'data', 'architecture'],
        sort: 2,
    },
    tellingstories: {
        name: 'Telling Stories With Big Data',
        description: 'Access to massive volumes of data is at our fingertips, but it isn\'t always clear how to tell a story that is both accurate and relevant with it',
        tags: ['data', 'architecture'],
        sort: 1,
    }
};

const eventList = [
    {
        name: 'Nodevember',
        url: 'https://www.nodevember.org',
        location: 'Nashville, TN',
        date: '2016-11-20',
        talks: [talks.roomdetective],
    },
    {
        name: 'Seattle JS',
        url: 'https://www.meetup.com/seattlejs',
        location: 'Seattle, WA',
        date: '2017-08-17',
        talks: [talks.roomdetective],
    },
    {
        name: 'Midwest JS',
        url: 'https://www.midwestjs.com',
        location: 'Minneapolis, MN',
        date: '2017-08-17',
        talks: [talks.roomdetective],
    },
    {
        name: 'Open Source 101',
        url: 'https://www.opensource101.com',
        location: 'Raleigh, NC',
        date: '2018-02-17',
        talks: [talks.roomdetective],
    },
    {
        name: 'BJU Computer Science',
        url: 'https://www.bju.edu/academics/programs/computer-science/',
        location: 'Greenville, SC',
        date: '2018-02-22',
        talks: [talks.cs101],
    },
    {
        name: 'NC State IT Club',
        url: 'https://www.csc.ncsu.edu/',
        location: 'Raleigh, NC',
        date: '2018-03-20',
        talks: [talks.cs101],
    },
    {
        name: 'Open Source 101',
        url: 'https://www.opensource101.com',
        location: 'Columbia, SC',
        date: '2018-04-17',
        talks: [talks.roomdetective],
    },
    {
        name: 'Revolution Conf',
        url: 'https://www.revolutionconf.com',
        location: 'Virginia Beach, VA',
        date: '2018-05-18',
        talks: [talks.serverless101],
    },
    {
        name: 'Triangle Linux Users Group',
        url: 'https://trilug.org',
        location: 'Raleigh, NC',
        date: '2018-07-12',
        talks: [talks.serverless101],
    },
    {
        name: 'Node + JS Interactive',
        location: 'Vancouver, BC',
        date: '2018-10-17',
        talks: [talks.jsadoption],
        keynote: true,
    }, 
    {
        name: 'All Things Open',
        url: 'https://allthingsopen.org',
        location: 'Raleigh, NC',
        date: '2018-10-22',
        talks: [talks.serverless101],
    },
    {
        name: 'JSConf Hawaii',
        url: 'https://www.jsconfhi.com',
        location: 'Honolulu, HI',
        date: '2019-02-17',
        talks: [talks.serverless101],
    },
    {
        name: 'ConFoo Montreal',
        url: 'https://confoo.ca/en',
        location: 'Montreal, QC',
        date: '2019-03-13',
        talks: [talks.questions],
    },
    {
        name: 'Open Source 101',
        url: 'https://opensource101.com',
        location: 'Columbia, SC',
        date: '2019-04-18',
        talks: [talks.serverless101],
    },
    {
        name: 'Music City Tech',
        url: 'https://www.musiccitycode.com',
        location: 'Nashville, TN',
        date: '2019-09-05',
        talks: [talks.serverless101],
    },
    {
        name: 'All Things Open',
        url: 'https://allthingsopen.org',
        location: 'Raleigh, NC',
        date: '2021-10-18',
        talks: [talks.realtimedata],
    },
    {
        name: 'International JavaScript Conference',
        url: 'https://javascript-conference.com/munich/',
        location: 'Munich, Germany',
        date: '2022-10-24',
        talks: [talks.tellingstories],
    },
    {
        name: 'All Things Open (10th Anniversary)',
        url: 'https://2022.allthingsopen.org',
        location: 'Raleigh, NC',
        date: '2022-11-02',
        talks: [talks.tellingstories],
        extended: true,
    }
];

function formatDate(d) {
    const dt = new Date(d);
    const month = dt.toLocaleString('default', { month: 'long' });
    const day = dt.getDate();
    const year = dt.getFullYear();
    return `${month} ${day}, ${year}`
}

function loadEngagements() {
    return eventList
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(o => ({ ...o, date: formatDate(o.date) }));
}

function loadTalks() {
    const result = Object.keys(talks)
        .map(key => ({...talks[key], id: key}))
        .filter(o => !o.deprecated)
        .sort((a, b) => a.sort - b.sort);
    return result;
}

module.exports = {
    engagements: loadEngagements(),
    talks: loadTalks(),
}

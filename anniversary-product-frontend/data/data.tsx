import { CustomReciept, DefaultSettings, Keyword, Phase, TimeSettings, User} from '@/types/ViewModels'
export const author:User={
    id:'SSH_02',
    fullName:'Hobyani stern',
    firstName:'Stern',
    lastName:'Hobyani',
    email:'sagwadihobyani@gmail.com',
    heroImage:'/images/user/cellphone.jpg',
    aboutImage:'/images/user/cape.PNG',
}
export const defaultSettings:DefaultSettings={
    email:'sagwadihobyani@gmail.com',
    date: 2025,
    mode:'lightMode'
}
export const customerReciept:CustomReciept ={
    messageResponse:'Thank you for connecting...Your messgae will be answered at the earliest convience'
}
export const keywords: Keyword[] = [
    {
        id: 1,
        keyword: "Patience",
        description: "learning that good things take time — every reply, every moment waited for, was proof that you were worth it, even the three days of silence after we first met."
    },
    {
        id: 2,
        keyword: "Persistence",
        description: "showing up again and again, refusing to give up on what felt right — the quiet determination that has always been the truest part of who you are."
    },
    {
        id: 3,
        keyword: "Discipline",
        description: "staying focused on what matters most, even when the world was loud and busy — we found each other in the middle of all of it and did not look away."
    },
    {
        id: 4,
        keyword: "Consistency",
        description: "every good morning text, without fail — small and steady, the kind of thing that quietly becomes the best part of waking up."
    },
    {
        id: 5,
        keyword: "Exposure",
        description: "being introduced to a world you had never quite seen before — a different way of thinking, of feeling, of being — and finding beauty in the difference."
    },
    {
        id: 6,
        keyword: "Experience",
        description: "knowing when to speak and when to listen, learning the better ways of loving you — not perfectly, but with everything learned along the way."
    },
    {
        id: 7,
        keyword: "Time",
        description: "not something felt passing, but something that disappears entirely — because whenever we are together, there is never enough of it."
    },
    {
        id: 8,
        keyword: "Growth",
        description: "borrowing each other's habits, good and bad, and becoming someone slightly better — shaped by the person sitting across from you."
    }
];
export const PHASES:Phase[] = [
    {
        id: 'kicker',
        eyebrow: null,
        body: 'Here is what it means...',
        sub: null,
    },
    {
        id: 'earth',
        eyebrow: '365 days.',
        body: 'The earth completes its full revolution around the sun, indifferent to what we choose to do with the time it gives us.',
        sub: null,
    },
    {
        id: 'bio',
        eyebrow: 'life finds a way.',
        body: 'In a single year, thousands of species bloom, migrate, and return. The planet does not pause it persists.',
        sub: null,
    },
    {
        id: 'birth',
        eyebrow: '140 million times over.',
        body: 'Children are born — wide-eyed, unknowing, already loved.',
        sub: null,
    },
    {
        id: 'work',
        eyebrow: 'the quiet grind.',
        body: 'Alarms. Commutes. Deadlines met and missed. Coffee going cold.',
        sub: null,
    },
    {
        id: 'close',
        eyebrow: null,
        body: 'A year is not time passing.\nIt is time turning into memory.',
        sub: 'and this one was ours.',
    },
];

export const NAV_LINKS = [
    {
        label: "Home",
        href: "/",
        key: "home",
    },
    {
        label: "Questions",
        href: "/",
        key: "questions",
    },
    {
        label: "About",
        href: "/",
        key: "about",
    },
    {
        label: "Contact Us",
        href: "/",
        key: "contact_us",
    },
];

// FOOTER SECTION
export const FOOTER_LINKS = [
    {
        title: "Learn More",
        key: "learn",
        links: [
            { title: "About BeLean.", key: "about_us" },
            { title: "Jobs", key: "jobs" },
            { title: "Privacy Policy", key: "privacy" },
            { title: "Contact Us", key: "contact" },
        ],
    },
    {
        title: "Our Community",
        key: "community",
        links: [
            { title: "Sports", key: "sports" },
            { title: "Gym", key: "gym" },
            { title: "Climbing", key: "climbing" },
            { title: "Hiking", key: "hiking" },
        ],
    },
];

export const FOOTER_CONTACT_INFO = {
    title: "Contact Us",
    links: [
        { label: "Admin Officer", value: "123-456-7890", key: "admin" },
        {
            label: "Email Officer",
            value: "belean@fake.com",
            key: "email_officer",
        },
    ],
};

export const SOCIALS = {
    title: "Socials",
    links: [
        { src: "facebook.svg", key: "facebook" },
        { src: "instagram.svg", key: "instagram" },
        { src: "x.svg", key: "twitter" },
        { src: "youtube.svg", key: "youtube" },
    ],
};

export const PUBLIC_PATHS = [
    "/",
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/forgot-password/recovery",
];

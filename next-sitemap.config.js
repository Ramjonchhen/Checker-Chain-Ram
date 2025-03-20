/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://checkerchain.com',
    generateRobotsTxt: true, // (optional)
    // ...other options
}
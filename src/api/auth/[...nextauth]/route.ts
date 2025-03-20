// import NextAuth from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google';
// import TwitterProvider from 'next-auth/providers/twitter';

// const handler = NextAuth({
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID!,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         }),
//         TwitterProvider({
//             clientId: process.env.TWITTER_CLIENT_ID!,
//             clientSecret: process.env.TWITTER_CLIENT_SECRET!,
//             version: "2.0",
//         })
//     ],
//     callbacks: {
//         async signIn({ user, account, profile }) {
//             try {
//                 const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//                 const endpoint = account?.provider === 'google' ? 'google' : 'x';

//                 const payload = account?.provider === 'google'
//                     ? {
//                         googleProfile: {
//                             sub: profile?.sub,
//                             name: profile?.name,
//                             email: profile?.email,
//                         }
//                     }
//                     : {
//                         xProfile: {
//                             id_str: profile?.id?.toString(),
//                             name: profile?.name,
//                         }
//                     };

//                 const response = await fetch(${ apiUrl } / api / v1 / auth / ${ endpoint }, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(payload),
//                 });

//                 const data = await response.json();

//                 if (data.success) {
//                     // Store tokens in the session
//                     account.accessToken = data.accessToken;
//                     account.refreshToken = data.refreshToken;
//                     account.canEarnRewards = data.canEarnRewards;
//                     account.emailNeeded = data.emailNeeded;
//                     return true;
//                 }
//                 return false;
//             } catch (error) {
//                 console.error('Authentication error:', error);
//                 return false;
//             }
//         },

//         async session({ session, token }) {
//             // Add custom session data
//             session.accessToken = token.accessToken;
//             session.refreshToken = token.refreshToken;
//             session.canEarnRewards = token.canEarnRewards;
//             session.emailNeeded = token.emailNeeded;
//             return session;
//         },

//         async jwt({ token, account }) {
//             // Persist the tokens to the token right after signin
//             if (account) {
//                 token.accessToken = account.accessToken;
//                 token.refreshToken = account.refreshToken;
//                 token.canEarnRewards = account.canEarnRewards;
//                 token.emailNeeded = account.emailNeeded;
//             }
//             return token;
//         }
//     },
// });

// export { handler as GET, handler as POST };
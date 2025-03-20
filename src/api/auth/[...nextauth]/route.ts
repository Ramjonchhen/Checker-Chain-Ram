import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';

interface AuthResponse {
    success: boolean;
    accessToken: string;
    refreshToken: string;
    canEarnRewards: boolean;
    emailNeeded: boolean;
}

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID!,
            clientSecret: process.env.TWITTER_CLIENT_SECRET!,
            version: "2.0",
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                if (!account) return false;

                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const endpoint = account.provider === 'google' ? 'google' : 'x';

                // Log the raw profile data
                console.log('Raw Profile Data:', profile);
                console.log('Account Provider:', account.provider);
                console.log('User Data:', user);

                const payload = account.provider === 'google'
                    ? {
                        googleProfile: {
                            sub: profile?.sub,
                            name: profile?.name,
                            email: profile?.email,
                            email_verified: profile?.email_verified,
                            picture: profile?.picture
                        }
                    }
                    : {
                        xProfile: {
                            id_str: profile?.id?.toString(),
                            name: profile?.name,
                            screen_name: profile?.screen_name,
                            description: profile?.description,
                            profile_image_url_https: profile?.profile_image_url_https,
                            email: profile?.email
                        }
                    };

                // Log the formatted payload before sending to API
                console.log('Formatted Payload:', payload);
                console.log('API URL:', `${apiUrl}/api/v1/auth/${endpoint}`);

                const response = await fetch(`${apiUrl}/api/v1/auth/${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json() as AuthResponse;
                
                // Log the API response
                console.log('API Response:', data);

                if (data.success) {
                    // Store tokens and additional data in the session
                    account.accessToken = data.accessToken;
                    account.refreshToken = data.refreshToken;
                    account.canEarnRewards = data.canEarnRewards;
                    account.emailNeeded = data.emailNeeded;
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Authentication error:', error);
                return false;
            }
        },

        async session({ session, token }) {
            // Add custom session data
            session.accessToken = token.accessToken as string;
            session.refreshToken = token.refreshToken as string;
            session.canEarnRewards = token.canEarnRewards as boolean;
            session.emailNeeded = token.emailNeeded as boolean;
            return session;
        },

        async jwt({ token, account }) {
            // Persist the tokens to the token right after signin
            if (account) {
                token.accessToken = account.accessToken as string;
                token.refreshToken = account.refreshToken as string;
                token.canEarnRewards = account.canEarnRewards as boolean;
                token.emailNeeded = account.emailNeeded as boolean;
            }
            return token;
        }
    },
});

export { handler as GET, handler as POST };
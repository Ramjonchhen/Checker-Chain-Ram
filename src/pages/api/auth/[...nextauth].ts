import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';

interface AuthResponse {
    success: boolean;
    accessToken: string;
    refreshToken: string;
}

export default NextAuth({
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
                const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


                console.log('Raw Profile Data:', profile);

                const payload = account.provider === 'google'
                    ? {
                        type: "google",
                        id: profile?.sub,
                        email: profile?.email,
                    }
                    : {
                        type: "x",
                        id: profile?.id?.toString(),
                        email: undefined,
                    };

                const response = await fetch(`${backendApiUrl}/socialAuth`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = (await response.json()) as AuthResponse;
                if (data.success) {
                    account.accessToken = data.accessToken;
                    account.refreshToken = data.refreshToken;
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Authentication error:', error);
                return false;
            }
        },

        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.accessToken as string;
                token.refreshToken = account.refreshToken as string;
            }
            return token;
        },

        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            return session;
        }
    },
});

import { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        accessToken?: string;
        refreshToken?: string;
        canEarnRewards?: boolean;
        emailNeeded?: boolean;
    }

    interface Profile {
        sub?: string;
        name?: string;
        email?: string;
        email_verified?: boolean;
        picture?: string;
        id?: string;
        screen_name?: string;
        description?: string;
        profile_image_url_https?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        canEarnRewards?: boolean;
        emailNeeded?: boolean;
    }
}
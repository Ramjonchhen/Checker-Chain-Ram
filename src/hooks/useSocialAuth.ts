import { signIn } from 'next-auth/react';
import { useToastStore } from 'stores/toast';

export const useSocialAuth = () => {
    const { errorToast } = useToastStore((state) => state)

    const handleSocialLogin = async (provider: 'google' | 'twitter') => {
        try {
            const result = await signIn(provider, {
                redirect: false,
                callbackUrl: '/' // or wherever you want to redirect after success
            });

            if (result?.error) {
                errorToast(
                    {
                        title: "Authentication Error",
                        message: "Failed to sign in. Please try again.",
                    }
                )
                return false;
            }

            // The tokens are already stored in localStorage by the NextAuth callback
            // You might want to trigger any additional client-side state updates here
            return true;

        } catch (error) {
            errorToast({
                title: "Error",
                message: "An unexpected error occurred. Please try again.",
            });
            return false;
        }
    };

    return { handleSocialLogin };
};
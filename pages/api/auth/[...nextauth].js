// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import AppleProvider from "next-auth/providers/apple";

export default NextAuth({
    providers: [
        AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID,
            clientSecret: async () => {
                const privateKey = process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, "\n");
                const clientSecret = jwt.sign(
                    {
                        iss: process.env.APPLE_TEAM_ID,
                        aud: "https://appleid.apple.com",
                        sub: process.env.APPLE_CLIENT_ID,
                        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 180, // 6 months
                    },
                    privateKey,
                    {
                        algorithm: "ES256",
                        keyid: process.env.APPLE_KEY_ID,
                    }
                );
                return clientSecret;
            },
            authorization: {
                params: {
                    scope: "name email",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.id = account.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.id = token.id;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

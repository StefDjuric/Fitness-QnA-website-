import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";

export const nextAuthOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET!,
            authorization: {
                params: {
                    prompt: "select_account consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    username:
                        profile.given_name?.toLowerCase().trim() ||
                        profile.email?.split("@")[0].trim(),
                };
            },
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password)
                    throw new Error("Please provide both email and password.");

                try {
                    await connectDb();

                    const user = await User.findOne({
                        email: credentials.email,
                    });

                    if (!user) {
                        throw new Error("No user found with this email.");
                    }

                    const isValidPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isValidPassword)
                        throw new Error("Not a valid password!");

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        username: user.username,
                        name: user.username,
                    };
                } catch (error) {
                    throw new Error(error as string);
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (user) {
                if (account?.provider === "google") {
                    try {
                        await connectDb();
                        const dbUser = await User.findOne({
                            email: user.email,
                        });

                        if (dbUser) {
                            token.id = dbUser._id.toString();
                            token.username = dbUser.username;
                        }
                    } catch (error) {
                        console.error("Error fetching user from DB: ", error);
                    }
                } else {
                    token.id = user.id;
                    token.username = user.username;
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.username as string;
            }

            return session;
        },

        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    await connectDb();

                    const existingUser = await User.findOne({
                        email: user.email,
                    });

                    if (!existingUser) {
                        const newUser = new User({
                            email: user.email,
                            username:
                                user.name?.trim() ||
                                user.email?.split("@")[0].trim(),
                            password: bcrypt.hashSync(
                                Math.random().toString(36).slice(-8),
                                10
                            ),
                            isVerified: true,
                        });

                        await newUser.save();
                    }

                    return true;
                } catch (error) {
                    console.log("Error during google sign in. ", error);
                    return false;
                }
            }
            return true;
        },
    },

    pages: {
        signIn: "/signup",
        error: "/signup",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };

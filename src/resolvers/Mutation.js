import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const Mutation = {
    async createUser(parent, args, { prisma }, info) {

        if (args.data.password.length < 8) {
            throw new Error('Password must be 8 characters or longer')
        }

        const password = await bcrypt.hash(args.data.password, 10)
        // hash will take in password and generate a hash with a length of 10 added onto the hashed password.

        const user = await prisma.mutation.createUser({  // creates and returns new user
            data: {
                ...args.data, // spread out data that gets passed in
                password, // override the password, that user passed in, with the hashed version.
            }
        });

        return {
            user,
            token: jwt.sign({ userid: user.id }, 'thisisasecret')
        }

    },
    async login(parent, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        }); // only need the scalar fields back, so no need to provide info as 2nd arg

        if (!user) throw new Error('sorry unable to login: 1');

        const isMatch = await bcrypt.compare(args.data.password, user.password);
        if (!isMatch) throw new Error('sorry unable to login: 2');

        return {
            user,
            token: jwt.sign({ userId: user.id }, 'thisisasecret')
        }
    },
    async deleteUser(parent, args, { prisma }, info) {

        // check if email exists in db
        const userExists = await prisma.exists.User({ id: args.id })

        // throw error if email already exists in db
        if (!userExists) throw new Error('Email taken')

        // deletes the matching user, and passes in info as 2nd arg:
        return prisma.mutation.deleteUser({ where: { id: args.id } }, info);

    },
    async updateUser(parent, args, { prisma }, info) {
        return await prisma.mutation.updateUser({
            where: { // matches id
                id: args.id
            },
            data: args.data // updates data, bec node/prisma expect the same data properties.
        }, info) // passes in info as 2nd arg
    },
    createPost(parent, args, { prisma }, info) {
        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: args.data.author // connects post to author
                    }
                }
            }
        }, info)
    },
    deletePost(parent, { id }, { prisma }, info) {
        return prisma.mutation.deletePost({ where: { id } }, info)
    },
    updatePost(parent, { id, data }, { prisma }, info) {
        return prisma.mutation.updatePost({
            where: { id },
            data
        }, info);
    },
    createComment(parent, { id, data }, { prisma }, info) {

        return prisma.mutation.createComment({
            data: {
                text: data.text,
                author: {
                    connect: {
                        id: data.author
                    }
                },
                post: {
                    connect: {
                        id: data.post
                    }
                }
            }
        }, info)
    },

    deleteComment(parent, { id }, { prisma }, info) {
        return prisma.mutation.deleteComment({ where: { id } }, info);
    },

    updateComment(parent, { id, data }, { prisma }, info) {
        return prisma.mutation.updateComment({
            where: { id },
            data
        }, info)
    },
}

export { Mutation as default }

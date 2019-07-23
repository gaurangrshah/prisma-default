import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'

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
    async deleteUser(parent, args, { prisma, request }, info) {

        // check if email exists in db
        const userId = getUserId(request) // returns authenticated user's id

        // deletes the matching user, and passes in info as 2nd arg:
        return prisma.mutation.deleteUser({ where: { id: userId } }, info);

    },
    async updateUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return await prisma.mutation.updateUser({
            where: { // matches id
                id: userId
            },
            data: args.data // updates data, bec node/prisma expect the same data properties.
        }, info) // passes in info as 2nd arg
    },
    createPost(parent, args, { prisma, request }, info) {
        // destructure request from context
        const userId = getUserId(request)
        // use request to get userId

        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: userId // connects post to author
                    }
                }
            }
        }, info)
    },
    async deletePost(parent, { id }, { prisma, request }, info) {
        const userId = getUserId(request) // returns authd user's id

        const postExists = await prisma.exists.Post({
            // ensure that authenticated user owns the post being deleted
            id,
            author: {
                id: userId
            }
        })

        if (!postExists) throw new Error("unable to delete post");

        return prisma.mutation.deletePost({ where: { id } }, info)
    },
    async updatePost(parent, { id, data }, { prisma, request }, info) {
        const userId = getUserId(request) // returns authd user's id

        const postExists = await prisma.exists.Post({
            // ensure that authenticated user owns the post being deleted
            id,
            author: {
                id: userId
            }
        })

        if (!postExists) throw new Error("unable to update post");

        const isPublished = await prisma.exists.Post({
            id,
            published: true
        })

        if (isPublished && data.published === false) {
            await prisma.mutation.deleteManyComments({ where: { post: { id } } })
        }

        return prisma.mutation.updatePost({
            where: { id: id },
            data
        }, info);
    },
    async createComment(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request) // returns authd user's id

        const postExists = await prisma.exists.Post({
            // ensure that authenticated user owns the post being deleted
            id: data.post, // grabs id off of post object from data arg
            published: true // only published posts
        })

        if (!postExists) throw new Error("cannot comment on this post");

        return prisma.mutation.createComment({
            data: {
                text: data.text,
                author: {
                    connect: {
                        id: userId
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

    async deleteComment(parent, { id }, { prisma, request }, info) {
        const userId = getUserId(request) // returns authd user's id

        const commentExists = await prisma.exists.Comment({
            id,
            author: {
                id: userId
            }

        })

        if (!commentExists) throw new Error("unable to delete comment");

        return prisma.mutation.deleteComment({ where: { id } }, info);
    },

    async updateComment(parent, { id, data }, { prisma, request }, info) {
        const userId = getUserId(request) // returns authd user's id

        const commentExists = await prisma.exists.Comment({
            id,
            author: {
                id: userId
            }

        })
        if (!commentExists) throw new Error("unable to update comment");

        return prisma.mutation.updateComment({
            where: { id },
            data
        }, info)
    },
}

export { Mutation as default }

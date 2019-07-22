import uuidv4 from 'uuid/v4'

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        // check if email exists in db
        const emailTaken = await prisma.exists.User({ email: args.data.email })

        // throw error if email already exists in db
        if (emailTaken) throw new Error('Email taken')

        // if email doesn't exists in db:
        return await prisma.mutation.createUser({ data: args.data }, info);
        // creates and returns new user
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

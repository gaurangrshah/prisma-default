import getUserId from '../utils/getUserId'
// the logic for this query is redundant, we can access the same relational info from the query's info arg.

const User = {
    email: {
        fragment: 'fragment userId on User {id}', // syntax for defining fragments
        // ensuring the userId gets set even if the user doesn't provide it when querying
        resolve(parent, args, { request }, info) {
            const userId = getUserId(request, false);

            if (userId && userId == parent.id) {
                // ONLY if userId exists and matches parent.id
                return parent.email
            } else {
                return null
            }
        }
    },
    posts: {
        fragment: 'fragment userId on User {id}',
        resolve(parent, args, { prisma }, info) {
            return prisma.query.posts({
                where: {
                    published: true,
                    author: {
                        id: [parent.id]
                    }
                }
            })
        }
    }

    //     posts(parent, args, { db }, info) {
    //         return db.posts.filter((post) => {
    //             return post.author === parent.id
    //         })
    //     },
    //     comments(parent, args, { db }, info) {
    //         return db.comments.filter((comment) => {
    //             return comment.author === parent.id
    //         })
    //     }
}

export { User as default }

// the logic for this query is redundant, we can access the same relational info from the query's info arg.

const Comment = {
    // author(parent, args, { db }, info) {
    //     return db.users.find((user) => {
    //         return user.id === parent.author
    //     })
    // },
    // post(parent, args, { db }, info) {
    //     return db.posts.find((post) => {
    //         return post.id === parent.post
    //     })
    // }
}

export { Comment as default }

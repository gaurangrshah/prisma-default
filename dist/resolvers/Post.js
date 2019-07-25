"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// the logic for this query is redundant, we can access the same relational info from the query's info arg.

var Post = {

    // author(parent, args, { db }, info) {
    //     return db.users.find((user) => {
    //         return user.id === parent.author
    //     })
    // },
    // comments(parent, args, { db }, info) {
    //     return db.comments.filter((comment) => {
    //         return comment.post === parent.id
    //     })
    // }
};

exports.default = Post;
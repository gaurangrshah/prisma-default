'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _getUserId = require('../utils/getUserId');

var _getUserId2 = _interopRequireDefault(_getUserId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// the logic for this query is redundant, we can access the same relational info from the query's info arg.

var User = {
    email: {
        fragment: 'fragment userId on User {id}', // syntax for defining fragments
        // ensuring the userId gets set even if the user doesn't provide it when querying
        resolve: function resolve(parent, args, _ref, info) {
            var request = _ref.request;

            var userId = (0, _getUserId2.default)(request, false);

            if (userId && userId == parent.id) {
                // ONLY if userId exists and matches parent.id
                return parent.email;
            } else {
                return null;
            }
        }
    },
    posts: {
        fragment: 'fragment userId on User {id}',
        resolve: function resolve(parent, args, _ref2, info) {
            var prisma = _ref2.prisma;

            return prisma.query.posts({
                where: {
                    published: true,
                    author: {
                        id: [parent.id]
                    }
                }
            });
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
};

exports.default = User;
import getUserId from '../utils/getUserId'

const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {}

    if (args.query) {
      // if name or email matches
      opArgs.where = {
        OR: [{
          name_contains: args.query
        }, {
          email_contains: args.query
        }]
      }
    }

    return prisma.query.users(opArgs, info) // passes in opArgs

    // nothing, string, object

    // if (!args.query) {
    //     return db.users
    // }

    // return db.users.filter((user) => {
    //     return user.name.toLowerCase().includes(args.query.toLowerCase())
    // })
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [{
          title_contains: args.query
        }, {
          body_contains: args.query
        }]
      }
    }
    return prisma.query.posts(opArgs, info);

    // if (!args.query) {
    //     return db.posts
    // }

    // return db.posts.filter((post) => {
    //     const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
    //     const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
    //     return isTitleMatch || isBodyMatch
    // })
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.query.user({
      where: {
        id: userId
      }
    }, info)

  },
  async post(parent, args, { prisma, request }, info) {
    const userId = getUserId(request, false);
    // 2nd arg sets "requireAuth = false"

    // using the "posts" query because it provides more options to filter by as opposed to the "post" query, which only allows filtering by "id".
    const posts = await prisma.query.posts({
      // only returns posts that match criteria:
      where: {
        id: args.id, // post id
        OR: [{
          published: true // published
        }, {
          author: {
            id: userId // belongs to user
          }
        }]
      }
    }, info)

    if (posts.length === 0) throw new Error('Post not found');
    // if no post matches criteria throw error.

    return posts[0];
    // we only return the first post because we only expect to get one post back.
  }
}

export { Query as default }

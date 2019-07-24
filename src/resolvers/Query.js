import getUserId from '../utils/getUserId'

const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip
    }

    if (args.query) {
      // if name or email matches
      opArgs.where = {
        OR: [{
          name_contains: args.query
        }]
      }
    }

    return prisma.query.users(opArgs, info) // passes in opArgs

  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {
      where: {
        // limit results to only published posts
        published: true
      },
      first: args.first,
      skip: args.skip
    };

    if (args.query) {
      // returned items must meet any criteria:
      opArgs.where.OR = [{
        title_contains: args.query
      }, {
        body_contains: args.query
      }]
    }
    return prisma.query.posts(opArgs, info);

  },
  myPosts(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const opArgs = {
      where: {
        author: {
          id: userId
        }
      },
      first: args.first,
      skip: args.skip
    }

    if (args.query) {
      opArgs.where.OR = [{
        title_contains: args.query
      }, {
        body_contains: args.query
      }]
    }

    return prisma.query.posts(opArgs, info)
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    if (!userId) throw new Error("Must be Authenticated")
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

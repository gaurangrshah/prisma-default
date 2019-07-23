import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import { resolvers, fragmentReplacements } from './resolvers/index'
import prisma from './prisma'


const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context(request) {
        return {
            // allows following properties to be access by resolvers from context
            db,
            pubsub,
            prisma,
            request
        }
    },
    fragmentReplacements
})

server.start(() => {
    console.log('The server is up!')
})

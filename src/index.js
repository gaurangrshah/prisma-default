import '@babel/polyfill/noConflict'
import "core-js/stable"
import "regenerator-runtime/runtime"

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

server.start({ port: process.env.PORT || 4000 }, () => {
    // using the conditional operator to provide a fallback port for local dev.env
    console.log('The server is up!')
})

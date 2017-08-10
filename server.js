const express = require('express')
const expressGraphQL = require('express-graphql')
const {schema,queryFunctions} = require('./schema.js')

const app = express()
app.use('/graphql',expressGraphQL({
    schema: schema,
    rootValue: queryFunctions,
    graphiql: true
}))

app.listen(4000,()=>{
    console.log('server is running on port 4000...')
})
import DataLoader from 'dataloader'

import express from 'express'
import expressGraphQL from 'express-graphql'
import {schema} from './schema.js'

import axios from 'axios'

function getCustomer(id) {
    return axios.get(`http://localhost:3000/customers/${id}`)
        .then(res => res.data)
}

function getCustomers() {
    return axios.get(`http://localhost:3000/customers`)
        .then(res => res.data)
}

const app = express()
app.use('/graphql',expressGraphQL(req =>{
    const customerLoader = new DataLoader(ids => Promise.all(ids.map(getCustomer)))
    const customersLoader = new DataLoader(ids => Promise.all(ids.map(getCustomers)))
    customerLoader.loadAll = customerLoader.load.bind(customersLoader,'__all__')
    
    const loaders = {
        customer : customerLoader
    }
       
    return {
        schema: schema,
        graphiql: true,
        context: {loaders}
    }
}))

app.listen(4000,()=>{
    console.log('server is running on port 4000...')
})
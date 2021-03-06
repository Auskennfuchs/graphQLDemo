import {makeExecutableSchema} from 'graphql-tools'
import DataLoader from 'dataloader'

import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLError,
    buildSchema
} from 'graphql'

import axios from 'axios'

const typeDefs = `
    type CustomerType {
        id: String!
        name: String
        email: String
        age: Int
        friends: [CustomerType]
    }

    type Query {
        customer(id:String): CustomerType
        customers: [CustomerType]
        customerage(age:Int): [CustomerType]
    }

    type Mutation {
        addCustomer(name:String!, email:String!, age:Int): CustomerType
        deleteCustomer(id:String!): Boolean
        editCustomer(id:String!,name: String, email: String, age: Int): CustomerType
    }
`;

const resolvers = {
    Query: {
        customer: (_,args,{loaders})=> {
            return loaders.customer.load(args.id)
        },
        customers: (_,args,{loaders}) => {
            return loaders.customer.loadAll()
        },
        customerage: (_,args,{loaders})=> {
            return loaders.customer.loadAll().then(customers => customers.filter(c=>c.age==args.age))
        },
    },
    Mutation: {
        addCustomer: (_,args) => {
            return axios.post('http://localhost:3000/customers',args)
                .then(res => res.data)
        },
        deleteCustomer: ({id}) => {
            return axios.delete('http://localhost:3000/customers/'+id)
                .then(()=>{return true})
                .catch(() => {return false})
        },
        editCustomer: (args)=> {
            return axios.patch('http://localhost:3000/customers/'+args.id, args)
                .then(res => res.data)
        }
    },
    CustomerType: {
        friends : (customer,args,{loaders}) => (
            loaders.customer.loadMany(customer.friends || [])
        )
    }
}

export const schema = makeExecutableSchema({typeDefs, resolvers})
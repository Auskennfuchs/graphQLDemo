const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLError,
    buildSchema
} = require('graphql')

const axios = require('axios')

const QueryFunctions = {
    customer: ({id})=> {
        return axios.get('http://localhost:3000/customers/'+id)
                .then(res => res.data);
    },
    customers: () => {
        return axios.get('http://localhost:3000/customers')
            .then(res => res.data)
    },
    addCustomer: ({name,email,age}) => {
        console.log(email)
        return axios.post('http://localhost:3000/customers',{
            name: name,
            email: email,
            age: age
        })
            .then(res => res.data)
    },
    deleteCustomer: ({id}) => {
        return axios.delete('http://localhost:3000/customers/'+id)
        .then(()=>{return true})
        .catch(() => {return false})
    },
    editCustomer: (args)=> {
        console.log("Test")
        return axios.patch('http://localhost:3000/customers/'+args.id,
            args
        )
        .then(res => res.data)
    }
}

module.exports = {
    schema: buildSchema(`
        type CustomerType {
            id: String
            name: String
            email: String
            age: Int
        }

        type Query {
            customer(id:String): CustomerType
            customers: [CustomerType]
        }

        type Mutation {
            addCustomer(name:String!, email:String!, age:Int): CustomerType
            deleteCustomer(id:String!): Boolean
            editCustomer(id:String!,name: String, email: String, age: Int): CustomerType
        }

        schema {
            query: Query
            mutation: Mutation            
        }
    `),
    queryFunctions: QueryFunctions
}
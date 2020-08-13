const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  graphql,
} = require("graphql");


/*
const customers = [
  { id: 1, name: "Vanessa Baron", email: "vb@gmail.com", age: 23 },
  { id: 2, name: "Van Bar", email: "vbari@gmail.com", age: 24 },
  { id: 3, name: "Sam Voop", email: "sv@gmail.com", age: 22 },
];
*/

const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    age: {
      type: GraphQLInt
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: {
          type: GraphQLInt
        },
      },
      resolve(parentValue, args) {
        /*
        for (let i = 0; i < customers.length; i++) {
          if (customers[i].id == args.id) {
            return customers[i];
          }
        } */
        return axios.get(`http://localhost:3000/customers/${args.id}`)
          .then(res => res.data);
      },
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        //return customers;
        return axios.get(`http://localhost:3000/customers/`)
          .then(res => res.data);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)

        },
        email: {
          type: new GraphQLNonNull(GraphQLString)

        },
        age: {
          type: new GraphQLNonNull(GraphQLInt)

        }
      },
      resolve(parentValue, args) {
        return axios.post(`http://localhost:3000/customers/`, {
          name: args.name,
          email: args.email,
          age: args.age
        }).then(res => res.data);
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve(parentValue, args) {
        return axios.delete(`http://localhost:3000/customers/${args.id}`)
          .then(res => res.data);
      }
    },
    editCustomer: {
      type: CustomerType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt)

        },
        name: {
          type: GraphQLString

        },
        email: {
          type: GraphQLString

        },
        age: {
          type: GraphQLInt

        }
      },
      resolve(parentValue, args) {
        return axios.patch(`http://localhost:3000/customers/${args.id}`, args)
          .then(res => res.data);
      }
    }
  }
});





module.exports = new GraphQLSchema({
  query: RootQuery,
  //mutation:mutation
  mutation
});
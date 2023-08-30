import ApolloClient from "apollo-boost";

const createApolloClient = () => {
  return new ApolloClient({
    uri: "http://localhost:8080/graphql", // Change this to your actual GraphQL endpoint
    headers: {
      authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
    },
  });
};

export default createApolloClient;

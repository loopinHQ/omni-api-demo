import ApolloClient from "apollo-boost";

const createApolloClient = () => {
  return new ApolloClient({
    uri: "http://omniapi.letsloopin.com:8080/graphql",
    headers: {
      authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
    },
  });
};

export default createApolloClient;

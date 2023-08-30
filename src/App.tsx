import { ComponentType, ReactElement } from "react";
import { ApolloProvider } from "react-apollo";
import { useParams } from "react-router-dom";
import "./App.css";
import createApolloClient from "./api/Apollo";

interface AppProps {
  contentComponent: ComponentType<any>;
}

function App({ contentComponent: ContentComponent }: AppProps): ReactElement {
  const client = createApolloClient();
  const { id } = useParams();

  const props = id ? { id } : {};

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <ContentComponent {...props} />
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;

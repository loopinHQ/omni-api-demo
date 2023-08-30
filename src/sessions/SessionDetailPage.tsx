import gql from "graphql-tag";
import { useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { useParams } from "react-router-dom";

interface ISession {
  id: number;
  title: string;
  messages: IMessage[];
}

interface IMessage {
  id: number;
  content: string;
}

interface ISessionQueryResult {
  session: ISession;
}

const SESSION_QUERY = gql`
  query GetSession($id: Int!) {
    session(id: $id) {
      id
      title
      messages {
        id
        content
      }
    }
  }
`;

const CREATE_MESSAGE_MUTATION = gql`
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      sessionId
    }
  }
`;

const GENERATE_STREAM_MUTATION = gql`
  mutation GenerateStream($input: GenerateStreamInput!) {
    generateStream(input: $input) {
      message
    }
  }
`;

function SessionDetailPage() {
  const { id, sessionId } = useParams();
  const { data, refetch } = useQuery<ISessionQueryResult>(SESSION_QUERY, {
    context: {
      headers: {
        authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
        namespace: process.env.REACT_APP_NAMESPACE,
        userid: Number(id),
      },
    },
    variables: { id: Number(sessionId) },
  });

  const [newMessage, setNewMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const [createMessage] = useMutation(CREATE_MESSAGE_MUTATION, {
    onCompleted: () => {
      setIsSending(false);
      refetch();
    },
  });

  const [generateStream] = useMutation(GENERATE_STREAM_MUTATION, {
    onCompleted: () => {
      setIsSending(false);
      refetch();
    },
  });

  if (!data || !data.session) {
    return <div>Loading...</div>;
  }

  const { title, messages } = data.session;

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setIsSending(true);

      createMessage({
        context: {
          headers: {
            authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
            namespace: process.env.REACT_APP_NAMESPACE,
            userid: id,
          },
        },
        variables: {
          input: {
            content: newMessage,
            sessionId: Number(sessionId),
          },
        },
      });

      generateStream({
        context: {
          headers: {
            authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
            namespace: process.env.REACT_APP_NAMESPACE,
            userid: id,
          },
        },
        variables: {
          input: {
            content: newMessage,
            sessionId: Number(sessionId),
          },
        },
      });

      setNewMessage("");
    }
  };

  return (
    <div>
      <h1>{title}</h1>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.content}</li>
        ))}
      </ul>
      <div>
        <input
          disabled={isSending}
          onChange={(e) => setNewMessage(e.target.value)}
          type="text"
          value={newMessage}
        />
        <button disabled={isSending} onClick={handleSendMessage}>
          {isSending ? "Waiting..." : "Submit"}
        </button>
        {isSending && <div className="spinner" />}
      </div>
    </div>
  );
}

export default SessionDetailPage;

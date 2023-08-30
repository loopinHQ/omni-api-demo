import gql from "graphql-tag";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { Link } from "react-router-dom";

interface IUser {
  id: number;
  email: string;
  name: string;
  photoURL: string;
}

interface ISession {
  id: number;
  title: string;
}

interface ICreateUserResponse {
  createUser: IUser;
}

interface ISessionsQueryResult {
  sessions: ISession[];
}

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      name
      photoURL
    }
  }
`;

const CREATE_SESSION = gql`
  mutation CreateSession($input: CreateSessionInput!) {
    createSession(input: $input) {
      id
      title
    }
  }
`;

const SESSIONS_QUERY = gql`
  query GetSessions($pinned: Boolean, $search: String, $skip: Int, $take: Int) {
    sessions(pinned: $pinned, search: $search, skip: $skip, take: $take) {
      createdAt
      id
      pinned
      title
      updatedAt
    }
  }
`;

function UserSessionsPage() {
  const [email, setEmail] = useState<string>("");
  const [user, setUser] = useState<IUser>();
  const [createUser] = useMutation<ICreateUserResponse>(CREATE_USER);
  const [createSession] = useMutation(CREATE_SESSION);
  const { data: sessionsData, refetch } = useQuery<ISessionsQueryResult>(
    SESSIONS_QUERY,
    {
      context: {
        headers: {
          authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
          namespace: process.env.REACT_APP_NAMESPACE,
          userid: user?.id ?? 0,
        },
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    try {
      // If the user already exists, this will just return
      // that user rather than creating another.
      const response = await createUser({
        context: {
          headers: {
            authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
            namespace: process.env.REACT_APP_NAMESPACE,
          },
        },
        variables: {
          input: { email },
        },
      });

      const newUser = response.data?.createUser;
      if (newUser) setUser(newUser);

      refetch({
        context: {
          headers: {
            authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
            namespace: process.env.REACT_APP_NAMESPACE,
            userid: newUser?.id ?? 0,
          },
        },
      });
    } catch (error) {
      console.error("Error creating or getting user:", error);
    }
  };

  const handleCreateSession = async () => {
    try {
      const response = await createSession({
        context: {
          headers: {
            authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
            namespace: process.env.REACT_APP_NAMESPACE,
            userid: user?.id ?? 0,
          },
        },
        variables: {
          input: { title: "New Session Title" },
        },
      });

      const newSession = response.data?.createSession;

      if (newSession) refetch();
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  return (
    <div>
      {user && user.id !== 0 && email !== "" && (
        <>
          <img alt="" src={user?.photoURL ?? ""}></img>
          <p>
            You are currently user {user.id} with email {email}.
          </p>
        </>
      )}
      <h2>Create or Retrieve User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Create or Retrieve</button>
      </form>
      <button onClick={handleCreateSession}>New session</button>
      {sessionsData && sessionsData.sessions.length > 0 && (
        <>
          <h2>Display Sessions</h2>
          {sessionsData.sessions.map((session) => (
            <div key={session.id}>
              <Link to={`/${user?.id ?? 0}/${session.id}`}>
                {session.title}
              </Link>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default UserSessionsPage;

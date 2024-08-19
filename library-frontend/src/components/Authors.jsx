import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import Select from "react-select";

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

const EDIT_AUTHOR = gql`
  mutation ($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      bookCount
    }
  }
`;

const Authors = (props) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const result = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>Loading...</div>;
  }

  const authors = result.data.allAuthors;

  const handleBornInput = (event) => {
    event.preventDefault();
    editAuthor({ variables: { name, setBornTo: born } });
    setName("");
    setBorn("");
  };

  const options = authors.map((author) => {
    return {
      value: author.name,
      label: author.name,
    };
  });

  console.log(options);
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born ?? null}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={handleBornInput}>
        Name
        <Select
          onChange={(event) => {
            setName(event.value);
          }}
          options={options}
        />
        <div>
          Born
          <input
            type="number"
            value={born}
            onChange={({ target }) => {
              setBorn(Number(target.value));
            }}
          />{" "}
        </div>{" "}
        <button type="submit">Update author</button>
      </form>
    </div>
  );
};

export default Authors;

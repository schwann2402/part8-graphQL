import { gql, useQuery } from "@apollo/client";
import { useState } from "react";

export const ALL_BOOKS = gql`
  query AllBooks($genre: String) {
    allBooks(genre: $genre) {
      author {
        name
      }
      title
      published
      genres
    }
  }
`;

const Books = (props) => {
  const [genre, setGenre] = useState("");
  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
  });

  if (!props.show) {
    return null;
  }

  if (result.loading) return <div>loading books...</div>;

  const books = result.data.allBooks;

  const handleGenre = (genre) => {
    setGenre(genre);
  };

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => handleGenre("")}>All genres</button>
      <button onClick={() => handleGenre("Comedy")}>Comedy</button>
      <button onClick={() => handleGenre("Drama")}>Drama</button>
    </div>
  );
};

export default Books;

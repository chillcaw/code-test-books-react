import React, { useContext, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import BooksCollectionContext from "../contexts/BooksCollectionContext";
import IsMyCollectionContext from "../contexts/BooksCollectionContext";

import BookListItem from './BookListItem';

const BookList = ({ collection }) => {

  const { isMyCollection } = useContext(IsMyCollectionContext);

  return (
    <>
      {collection.length > 0
        ? collection.map((book, index) => {
          return ( <BookListItem key={index} book={book} /> );
        })
        : <p>There are no books in your collection.</p>}
    </>
  );
}

export default BookList;

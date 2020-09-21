import React, { useState } from "react";
import BooksCollectionContext from "../contexts/BooksCollectionContext";
import IsMyCollectionContext from "../contexts/IsMyCollectionContext";
import BookCollection from './BookCollection';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const BookCollectionMain = () => {
  const [isMyCollection, setIsMyCollection] = useState(true);
  const [collection, setCollection] = useState([]);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleErrorClose = () => setErrorOpen(false);
  const handleSuccessClose = () => setSuccessOpen(false);

  const updateCollection = (newBook) => {
    if (collection.find((item) => item.id === newBook.id)) {
      setErrorMessage("Book is already in your collection");
      setErrorOpen(true);
      return;
    }

    const newCollection = collection;
    newCollection.push(newBook);
    setCollection(newCollection);

    setSuccessMessage("Book has been added to your collection");
    setSuccessOpen(true);
  }

  const removeCollection = (removeBook) => {
    setCollection(collection.filter(item => item.id !== removeBook.id));
    setSuccessMessage("Book has been removed from your collection");
    setSuccessOpen(true);
  }

  const updateRating = (book, rating) => {
    const collectionCopy = collection.map((item) => {
      if (item.id === book.id) {
        item.review = rating;
        return item;
      }

      return item;
    });
    setCollection(collectionCopy);

    setSuccessMessage("Book has been reviewed successfully");
    setSuccessOpen(true);
  }

  return (
    <BooksCollectionContext.Provider value={{ collection, updateCollection, removeCollection, updateRating }}>
      <IsMyCollectionContext.Provider value={{ isMyCollection, setIsMyCollection }}>
        <BookCollection isMyCollection={ isMyCollection } />
        <Snackbar open={successOpen} autoHideDuration={3000} onClose={handleSuccessClose}>
          <Alert onClose={handleSuccessClose} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
        <Snackbar open={errorOpen} autoHideDuration={3000} onClose={handleErrorClose}>
          <Alert onClose={handleErrorClose} severity="error">
            {errorMessage}
          </Alert>
        </Snackbar>
      </IsMyCollectionContext.Provider>
    </BooksCollectionContext.Provider>
  );
}

export default BookCollectionMain;

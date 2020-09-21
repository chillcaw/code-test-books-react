import React, { useContext } from 'react';
import BooksCollectionContext from '../contexts/BooksCollectionContext';
import IsMyCollectionContext from '../contexts/IsMyCollectionContext';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';

import { Grid, Container, Box, Button } from '@material-ui/core';

const useStyles = makeStyles({
  box: {
    'text-align': 'left',
    padding: '30px'
  },
  image: {
    width: '140px'
  }
});

const BookListItem = ({ book }) => {
  const classes = useStyles();
  const { collection, updateCollection, removeCollection, updateRating } = useContext(BooksCollectionContext);
  const { isMyCollection } = useContext(IsMyCollectionContext);

  const handleRatingChange = (event, newValue) => {
    updateRating(book, newValue);
  };

  const subtitle = !book.volumeInfo.subtitle
    ? ""
    : ` - ${book.volumeInfo.subtitle}`;

  let button;
  if (!isMyCollection && !collection.find(item => item.id === book.id)) {
    button = <Button variant="contained" color="primary" onClick={() => updateCollection(book)}>Add Book</Button>
  } else {
    button = (
      <>
        <Button variant="contained" color="secondary" onClick={() => removeCollection(book)}>
          Remove Book
        </Button>
      </>
    )
  }

  let rating = <Rating
    name={book.id}
    value={book.review ? book.review : 0}
    onChange={handleRatingChange}
  />;

  return (
    <>
      <Box className={classes.box} m={2}>
        <Grid container direction="row" spacing={3}>
          <Grid item md={3} xs={12}>
            {book.volumeInfo.imageLinks
              ? <img className={classes.image} src={book.volumeInfo.imageLinks.thumbnail} />
              : <img className={classes.image} src="http://www.accomtownsville.com.au/Image/no-image-available.png" />}
            {button}
            {isMyCollection ? rating : null}
          </Grid>
          <Grid item md={9}>
            <h3>{book.volumeInfo.title} {subtitle}</h3>
            <h5>Authors: {book.volumeInfo.authors.join(", ")} - Publish Date: {book.volumeInfo.publishedDate} - Pages: {book.volumeInfo.pageCount}</h5>
            <p>{book.volumeInfo.description}</p>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default BookListItem;

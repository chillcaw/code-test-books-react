import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

import { Grid, Container, Select, InputLabel, MenuItem } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import Search from './Search';
import BookList from './BookList';
import IsMyCollectionContext from "../contexts/IsMyCollectionContext";
import BooksCollectionContext from "../contexts/BooksCollectionContext";

const findByAuthorApi = async (searchAuthorApi, setApiCollection) => {
  const base = 'https://www.googleapis.com/books/v1/volumes';
  const url = `${base}?q=inauthor:${searchAuthorApi}`;

  const response = await axios.get(url);

  setApiCollection(response.data.items);
}

const BookCollection = () => {
  const [searchQuery, setSearchQuery] = useState("Heaney");
  const [apiCollection, setApiCollection] = useState([]);

  const {isMyCollection, setIsMyCollection} = useContext(IsMyCollectionContext);
  const {collection, updateCollection} = useContext(BooksCollectionContext);

  const [filteredCollection, setFilteredCollection] = useState([]);

  const [categoryFilter, setCategoryFilter] = useState("All");
  let categories = filteredCollection.reduce((acc, book) => {
    return acc.concat(book.volumeInfo.categories);
  }, []);

  categories = Array.from(new Set(categories));

  const debounceBookQuery = useCallback(
    debounce(findByAuthorApi, 500),
    []
  );

  useEffect(() => {
    if (isMyCollection === false) {
      if (searchQuery === null || searchQuery === "") {
        debounceBookQuery("Heaney", setApiCollection);
      } else {
        debounceBookQuery(searchQuery, setApiCollection);
      }
    } else {
      if (searchQuery !== null && searchQuery !== "") {
        setFilteredCollection(collection.filter(book => {
          const authorCheck = book.volumeInfo.authors.map(author => {
            return author.toUpperCase().includes(searchQuery.toUpperCase());
          }).every(i => i);

          let categoryCheck = true;
          if (categoryFilter !== "All") {
            // This doesn't exist on all books
            if (book.volumeInfo.categories) {
              categoryCheck = book.volumeInfo.categories.includes(categoryFilter);
            }
          }

          return categoryCheck && authorCheck;
        }));
      } else {
        setFilteredCollection(collection.filter(item => {
          return categoryFilter !== "All"
            ? item.volumeInfo?.categories?.includes(categoryFilter)
            : item
        }));
      }
    }
  }, [searchQuery, collection, isMyCollection, categoryFilter]);

  const searchLabel = isMyCollection
    ? "Search Collection"
    : "Search Google API";

  const diplayCollection = isMyCollection
    ? filteredCollection
    : apiCollection;

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} justify="space-between">
        <Grid item>
          <Search searchLabel={searchLabel} setSearchQuery={setSearchQuery}/>
        </Grid>
        <Grid item>
          {isMyCollection && categories && categories.length > 0
            ? (
              <>
                <InputLabel id="categories-filter">Category</InputLabel>
                <Select
                  labelId="categories-filter"
                  id="demo-simple-select"
                  value={categoryFilter}
                  onChange={(ev, value) => {
                    setCategoryFilter(ev.target.value);
                  }}
                >
                <MenuItem value={"All"}>All</MenuItem>
                {categories.map((cat, index) => {
                  return <MenuItem key={index} value={cat}>{cat}</MenuItem>
                })}
                </Select>
              </>
            )
            : null}
        </Grid>
        <Grid item>
          <ToggleButtonGroup
            value={isMyCollection}
            exclusive
            onChange={(ev, value) => setIsMyCollection(value)}
            aria-label="text alignment"
          >
            <ToggleButton value={true} aria-label="left aligned">
              My Collection
            </ToggleButton>
            <ToggleButton value={false} aria-label="centered">
              Find new Books
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid container item md={12} spacing={3}>
          <BookList collection={diplayCollection} />
        </Grid>
      </Grid>
    </Container>
  )
}

export default BookCollection;

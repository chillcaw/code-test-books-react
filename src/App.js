import React from 'react';
import logo from './logo.svg';
import './App.css';
import BookCollectionMain from './components/BookCollectionMain';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

function App() {
  return (
    <div className="App">
      <Container maxWidth="md">
        <Grid container spacing={1}>
          <Grid container item xs={12} spacing={3}>
            <BookCollectionMain />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;

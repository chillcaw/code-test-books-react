import React from 'react';

import TextField from '@material-ui/core/TextField';

const Search = ({searchLabel, setSearchQuery}) => {
  return (
    <TextField
      onChange={(ev) => setSearchQuery(ev.target.value)}
      id="standard-basic"
      label={searchLabel}/>
  );
}

export default Search;

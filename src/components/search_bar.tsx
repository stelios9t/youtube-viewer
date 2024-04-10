import React, { useState } from "react";
import { SearchBarProps } from "../utils/types";

const SearchBar: React.FC<SearchBarProps> = ({ onSearchTermChange }) => {
  const [term, setTerm] = useState<string>("");

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = event.target.value;
    setTerm(newTerm);
    onSearchTermChange(newTerm);
  };

  return (
    <div className="search-bar">
      <input
        value={term}
        onChange={onInputChange}
        placeholder="Search for videos..."
      />
    </div>
  );
};

export default SearchBar;

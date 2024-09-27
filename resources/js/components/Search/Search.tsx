import * as React from 'react';
import {useRef, useState} from "react";

const Search = () => {
    const [isSearch, setIsSearch] = useState(true);
    const inputRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (event) => setSearchTerm(event.target.value);
    const toggleSearch = () => {
        setIsSearch(!isSearch);
        if (!isSearch) {
            inputRef.current.focus();
        }
    }

    return (
        <div id={"search"}>
            <div id={"inputSearch"} className={isSearch ? "searching" : ""}>
                <input placeholder={"Поиск"} type={"search"} autoComplete={"off"} ref={inputRef}
                       onChange={handleSearchChange}/>
                <button type={"submit"} className={"searchIcon"} onClick={toggleSearch}><span
                    className="material-symbols-outlined">search</span></button>
            </div>
        </div>
    )
}

export default Search;

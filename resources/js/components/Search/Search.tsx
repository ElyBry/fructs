import * as React from 'react';

import {useRef} from "react";
import { useRecoilState } from 'recoil';
import { searchTermState, isSearchState } from "./searchAtom";

import styles from "../../../sass/_search.module.scss";

const Search = () => {
    const [searchTerm, setSearchTerm] = useRecoilState(searchTermState);
    const [isSearch, setIsSearch] = useRecoilState(isSearchState);

    const inputRef = useRef(null);
    const handleSearchChange = (event) => setSearchTerm(event.target.value);
    const toggleSearch = () => {
        setIsSearch(!isSearch);
        if (!isSearch) {
            inputRef.current.focus();
        }
    }

    return (
        <div id={"search"} className={styles.search}>
            <div id={"inputSearch"} className={`${styles.inputSearch} ${isSearch ? styles.searching : ""}`}>
                <input placeholder={"Поиск"} type={"search"} autoComplete={"off"} ref={inputRef}
                       onChange={handleSearchChange}/>
                <button type={"submit"} className={styles.searchIcon} onClick={toggleSearch}><span
                    className="material-symbols-outlined">search</span></button>
            </div>
        </div>
    )
}

export default Search;

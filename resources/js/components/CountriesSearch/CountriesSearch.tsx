import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { countriesList } from "./countriesAtom";

const Countries = () => {

    const [query, setQuery] = useState('');
    const [selectedCountries, setSelectedCountries] = useRecoilState(countriesList);
    const [countries, setCountries] = useState([]);
    const controllerCountries = new AbortController();
    const [displayedCountries, setDisplayedCountries] = useState([]);
    const [unselectedCountries, setUnselectedCountries] = useState([]);
    const [loadingCountries, setIsLoadingCountries] = useState(false);

    const fetchCountries = async () => {
        try {
            setIsLoadingCountries(true);
            if (query.length > 0 ) {
                const response = await axios.get(`api/countries?country=${query}`,{
                    signal: controllerCountries.signal
                });
                setCountries(response.data.data);
            } else {
                setCountries([]);
            }
            setIsLoadingCountries(false);
            return '';
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCountries();
    }, [query]);

    useEffect(() => {
        setDisplayedCountries(selectedCountries);
        setUnselectedCountries(countries.filter(country => !selectedCountries.some(selected => selected.id === country.id)));
    }, [selectedCountries, countries]);

    useEffect(() => {
        return () => {
            controllerCountries.abort();
        };
    }, [query]);

    const handleAnyChange = (event, country = null) => {
        const newSelectedCountries = event.target.checked
            ? [...selectedCountries, country]
            : selectedCountries.filter(selected => selected.id !== country.id);

        setSelectedCountries(newSelectedCountries);
    };

    return (
        <div id={"countries"}>
            <input type={"text"} placeholder={"Введите первую букву страны..."} value={query}
                   onChange={(e) => setQuery(e.target.value)}/>
            <div>
                {displayedCountries.map((country) => (
                    <div key={country["id"]}>
                        <input type={"checkbox"} id={"check_country" + country["id"]} defaultChecked={true}
                               onChange={(e) => handleAnyChange(e, country)}/>
                        <label
                            htmlFor={"check_country" + country["id"]}>{country["name"]} </label>
                    </div>
                ))}
                {!loadingCountries ?
                    unselectedCountries.map((country) => (
                        <div key={country["id"]}>
                            <input type={"checkbox"}
                                   id={"check_country" + country["id"]}
                                   onChange={(e) => handleAnyChange(e,  country)}/>
                            <label
                                htmlFor={"check_country" + country["id"]}>{country["name"]} </label>
                        </div>
                    ))
                    : <p>Загрузка...</p>
                }
                {!loadingCountries && unselectedCountries.length == 0 && query.length > 0 && <p>Не найдено</p>}
            </div>
        </div>
    )
}
export default Countries;

import { useEffect, useState } from "react";
import SearchItem, { ISearchItem } from "./SearchItem";
import styles from './SearchForm.module.scss'; 
import Paginator from "./Paginator";
import fetchBingSearch, { BingApiResponse } from "../services/BingApiService";

export default function SearchForm(): JSX.Element | null {

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showValidationError, setShowValidationError] = useState<boolean>(false);
    const [showApiError, setShowApiError] = useState<boolean>(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [itemsPerPage] = useState<number>(10);
    const [searchItems, setSearchItems] = useState<ISearchItem[]>([]);
    
    useEffect(() => {
        if (isFormSubmitted && searchTerm) {
            setSearchItems([]);
            setIsLoading(true);
            const offset = (currentPage - 1) * itemsPerPage + 1;

            fetchBingSearch(searchTerm, itemsPerPage, offset)
            .then((response: BingApiResponse) => {
                if (response && response.webPages) {
                    setSearchItems(response.webPages.value);
                    setTotalItems(response.webPages.totalEstimatedMatches);
                    setIsLoading(false);
                }
            })
            .catch(() => setShowApiError(true));
        }

        return () => {
            setIsFormSubmitted(false);
            setShowApiError(false);
        };

    }, [isFormSubmitted, currentPage, itemsPerPage, searchTerm]);

    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setIsFormSubmitted(true);
        }
    };

    const nextPage = () => {
        const lastPage = Math.ceil(totalItems / itemsPerPage);
        
        if (currentPage !== lastPage) {
            setCurrentPage(currentPage + 1);
            setIsFormSubmitted(true);
        }
    };

    const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        
        if (!searchTerm) {
            setIsFormSubmitted(false);
            setShowValidationError(true);
            return;
        }

        setShowValidationError(false);
        setIsFormSubmitted(true);
    }

    return (
        <div className={styles["search-form"]}>
            <form onSubmit={handleSubmit}>
                <input
                    name="search-term"
                    className={styles["search-term"]}
                    type="text"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value.replace(" ", "+"))}
                    placeholder="Search for..."
                />
                <input className={styles.submit} type="submit" value="Search" />
                <label className={styles["validation-error"]}>{showValidationError ? "Please enter a search term" : ""}</label>
            </form>
            <div className={styles.results}>
                {searchItems && searchItems.length ? (
                    <>
                        <p>Results for: {searchTerm}</p>
                        {searchItems.map((item) => <SearchItem key={item.id} item={item}></SearchItem>)}
                        <Paginator
                            totalItems={totalItems}
                            currentPage={currentPage}
                            perPage={itemsPerPage}
                            previousPage={previousPage}
                            nextPage={nextPage}
                        />
                    </>
                ) : (
                    showApiError ? <p className={styles["validation-error"]}>An error happened please try again later.</p> : 
                        isLoading ? <div>Loading...</div> : <></>
                )}
            </div>
        </div>
    );
}
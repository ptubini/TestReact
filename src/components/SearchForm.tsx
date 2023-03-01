import { useEffect, useState } from "react";
import SearchItem, { ISearchItem } from "./SearchItem";
import styles from './SearchForm.module.scss'; 
import Paginator from "./Paginator";
import fetchBingSearch, { BingApiResponse } from "../services/BingApiService";

interface SearchFormState {
    searchTerm: string;
    searchItems: ISearchItem[];
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
}

export default function SearchForm(): JSX.Element | null {

    const [showValidationError, setShowValidationError] = useState<boolean>(false);
    const [showApiError, setShowApiError] = useState<boolean>(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formDetails, setFormDetails] = useState<SearchFormState>({
        searchTerm: "",
        searchItems: [],
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10
    });
    
    useEffect(() => {
        if (isFormSubmitted && formDetails.searchTerm) {
            setFormDetails((prevState) => ({...prevState, searchItems: []}));
            setIsLoading(true);
            const offset = (formDetails.currentPage - 1) * formDetails.itemsPerPage;

            fetchBingSearch(formDetails.searchTerm, formDetails.itemsPerPage, offset)
            .then((response: BingApiResponse) => {
                if (response && response.webPages) {
                    setFormDetails((prevState) => ({...prevState, searchItems: response.webPages.value}));
                    setFormDetails((prevState) => ({...prevState, totalItems: response.webPages.totalEstimatedMatches}));
                    setIsLoading(false);
                }
            })
            .catch(() => setShowApiError(true));
        }

        return () => {
            setIsFormSubmitted(false);
            setShowApiError(false);
        };

    }, [isFormSubmitted, formDetails]);

    const previousPage = () => {
        if (formDetails.currentPage > 1) {
            setFormDetails((prevState) => ({...prevState, currentPage: formDetails.currentPage - 1}));
            setIsFormSubmitted(true);
        }
    };

    const nextPage = () => {
        const lastPage = Math.ceil(formDetails.totalItems / formDetails.itemsPerPage);
        
        if (formDetails.currentPage !== lastPage) {
            setFormDetails((prevState) => ({...prevState, currentPage: formDetails.currentPage + 1}));
            setIsFormSubmitted(true);
        }
    };

    const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        
        if (!formDetails.currentPage) {
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
                    value={formDetails.searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFormDetails((prevState) => ({...prevState, searchTerm: e.target.value}));
                    }}
                    placeholder="Search for..."
                />
                <input className={styles.submit} type="submit" value="Search" />
                <label className={styles["validation-error"]}>{showValidationError ? "Please enter a search term" : ""}</label>
            </form>
            <div className={styles.results}>
                {formDetails.searchItems && formDetails.searchItems.length ? (
                    <>
                        <p>Results for: {formDetails.searchTerm}</p>
                        {formDetails.searchItems.map((item) => <SearchItem key={item.id} item={item}></SearchItem>)}
                        <Paginator
                            totalItems={formDetails.totalItems}
                            currentPage={formDetails.currentPage}
                            perPage={formDetails.itemsPerPage}
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
import { useEffect, useState } from "react";
import SearchItem, { ISearchItem } from "./SearchItem";
import './SearchForm.scss';
import Paginator from "./Paginator";

export default function SearchForm(): JSX.Element | null {

    interface BingApiResponse {
        webPages: BingWebPages;
    }

    interface BingWebPages {
        totalEstimatedMatches: number;
        value: ISearchItem[];
    }

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

            fetch(`${process.env.REACT_APP_BING_ENDPOINT}/search?q=${searchTerm}&count=${itemsPerPage}&offset=${offset}&responseFilter=webpages`, {
                method: 'GET',
                headers: {
                    "Ocp-Apim-Subscription-Key": `${process.env.REACT_APP_BING_API_KEY}`
                }
            })
            .then((response) => {
                if (!response.ok) {
                    return Promise.reject("Error");
                }

                return response.json();
            })
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
        <div className="search-form">
            <form onSubmit={handleSubmit}>
                <input
                    name="search-term"
                    className="search-term"
                    type="text"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value.replace(" ","+"))}
                    placeholder="Search for..."
                />
                <input className="submit" type="submit" value="Search" />
                <label className="validation-error">{showValidationError ? "Please enter a search term" : ""}</label>
            </form>
            <div className="results">
                <p>{searchItems && searchItems.length ? `Results for: ${searchTerm}` : ''}</p>
                {searchItems && searchItems.length ? (
                    <>
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
                    showApiError ? <p className="validation-error">An error happened please try again later.</p> : 
                        isLoading ? <div>Loading...</div> : <></>
                )}
            </div>
        </div>
    );
}
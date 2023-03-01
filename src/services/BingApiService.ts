import { ISearchItem } from "../components/SearchItem";

export interface BingApiResponse {
    webPages: BingWebPages;
}

export interface BingWebPages {
    totalEstimatedMatches: number;
    value: ISearchItem[];
}

export default function fetchBingSearch(searchTerm: string, itemsPerPage: number, offset: number) {
    return fetch(`${process.env.REACT_APP_BING_ENDPOINT}/search?q=${searchTerm}&count=${itemsPerPage}&offset=${offset}&responseFilter=webpages`, {
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
    });
}
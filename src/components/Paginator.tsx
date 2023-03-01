import './Paginator.scss';
import { MouseEvent } from 'react';

interface IPaginatorProps {
    currentPage: number;
    totalItems: number;
    perPage: number;
    nextPage: (event: MouseEvent<HTMLLIElement>) => void;
    previousPage: (event: MouseEvent<HTMLLIElement>) => void;
}

export default function Paginator({ currentPage, totalItems, perPage, nextPage, previousPage }: IPaginatorProps): JSX.Element | null {
    const lastPage = Math.ceil(totalItems / perPage);

    return (
       <div className="pagination-wrapper">
          <ul className="paginator">
             <li onClick={previousPage} className={`page-number ${currentPage === 1 ? 'disabled' : ''}`}>
                Previous
             </li>
             <li onClick={nextPage} className={`page-number ${currentPage === lastPage ? 'disabled' : ''}`}>
                Next
             </li>
          </ul>
       </div>
    );
};
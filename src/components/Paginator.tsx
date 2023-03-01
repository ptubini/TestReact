import styles from './Paginator.module.scss'; 
import { MouseEvent } from 'react';

interface IPaginatorProps {
    currentPage: number;
    totalItems: number;
    perPage: number;
    nextPage: (event: MouseEvent<HTMLButtonElement>) => void;
    previousPage: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function Paginator({ currentPage, totalItems, perPage, nextPage, previousPage }: IPaginatorProps): JSX.Element | null {
    const lastPage = Math.ceil(totalItems / perPage);

    return (
       <div className={styles["pagination-wrapper"]}>
          <div className={styles.paginator}>
             <button onClick={previousPage} className={styles["page-number"]} disabled={currentPage === 1}>
                Previous
             </button>
             <button onClick={nextPage} className={styles["page-number"]} disabled={currentPage === lastPage}>
                Next
             </button>
          </div>
       </div>
    );
};
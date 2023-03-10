import styles from './SearchItem.module.scss'; 

export interface ISearchItem {
    id: string;
    name: string;
    url: string;
    displayUrl: string;
    snippet: string;
}

interface ISearchItemProps {
    item: ISearchItem;
}
   
export default function SearchItem({ item }: ISearchItemProps): JSX.Element | null {
    if (!item || !item.name || !item.url) {
      return null;
    }

    return <div className={styles["search-item"]}>
        <a href={item.url}>
            <h2>{item.name}</h2>
            <p className={styles["display-url"]}>{item.displayUrl}</p>
            <p>{item.snippet}</p>
        </a>
    </div>
}
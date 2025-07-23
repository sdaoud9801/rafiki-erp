import Style from './Category.module.css';
import { useState } from 'react';
export default function Category({
    categoryName,
    categoryItems
}: {
    categoryName: string,
    categoryItems: string[]
}){
    const [expanded, setExpanded] = useState(false);
    function toggleExpanded(){
        if(expanded){
            setExpanded(false);
        } else {
            setExpanded(true);
        }
    }
    return (
        <div className={Style.category} onClick={toggleExpanded}>
            <div className={Style.categoryNameContainer}>
                <span className={Style.categoryName}>{categoryName}</span>
                <span className={expanded ? Style.pointerDown : (undefined)}>^</span>
            </div>
            <div className={expanded ? Style.itemsShow : Style.itemsHide}>
                {
                categoryItems.length > 0 ? 
                    categoryItems.map((item)=>{
                    return(
                        <div className={Style.item}>{item}</div>
                    )
                }) : (
                    <div className={Style.item}>No items added to category</div>
                )}
            </div>
        </div>
    )
}
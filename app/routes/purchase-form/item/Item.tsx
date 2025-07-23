import style from './item.module.css';
import { useState, useRef } from 'react';

type Item = {
    position: number,
    category: string,
    item: string,
    quantity: string,
    cost: string
}

export default function Item(
    {
        position,
        items,
        categoriesAndItems,
        setItems,
        deleteItem,
        updateItemCategory,
        updateItemName,
        updateItemQuantity,
        updateItemCost
    }:
        {
            position: number,
            items: Item[],
            categoriesAndItems: any,
            setItems: (items: Item[]) => void,
            deleteItem: (position: number, e: React.MouseEvent, items: Item[], setItems: (items: Item[]) => void) => void,
            updateItemCategory: (position: number, category: string, items: Item[], setItems: (items: Item[]) => void) => void,
            updateItemName: (position: number, name: string, items: Item[], setItems: (items: Item[]) => void) => void,
            updateItemQuantity: (position: number, quantity: string, items: Item[], setItems: (items: Item[]) => void) => void,
            updateItemCost: (position: number, cost: string, items: Item[], setItems: (items: Item[]) => void) => void
        }) {
    let [other, setOther] = useState(false)
    let [category, setCategory]: [any, any] = useState(false);
    let [selectValue, setSelectValue]: [any, any] = useState(null);
    let itemRef = useRef(null);
    function updateCategory(value: string) {
        setOther(false);
        setCategory(value);
        setSelectValue(null);
        updateItemCategory(position, value, items, setItems)
        // updateItemName(position,"", items, setItems);
    }
    function updateItem(value: string) {
        if (value === "Other") {
            setOther(true);
            setSelectValue('Other');
            updateItemName(position, "", items, setItems);
        } else {
            setOther(false);
            setSelectValue(value);
            updateItemName(position, value, items, setItems);
        }
    }
    console.log(categoriesAndItems);
    return (
        <div className={style.item}>
            <div className={style.itemHeader}>
                <label>Item #{position + 1}</label>
                <button className={style.deleteButton} onClick={(e) => { deleteItem(position, e, items, setItems) }}>Delete item</button>
            </div>
            <label className={style.itemLabel}>Category</label>
            <select onChange={(e) => { updateCategory(e.target.value) }} required>
                <option disabled selected>-- select an option --</option>
                {Object.keys(categoriesAndItems).map((category) => {
                    return <option>{category}</option>
                })}
            </select>
            <label className={style.itemLabel}>Item</label>
            <select value={selectValue ? selectValue : '-- select an option --'} onChange={(e) => { updateItem(e.target.value) }} ref={itemRef}>
                <option selected disabled>{category ? ("-- select an option --") : ("Please select a category")}</option>
                {(category && (category != '-- select an option --') && categoriesAndItems[category].length > 0) ? (
                    categoriesAndItems[category].map((item: string) => {
                        if (!item) {
                        } else {
                            return <option>{item}</option>

                        }
                    }
                    ))
                    : null
                }

                {
                    category ?
                        (<option>Other</option>) :
                        null
                }
            </select>
            {
                other ? (
                    <>
                        <label className={style.itemLabel}>
                            New Item
                        </label>
                        <input type="text" onChange={(e) => { updateItemName(position, e.target.value, items, setItems) }} required></input>
                    </>
                ) : null
            }

            <label className={style.itemLabel}>
                Quantity purchased
            </label>
            <input type="number" onChange={(e) => { updateItemQuantity(position, e.target.value, items, setItems) }}></input>
            <label className={style.itemLabel}>
                Total paid for item
            </label>
            <input type="number" onChange={(e) => { updateItemCost(position, e.target.value, items, setItems) }}></input>
        </div>
    )
}
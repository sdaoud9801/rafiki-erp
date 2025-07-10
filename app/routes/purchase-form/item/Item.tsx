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
            setItems: (items: Item[]) => void,
            deleteItem: (position: number, e: React.MouseEvent, items: Item[], setItems: (items: Item[]) => void) => void,
            updateItemCategory: (position: number, category: string, items: Item[], setItems: (items: Item[]) => void) => void,
            updateItemName: (position: number, name: string, items: Item[], setItems: (items: Item[]) => void) => void,
            updateItemQuantity: (position: number, quantity: string, items: Item[], setItems: (items: Item[]) => void) => void,
            updateItemCost: (position: number, cost: string, items: Item[], setItems: (items: Item[]) => void) => void
        }) {

    let [other, setOther] = useState(false)

    function updateCategory(value: string) {
        updateItemCategory(position, value, items, setItems)
    }
    function updateItem(value: string) {
        if (value === "Other") {
            setOther(true);
            updateItemName(position,"", items, setItems);
        } else {
            setOther(false);
            updateItemName(position, value, items, setItems);
        }
    }
    return (
        <div className={style.item}>
            <div className={style.itemHeader}>
                <label>Item #{position + 1}</label>
                <button className={style.deleteButton} onClick={(e) => { deleteItem(position, e, items, setItems) }}>Delete item</button>
            </div>
            <label className={style.itemLabel}>Category</label>
            <select onChange={(e) => { updateCategory(e.target.value) }} required>
                <option disabled selected>-- select an option --</option>
                <option>Salah</option>
                <option>Donya</option>
            </select>

            <label className={style.itemLabel}>Item</label>
            <select value={other ? "Other" : undefined} onChange={(e) => { updateItem(e.target.value) }}>
                <option disabled selected> -- select an option --</option>
                <option>Salah</option>
                <option>Donya</option>
                <option>Other</option>
            </select>

            {other ? (
                <>
                    <label className={style.itemLabel}>
                        New Item
                    </label>
                    <input type="text" onChange={(e) => { updateItemName(position, e.target.value, items, setItems) }} required></input>
                </>
            ) : null}

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
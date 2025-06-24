import style from './item.module.css'
import { useState, useRef } from 'react'
type Item = {
    category: string,
    item: string,
    quantity: number,
    cost: number
}

export default function Item(
    {
        position,
        deleteItem,
        updateItemCategory,
        updateItemName,
        updateItemQuantity,
        updateItemCost
    }:
        {
            position: number,
            deleteItem: (position: number, e: React.MouseEvent) => void,
            updateItemCategory: (position: number, category: string) => void,
            updateItemName: (position: number, name: string) => void,
            updateItemQuantity: (position: number, quantity: string) => void,
            updateItemCost: (position: number, cost: string) => void
        }) {

    const [other, setOther] = useState({
        category: false,
        item: false
    });

    

    function updateCategory(value: string) {
        if (value === "Other") {
            let newOther = {
                category: true,
                item: true
            }
            setOther(newOther)
        } else {
            let newOther = {
                ...other,
                category: false,
            }
            setOther(newOther);
            updateItemCategory(position, value);
        }
    }
    function updateItem(value: string) {
        if (value === "Other") {
            let newOther = {
                ...other,
                item: true
            }
            setOther(newOther);
        } else {
            let newOther = {
                ...other,
                item: false
            }
            setOther(newOther)
            updateItemName(position, value)
        }
    }
    return (
        <div className={style.item}>
            <div className={style.itemHeader}>
                <label>Item #{position + 1}</label>
                <button className={style.deleteButton} onClick={(e) => { deleteItem(position, e) }}>Delete item</button>
            </div>
            <label className={style.itemLabel}>Category</label>
            <select value={other.category ? "Other" : undefined} onChange={(e) => { updateCategory(e.target.value) }} required>
                <option disabled selected> -- select an option --</option>
                <option>Salah</option>
                <option>Donya</option>
                <option>Other</option>
            </select>
            {other.category ? (
                <>
                    <label className={style.itemLabel}>
                        New Category
                    </label>
                    <input type="text" onChange={(e) => { updateItemCategory(position, e.target.value) }} required></input>
                </>
            ) : null}
            
            {(!other.category) ? (
                <>
                    <label className={style.itemLabel}>Item</label>
                    <select value={other.item ? "Other" : undefined} onChange={(e) => { updateItem(e.target.value) }}>
                        <option disabled selected> -- select an option --</option>
                        <option>Salah</option>
                        <option>Donya</option>
                        <option>Other</option>
                    </select>
                </>
            ): null}

            {other.item ? (
                <>
                    <label className={style.itemLabel}>
                        New Item
                    </label>
                    <input type="text" onChange={(e) => { updateItemName(position, e.target.value) }} required></input>   
                </>
            ): null}

            <label className={style.itemLabel}>
                Quantity purchased
            </label>
            <input type="number" onChange={(e) => { updateItemQuantity(position, e.target.value) }}></input>
            <label className={style.itemLabel}>
                Total paid for item
            </label>
            <input type="number" onChange={(e) => { updateItemCost(position, e.target.value) }}></input>
        </div>
    )
}
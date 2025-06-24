import { useState } from "react"
import style from "./purchase-form.module.css";
import Supplier from "./supplier/Supplier";
import Item from './item/Item'

type Item = {
    position: number,
    category: string,
    item: string,
    quantity: string,
    cost: string
}

const initialItem = {
    position: 0,
    category: "",
    item: "",
    quantity: "",
    cost: ""
};

export default function PurchaseForm() {
    let [supplier, setSupplier] = useState("");
    const [items, setItems]: [Item[], any] = useState([initialItem]);
    const [delivery, setDelivery]: [string, any] = useState("0");
    let itemCosts = items.map((item) => {
        return parseInt(item.cost);
    });
    let total;
    if (items.length > 1) {
        total = itemCosts.reduce((accumulated, currentValue) => {
            return (accumulated + currentValue);
        }) + parseInt(delivery);
    } else {
        total = parseInt(items[0].cost) + parseInt(delivery);
    }
    console.log(items);
    function handleAddItem(e: React.MouseEvent) {
        e.preventDefault();
        let newItem = {
            ...initialItem,
            position: items.length
        }
        let newItems = [...items, newItem];
        setItems(newItems);
    };

    function deleteItem(position: number, e: React.MouseEvent) {
        e.preventDefault();
        if(items.length === 1) {
            return
        }
        let newItems = items.filter((item) => {
            return (item.position !== position)
        });
        for (let i = 0; i < newItems.length; i++) {
            newItems[i].position = i;
        }
        setItems(newItems);
    }

    function updateItemCategory(position: number, category: string) {
        let itemToUpdate = items.filter((item) => {
            return (item.position === position)
        })[0];
        let updatedItem = {
            ...itemToUpdate,
            category
        }
        let newItems = [...items];
        newItems[position] = updatedItem;
        setItems(newItems);
    }

    function updateItemName(position: number, name: string) {
        let itemToUpdate = items.filter((item) => {
            return (item.position === position)
        })[0];
        let updatedItem = {
            ...itemToUpdate,
            item: name
        }
        let newItems = [...items];
        newItems[position] = updatedItem;
        setItems(newItems);
    }

    function updateItemQuantity(position: number, quantity: string) {
        let itemToUpdate = items.filter((item) => {
            return (item.position === position)
        })[0];
        let updatedItem = {
            ...itemToUpdate,
            quantity
        }
        let newItems = [...items];
        newItems[position] = updatedItem;
        setItems(newItems);
    }

    function updateItemCost(position: number, cost: string) {
        let itemToUpdate = items.filter((item) => {
            return (item.position === position)
        })[0];
        let updatedItem = {
            ...itemToUpdate,
            cost
        }
        let newItems = [...items];
        newItems[position] = updatedItem;
        setItems(newItems);
    }

    return (
        <>
            <nav>
                Rafiki Operations
            </nav>
            <div id="main">
                <form action="" style={style}>
                    <Supplier setSupplier={setSupplier} />
                    <div className={style.items}>
                        <p className={style.sectionHeader}>Items</p>
                        {
                            items.map((item) => {
                                return <Item
                                    position={item.position}
                                    deleteItem={deleteItem}
                                    updateItemCategory={updateItemCategory}
                                    updateItemName={updateItemName}
                                    updateItemQuantity={updateItemQuantity}
                                    updateItemCost={updateItemCost}
                                    key={item.position}
                                />
                            })
                        }
                        <button className={style.addItemButton} onClick={handleAddItem}>Add item</button>
                    </div>
                    <div className={style.delivery}>
                        <label>
                            Delivery cost
                        </label>
                        <input type="number" onChange={(e) => { setDelivery(e.target.value) }}></input>
                    </div>
                    <div className={style.preview}>
                        <p>Preview</p>
                        <table>
                            <tr>
                                <th>Item</th>
                                <th>Amount</th>
                                <th>Cost</th>
                            </tr>
                            {items.map((item) => {
                                return (
                                    <tr>
                                        <td>{item.item}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.cost}</td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <th></th>
                                <th>Delivery:</th>
                                <td>{delivery}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>Total:</th>
                                <td>{total ? total : null}</td>
                            </tr>
                        </table>
                    </div>
                </form>
            </div>
        </>
    )
}
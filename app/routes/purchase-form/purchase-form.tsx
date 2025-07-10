import { useState } from "react"
import style from "./purchase-form.module.css";
import Supplier from "./supplier/Supplier";
import Item from './item/Item';
import {
    handleAddItem,
    deleteItem,
    updateItemCategory,
    updateItemName,
    updateItemQuantity,
    updateItemCost
} from "./helper";

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
    const [supplier, setSupplier] = useState("");
    const [items, setItems]: [Item[], any] = useState([initialItem]);
    const [delivery, setDelivery]: [string, any] = useState("0");
    items.forEach((item) => {
        console.log(item);
    })
    let itemCosts = items.map((item) => {
        return parseInt(item.cost);
    });
    // calculate total for preview
    let total;
    if (items.length > 1) {
        total = itemCosts.reduce((accumulated, currentValue) => {
            return (accumulated + currentValue);
        }) + parseInt(delivery);
    } else {
        total = parseInt(items[0].cost) + parseInt(delivery);
    }

    function validate(e: React.MouseEvent) {
        e.preventDefault();
        // validate supplier is not empty
        if (supplier === "") {
            throw new Error("Supplier field is empty");
        }
        items.forEach((item) => {
            if (item.category === "-- select an option --") {
                throw new Error(`Category not selected for item #${item.position}`);
            } else if (item.item === "-- select an option --") {
                throw new Error(`Item not selected for item #${item.position}`);
            } else if (parseInt(item.cost) < 0) {
                throw new Error(``)
            }
        })
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
                                    items={items}
                                    setItems={setItems}
                                    deleteItem={deleteItem}
                                    updateItemCategory={updateItemCategory}
                                    updateItemName={updateItemName}
                                    updateItemQuantity={updateItemQuantity}
                                    updateItemCost={updateItemCost}
                                    key={item.position}
                                />
                            })
                        }
                        <button className={style.addItemButton} onClick={(e) => { handleAddItem(e, items, setItems) }}>Add item</button>
                    </div>
                    <div className={style.delivery}>
                        <label>
                            Delivery cost
                        </label>
                        <input type="number" onChange={(e) => { setDelivery(e.target.value) }} min="0"></input>
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
                    <div className={style.createPurchaseButtonContainer}>
                        <button className={style.createPurchase} onClick={validate}>Create purchase</button>
                    </div>
                </form>
            </div>
        </>
    )
}
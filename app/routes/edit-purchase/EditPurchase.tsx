import { useState } from "react";
import style from "./purchase-form.module.css";
import Supplier from "./supplier/Supplier";
import Item from './item/Item';
import Nav from '../../components/Nav/Nav'
import {
    handleAddItem,
    deleteItem,
    updateItemCategory,
    updateItemName,
    updateItemQuantity,
    updateItemCost,
    validate
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

export async function clientLoader({
    params
}: {
    params: {
        pid: string
    }
}) {
    console.log(params.pid);
    const [formItemsRes, purchaseRes] = await Promise.all([fetch('http://localhost:3000/formitems'), fetch(`http://localhost:3000/edit/${params.pid}`)]);
    const [formItems, purchase]: [any, {
        purchase: {
            date: string;
            delivery: number;
            items: {
                item_name: string,
                item_quantity: number,
                item_cost: number,
                item_category: string
            }[] ;
            purchase_id: number;
            supplier: string
        }
    }] = await Promise.all([formItemsRes.json(), purchaseRes.json()]);
    let purchaseItemsCopy = [...purchase.purchase.items];
    let newPurchaseItems: Item[] = []
    for(let i=0;i<purchaseItemsCopy.length;i++){
        let purchaseItem = purchaseItemsCopy[i];
        newPurchaseItems.push({
            position: i,
            category: purchaseItem.item_category,
            item: purchaseItem.item_name,
            quantity: purchaseItem.item_quantity.toString(),
            cost: purchaseItem.item_cost.toString()
        })
    }
    let newPurchase = {
        ...purchase.purchase,
        items: newPurchaseItems
    }
    return {formItems, purchase: newPurchase};
}

export async function HydrateFallBack() {
    return <div>...Loading</div>
}

export default function PurchaseForm({
    loaderData
}: {
    loaderData: {
        formItems: any,
        purchase: {
            items: Item[],
            date: string,
            delivery: string,
            purchase_id: number,
            supplier: string
        }
    }
}) {
    let {formItems, purchase}: {
        formItems: any,
        purchase: {
            items: Item[],
            date: string,
            delivery: string,
            purchase_id: number,
            supplier: string
        }
    } = loaderData;
    let categoriesAndItems = formItems.items;
    let suppliers = formItems.suppliers;
    const [supplier, setSupplier] = useState(purchase.supplier);
    const [items, setItems]: [Item[], any] = useState(purchase.items);
    const [delivery, setDelivery]: [string, any] = useState(purchase.delivery);
    const [error, setError]: [any, any] = useState(false);
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
    async function submit(e: React.MouseEvent) {
        e.preventDefault();
        setError(false);
        let postableItems = items.map((item)=>{
            let returnItem:any = {...item};
            delete returnItem.position;
            return returnItem
        })
        try {
            validate(
                e,
                supplier,
                delivery,
                items,
        
            );
            let res = await fetch('http://localhost:3000/update-purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    purchase_id: purchase.purchase_id,
                    date: purchase.date,
                    supplier,
                    delivery,
                    items: postableItems
                })
            });
            let {status} = await res.json();
        } catch (e: any){
            setError({
                error: true,
                message: e.message
            })
        }
    }

    return (
        <>
            <Nav />
            <div id="main">
                <form action="" style={style}>
                    <Supplier setSupplier={setSupplier} suppliers={suppliers} initialSupplier={supplier}/>
                    <div className={style.items}>
                        <p className={style.sectionHeader}>Items</p>
                        {
                            items.map((item) => {
                                return <Item
                                    position={item.position}
                                    items={items}
                                    initialItem={item.item}
                                    initialCategory={item.category}
                                    initialQuantity={item.quantity}
                                    initialCost={item.cost}
                                    categoriesAndItems={categoriesAndItems}
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
                        <input type="number" value={delivery} onChange={(e) => { setDelivery(e.target.value) }} min="0"></input>
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
                        <button className={style.createPurchase} onClick={submit}>Edit purchase</button>
                    </div>
                    {
                        error ?
                            (<div className={style.errorMessageContainer}>
                                <div className={style.errorMessage}>
                                    Error: <br></br> {error.message}
                                </div>
                            </div>) :
                            null
                    }

                </form>
            </div>
        </>
    )
}
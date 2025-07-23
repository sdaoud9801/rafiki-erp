import { useState } from "react";
import style from "./purchase-form.module.css";
import Supplier from "./supplier/Supplier";
import Item from './item/Item';
import Nav from '../../components/Nav/Nav';
import Error from "~/components/Error/Error";
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

export async function clientLoader({
    params
}: {
    params: {
        pid: string
    }
}) {
    console.log(params.pid);
    const res = await fetch(`http://localhost:3000/user/edit/${params.pid}`, {
        credentials: 'include'
    });
    let returnObject = await res.json();
    return returnObject;
}

type ErrorObject = {
    error: string,
    data: null
}

type ReturnObject = {
    error: null,
    data: {
        purchase: any
        items: any,
        suppliers: any,
        role: 'user' | 'admin'
    }
}

export async function HydrateFallBack() {
    return <div>...Loading</div>
}

export default function PurchaseForm({
    loaderData
}: {
    loaderData: ErrorObject | ReturnObject
}
) {
    if (loaderData.error) {
        return (<Error message={loaderData.error} />)
    }
    let returnObject = loaderData as ReturnObject;
    let { data } = returnObject;
    let { purchase, role }: {
        items: any,
        purchase: {
            items: Item[],
            date: string,
            delivery: string,
            purchase_id: number,
            supplier: string
        },
        role: 'admin' | 'user'
    } = data;
    let categoriesAndItems = data.items;
    let suppliers = data.suppliers;
    const [supplier, setSupplier] = useState(purchase.supplier);
    const [items, setItems]: [Item[], any] = useState(purchase.items);
    const [delivery, setDelivery]: [string, any] = useState(purchase.delivery);
    const [error, setError]: [any, any] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
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
        setLoading(true);
        setError(false);
        let postableItems = items.map((item) => {
            let returnItem: any = { ...item };
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
            let res = await fetch('http://localhost:3000/user/update-purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    purchase_id: purchase.purchase_id,
                    date: purchase.date,
                    supplier,
                    delivery,
                    items: postableItems
                })
            });
            let {
                    error
                } = await res.json();
            if(!error){
                setSuccess(true);
            }
        } catch (e: any) {
            setError({
                error: true,
                message: e.message
            })
        }
        setLoading(false);
    }
    if (success) {
        return (
            <>
                <Nav role={returnObject.data.role} />
                <div id={style.main}>
                    <form className={style.innerContainer}>
                        <h3 className={style.successMessage}>
                            Purchase edited successfully
                        </h3>
                        <div className={style.preview}>
                            <div className={style.successSupplier}>
                                <strong>Supplier: </strong>
                                {supplier}
                            </div>
                            <table>
                                <tr>
                                    <th>Item</th>
                                    <th>Amount</th>
                                    <th>Cost</th>
                                </tr>
                                {
                                    items.map((item) => {
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
    return (
        <>
            <Nav role={role} />
            <div id={style.main}>
                <form action="" style={style}>
                    <div className={style.pageHeader}>
                        Edit purchase
                    </div>
                    <Supplier setSupplier={setSupplier} suppliers={suppliers} initialSupplier={supplier} />
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
                            {
                                items.map((item) => {
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
                    {
                        loading ? (
                            <div className={style.loadingMessageContainer}>
                                <div className={style.loading}>
                                    Loading
                                    <div className={style.loadingSpinner}></div>
                                </div>
                            </div>
                        ) : (
                            null
                        )
                    }
                </form>
            </div>
        </>
    )
}
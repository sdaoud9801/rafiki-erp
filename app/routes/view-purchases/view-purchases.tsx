import Nav from "~/components/Nav/Nav";
import style from './view-purchases.module.css';
import { useState } from 'react';
import PurchaseRow from "./PurchaseRow/PurchaseRow";

export async function clientLoader() {
    const res = await fetch('http://localhost:3000/viewitems');
    const purchases = await res.json();
    return purchases.purchases;
}

type Purchase = {
    purchase_id: number,
    date: string,
    delivery: number,
    supplier: string,
    approved: boolean,
    items: {
        name: string,
        quantity: number,
        cost: number
    }[]
}

export default function viewPurchases({
    loaderData
}: {
    loaderData: any
}) {
    const [sortBy, setSortBy] = useState('Newest');
    const [dateRange, setDateRange]: [{
        from: null | string,
        to: null | string
    }, any] = useState({
        from: null,
        to: null
    });
    const [visiblePurchases, setVisiblePurchases]: [
        Purchase[],
        any
    ] = useState(loaderData);
    const [filterError, setFilterError]: [null | string, any] = useState(null);
    let sortedVisiblePurchases;
    if (sortBy === 'Newest') {
        sortedVisiblePurchases = visiblePurchases.sort((a: Purchase, b: Purchase) => {
            let purchase_a = a.purchase_id;
            let purchase_b = b.purchase_id;
            if (purchase_a < purchase_b) {
                return 1
            } else if (purchase_a > purchase_b) {
                return -1;
            }
            return 0;
        })
    } else {
        sortedVisiblePurchases = visiblePurchases.sort((a: Purchase, b: Purchase) => {
            let purchase_a = a.purchase_id;
            let purchase_b = b.purchase_id;
            if (purchase_a < purchase_b) {
                return -1
            } else if (purchase_a > purchase_b) {
                return 1;
            }
            return 0;
        })
    }

    function applyFilters() {
        setFilterError(null);
        if ((dateRange.from !== null) && (dateRange.to !== null)) {
            let startDate = Date.parse(dateRange.from);
            let endDate = Date.parse(dateRange.to) + (1000 * 60 * 60 * 24);
            let newVisiblePurchases = loaderData.filter((purchase: Purchase) => {
                let purchaseDate = Date.parse(purchase.date);
                return ((purchaseDate > startDate) && (purchaseDate < endDate));
            })
            setVisiblePurchases(newVisiblePurchases);
        } else {
            setFilterError('Please select both dates');
            return;
        }
    }

    return (
        <div style={style}>
            <Nav />
            <div className={style.container}>
                <div className={style.innerContainer}>
                    Sort by:
                    <select value={sortBy} onChange={(e) => { setSortBy(e.target.value) }}>
                        <option>Newest</option>
                        <option>Oldest</option>
                    </select>
                    <hr></hr>
                    <div className={style.filter}>
                        <span>From:</span>
                        <input type="date" value={dateRange.from ? dateRange.from : undefined} onChange={(e) => { setDateRange({ ...dateRange, from: e.target.value }) }}></input>
                        <span>To:</span>
                        <input type="date" value={dateRange.to ? dateRange.to : undefined} onChange={(e) => { setDateRange({ ...dateRange, to: e.target.value }) }}></input>
                    </div>
                    <button className={style.applyFilterButton} onClick={applyFilters}>
                        Apply filter
                    </button>
                    <div className={style.filterError}>
                        {filterError ? filterError : null}
                    </div>
                    <hr></hr>
                    <table className={style.parentTable}>
                        <tr>
                            <th>Date</th>
                            <th>Purchase</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                        {
                            visiblePurchases.map((purchase: Purchase) => {
                                return (
                                    <PurchaseRow purchase={purchase} key={purchase.purchase_id} />
                                )
                            })
                        }
                    </table>
                </div>
            </div>
        </div>
    )
}
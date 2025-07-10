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

function handleAddItem(e: React.MouseEvent, items: Item[], setItems: (items: Item[]) => void) {
    e.preventDefault();
    let newItem = {
        ...initialItem,
        position: items.length
    }
    let newItems = [...items, newItem];
    setItems(newItems);
};

function deleteItem(position: number, e: React.MouseEvent, items: Item[], setItems: (items: Item[]) => void) {
    e.preventDefault();
    if (items.length === 1) {
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

function updateItemCategory(position: number, category: string, items: Item[], setItems: (items: Item[]) => void) {
    let itemToUpdate = items.filter((item) => {
        return (item.position === position)
    })[0];
    let updatedItem;
    updatedItem = {
        ...itemToUpdate,
        category,
    }
    let newItems = [...items];
    newItems[position] = updatedItem;
    setItems(newItems);
};

function updateItemName(position: number, name: string, items: Item[], setItems: (items: Item[]) => void) {
    let itemToUpdate = items.filter((item) => {
        return (item.position === position)
    })[0];
    let updatedItem;
    updatedItem = {
        ...itemToUpdate,
        item: name,
    };
    let newItems = [...items];
    newItems[position] = updatedItem;
    setItems(newItems);
}

function updateItemQuantity(position: number, quantity: string, items: Item[], setItems: (items: Item[]) => void) {
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

function updateItemCost(position: number, cost: string, items: Item[], setItems: (items: Item[]) => void) {
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

export {
    handleAddItem,
    deleteItem,
    updateItemCategory,
    updateItemName,
    updateItemQuantity,
    updateItemCost
}

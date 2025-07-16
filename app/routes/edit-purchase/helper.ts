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
        item: ""
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

function findDuplicates(arr: {
    item: string,
    category: string
}[]) {
    let element;
    let set = new Set();
    let setLength = 0;
    for (element in arr) {
        set.add(arr[element].item + arr[element].category);
        setLength++;
        if (setLength != set.size) {
            return {
                duplicate: true,
                element: arr[element].item
            }
        }
    }
    return {
        duplicate: false,
        element: null
    }
}

function validate(e: React.MouseEvent, supplier: string, delivery: string, items: Item[]) {
    e.preventDefault();
    // validate supplier is not empty
    if (supplier === "" || supplier === "-- Select an option --") {
        throw new Error("Supplier field is empty");
    }
    items.forEach((item) => {
        if (item.category === "-- select an option --" || item.category === '') {
            throw new Error(`Category not selected for item #${item.position + 1}`);
        } else if (item.item === "-- select an option --" || item.item === '') {
            throw new Error(`Item not selected for item #${item.position + 1}`);
        } else if (parseInt(item.cost) <= 0 || item.cost === '') {
            throw new Error(`Cost must be greater than 0 for item #${item.position + 1}`)
        } else if (parseInt(item.quantity) <= 0 || item.quantity === '') {
            throw new Error(`Quantity must be greater than 0 for item #${item.position + 1}`)
        }
    });
    if (parseInt(delivery) < 0) {
        throw new Error('Delivery must be greater than or equal to 0');
    };
    let arrayOfItemsAndCats = items.map((item) => {
        return {
            item: item.item,
            category: item.category
        }
    });
    let { duplicate, element } = findDuplicates(arrayOfItemsAndCats);
    if (duplicate) {
        throw new Error(`Item ${element} has been entered twice`);
    }
    return true;
}

export {
    handleAddItem,
    deleteItem,
    updateItemCategory,
    updateItemName,
    updateItemQuantity,
    updateItemCost,
    findDuplicates,
    validate
}

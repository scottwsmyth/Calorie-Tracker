// TODO -> DELETE, CLEAR & UPDATE NEED TO ALTER LS AS WELL

const StorageCtrl = (function() {
  return {
    storeItem: function(item) {
      let items;

      // Check if any items in LS

      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },

    getLSItems: function() {
      let items;

      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },

    deleteItem: function(itemID) {
      items = JSON.parse(localStorage.getItem("items"));

      ids = items.map(item => {
        return item.id;
      });

      const index = ids.indexOf(itemID);

      items.splice(index, 1);

      localStorage.setItem("items", JSON.stringify(items));
    },

    updateItem: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      for (let i = 0; i < items.length; i++) {
        if (items[i].id === updatedItem.id) {
          items.splice(i, 1, updatedItem);
        }
      }

      localStorage.setItem("items", JSON.stringify(items));
    }
  };
})();

const ItemCtrl = (function() {
  const item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  // Data object - holds all items and totalcalories running total
  let data = {
    items: StorageCtrl.getLSItems(),
    editItem: null,
    totalCalories: 0
  };

  // *functions pertaining to data //

  return {
    getItems: function() {
      return data.items;
    },

    // Add item to the data structure
    addItem: function(name, calories) {
      let id;

      if (data.items.length > 0) {
        id = data.items[data.items.length - 1].id + 1;
      } else {
        id = 0;
      }

      calories = parseInt(calories);

      const newItem = new item(id, name, calories);

      data.items.push(newItem);

      return newItem;
    },

    updateItem: function(name, calories) {
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(item => {
        if (item.id === data.editItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },

    deleteItem: function(itemID) {
      // Get IDs (using map method)

      ids = data.items.map(item => {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(itemID);

      // Remove item
      data.items.splice(index, 1);
    },

    clearAllItems: function() {
      data = {
        items: [],
        editItem: null,
        totalCalories: 0
      };
    },

    getItemById: function(id) {
      let found = null;

      // Match input ID with data struct ID and return that object
      data.items.forEach(item => {
        if (item.id === id) {
          found = item;
        }
      });

      return found;
    },

    setEditItem: function(item) {
      data.editItem = item;
    },

    getEditItem: function() {
      return data.editItem;
    },

    getTotalCalories: function() {
      // Loop through the items and get the sum of the calories - add to data structure
      let total = 0;

      data.items.forEach(item => {
        total += item.calories;
      });

      data.totalCalories = total;

      return data.totalCalories;
    },

    logData: function() {
      return data;
    }
  };
})();

const UICtrl = (function() {
  // UISelectors Object Literals
  const UISelectors = {
    // Making this itemIDs list so if the id gets changed we only need to update it in one spot
    // Rather than updating a bunch of ul's
    itemList: "#item-list",
    addBtn: ".add-btn",
    backBtn: ".back-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    itemName: "#item-name",
    itemCalories: "#item-calories",
    totalCalories: ".total-calories",
    listItems: "#item-list li",
    clearBtn: ".clear-btn"
  };

  // *functions pertaining to user interface //
  return {
    // Gets called when app initializes, populates the list with the items from the data structure.
    populateItemList: function(items) {
      let html = "";

      // Run through the items and make html for each item in the array
      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item a fa-pencil"></i>
        </a>
      </li>`;
      });

      //Insert the generated item html into the list

      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getUISelectors: function() {
      return UISelectors;
    },

    // Grab the values from the input forms.
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemName).value,
        calories: document.querySelector(UISelectors.itemCalories).value
      };
    },

    addItemToList: function(item) {
      // Make the list visible
      document.querySelector(UISelectors.itemList).style.display = "block";

      // Create li element and add to ul
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;

      //   Add html
      li.innerHTML = `<strong>${item.name}: </strong> <em>${
        item.calories
      } Calories</em>
    <a href="#" class="secondary-content">
      <i class="edit-item a fa-pencil"></i>
    </a>`;

      // Insert the li element into the list
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },

    updateListItem: function(item) {
      // Returning the HTML list items in a node list and switch to array
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);

      listItems.forEach(li => {
        const itemID = li.getAttribute("id");

        // Check if li ID is equal to the data struct item ID
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${
            item.name
          }: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item a fa-pencil"></i>
        </a>`;
        }
      });

      // Update total calories
    },

    deleteListItem: function(itemID) {
      const idName = `item-${itemID}`;
      document.getElementById(idName).remove();
    },

    clearFields: function() {
      document.querySelector(UISelectors.itemName).value = "";
      document.querySelector(UISelectors.itemCalories).value = "";
    },

    clearListItems: function() {
      let list = document.querySelectorAll(UISelectors.listItems);

      // Convert to array of HTML elements
      list = Array.from(list);

      // Use .remove() on all the HTML elements in the array

      list.forEach(item => {
        item.remove();
      });
    },

    addItemToForm: function() {
      // Update the inputs with the edit item which was set before this function call
      document.querySelector(
        UISelectors.itemName
      ).value = ItemCtrl.getEditItem().name;

      document.querySelector(
        UISelectors.itemCalories
      ).value = ItemCtrl.getEditItem().calories;

      // Continue to update button UI
      UICtrl.showEditState();
    },

    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },

    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },

    // *State functions

    setInitialState: function() {
      // Make sure that the inputs are clear
      UICtrl.clearFields();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "block";
    },

    showEditState: function() {
      // Make sure that the inputs are clear
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    }
  };
})();

const App = (function(ItemCtrl, UICtrl, StorageCtrl) {
  const loadEventListeners = function() {
    // We made a UI Selectors Object Literal to hold all the ids/classes from the html.
    const UISelectors = UICtrl.getUISelectors();

    // *Disable the enter key
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        return false;
      }
    });

    // *ADD BTN Steps: 1) Get input values 2) Create new item object/ add to data struct/ add to list. 3) update total calories 4) clear fields
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", function(e) {
        e.preventDefault();

        // Grab the name/calorie object literal from the getItemInput method.
        const input = UICtrl.getItemInput();

        // If either of the inputs are empty we don't want to continue.
        if (input.name === "" || input.calories === "") {
          // Else we will continue to add that item to the list.
        } else {
          // Add item to the data structure and retrieve a new Item Object from the method - add to list
          const newItem = ItemCtrl.addItem(input.name, input.calories);
          UICtrl.addItemToList(newItem);

          // Set the total calories and update the UI to show new balance
          const totalCalories = ItemCtrl.getTotalCalories();
          UICtrl.showTotalCalories(totalCalories);

          // Store in local storage

          StorageCtrl.storeItem(newItem);

          // Clear the input fields
          UICtrl.clearFields();
        }
      });

    // *EDIT BTN Steps: 1) Use event delegation to get the edit click. 2) Get the class name of the list item. 3) Splice ID # from class name.
    // * 4) Get actual item to edit from data struct/ Set the edit item in data struct 5) Update the UI
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", function(e) {
        e.preventDefault();

        // Use event bibbling to get the click event on edit btn
        if (e.target.classList.contains("edit-item")) {
          // Get the list item id (item-0, item1, etc...) - from the parents parent (list item)
          const listItemID = e.target.parentNode.parentNode.id;

          // Get the number from the class name
          const split = listItemID.split("-");
          const actualID = parseInt(split[1]);

          // Get the item to edit from data struct
          const itemToEdit = ItemCtrl.getItemById(actualID);

          // Set the current item in data struct
          ItemCtrl.setEditItem(itemToEdit);

          // Update the inputs/buttons to edit item layout.
          UICtrl.addItemToForm();
        }
      });

    // *UPDATE BTN steps: 1) Get the input values. 2) Update data struct. 3) Update UI
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", function(e) {
        e.preventDefault();

        const input = UICtrl.getItemInput();

        if (input.name === "" || input.calories === "") {
          // Else we will continue to add that item to the list.
        } else {
          // Get the input values and update the item in the data struct
          const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

          // Update the item in the local storage

          StorageCtrl.updateItem(updatedItem);

          // Update the UI with new updated item.
          UICtrl.updateListItem(updatedItem);

          // Set the total calories and update the UI to show new balance
          const totalCalories = ItemCtrl.getTotalCalories();
          UICtrl.showTotalCalories(totalCalories);

          UICtrl.clearFields();
        }
      });

    // *BACK BTN
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", function(e) {
        e.preventDefault();
        UICtrl.setInitialState();
      });

    // *DELETE BTN Steps: Delete item from data struct and UI
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", function(e) {
        e.preventDefault();

        const currentItem = ItemCtrl.getEditItem();

        // Delete from data struct

        ItemCtrl.deleteItem(currentItem.id);

        // Delete from local storage

        StorageCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearFields();

        UICtrl.setInitialState();
      });

    // *CLEAR BTN Steps: Delete item from data struct and UI
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", function(e) {
        e.preventDefault();

        ItemCtrl.clearAllItems();

        console.log(ItemCtrl.logData());

        const totalCalories = ItemCtrl.getTotalCalories();

        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearListItems();

        UICtrl.clearFields();

        UICtrl.setInitialState();

        UICtrl.hideList();
      });
  };

  // *INIT: 1) Set initial UI. 2) Fetch items from data struct/ check if empty - If not empty then populate the list. 3) Load listeners  //
  return {
    init: function() {
      // Set initial state - hides buttons
      UICtrl.setInitialState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // If there are no items in the array then we want to hide the list b/c there is an ugly line.
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // If there are items in the items array then we will procede to make html for them an insert them into the list.
        UICtrl.populateItemList(items);
      }
      // Wait for click event
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();

let db;

const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function(event){
    const db = event.target.result;

    db.createObjectStore('new_budget', { autoIncremenet: true });
}

// upon a successful 
request.onsuccess = function(event) {
  // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
  db = event.target.result;

  // check if app is online, if yes run uploadPizza() function to send all local db data to api
  if (navigator.onLine) {
    // we haven't created this yet, but we will soon, so let's comment it out for now
    uploadBudget();
  }
};

request.onerror = function(event) {
  // log error here
  console.log(event.target.errorCode);
};

function saveRecord(record){

    // open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_budget'], 'readwrite');

    // access the object store for 'new _budget
    const budgetObjectStore = transaction.objectStore('new_budget');

    //add the record to you store with add method
    budgetObjectStore.add(record);
}

function uploadBudget(){
  //open a transaction on you db
  const transaction = db.transaction(['new_budget'], 'readwrite');

  //access your object store
  const budgetObjectStore = transaction.objectStore('new_budget');

  //get all records from store and set to a varaible
  const getAll = budgetObjectStore.getAll();

  
  //upon a succesful .getAll() exectution, run this function
  getAll.onsuccess = function(){
      //if there wa data in indexedDB's store, lets send it to the api server
      if(getAll.result.length > 0){
          fetch('/api/transaction', {
              method: 'POST',
              body: JSON.stringify(getAll.result),
              headers: {
                  Accept: 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
              }
          })
          .then(response => response.json())
          .then(serverResponse => {
              if(serverResponse.message){
                  throw new Error(serverResponse);
              }
              //open one more transaction
              const transaction = db.transaction(['new_budget'], 'readwrite');
              //access the new_pizza object store
              const budgetObjectStore = transaction.objectStore('new_budget');
              //clear all items in your store
              budgetObjectStore.clear();

              alert('all saved budgets has been submitted');
          })
          .catch(err => {
              console.log(err);
          })
      }
  }

}

// listen for app coming back online
window.addEventListener('online', uploadBudget);
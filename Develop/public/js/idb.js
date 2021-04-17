let db;

const request = indexDB.open('budget', 1);

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
    // uploadPizza();
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
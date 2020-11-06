var db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoincrement: true });
};

request.onsuccess = function(event) {
    db = event.taget.result;

    if(navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function(event) {
    // Log error
    console.log("Error" + event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");

    store.add(record);
};

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch("/api/ransaction/bulk", {
                mehod: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-type": "application/json"
                }
            }).then(response => response.json()).then(() => {
                const transaction = db.transaction(["pending"], "readwrite");
                const store = transaction.objectStore("pending");

                store.clear();
            })
        }
    }
}

window.addEventListener("online", checkDatabase);
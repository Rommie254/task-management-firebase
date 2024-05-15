// Initialize Firebase with your config parameters 
firebase.initializeApp({
    apiKey: "AIzaSyDSgoQ3mRA8pOKE_yXdyFOCyiAMi1xA704",
    authDomain: "plp-apps-7c6ec.firebaseapp.com",
    projectId: "plp-apps-7c6ec",
    storageBucket: "plp-apps-7c6ec.appspot.com",
    messagingSenderId: "1063819597285",
    appId: "1:1063819597285:web:da453396ec57dd81e04b0c"
});

// Variable that references the database 
const db = firebase.firestore();

// Function to add tasks to the database
function addTask() {
    const taskInput = document.getElementById("task-input");
    const task = taskInput.value.trim(); //trim method removes empty space at the beginning and end of the value
    if (task !== "") { //ascertains that input is not empty
        db.collection("tasks").add({
            task: task,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        taskInput.value = "";
        console.log("Task added.")
    }
}

// Function to render tasks

function renderTasks(doc) {
    const taskList = document.getElementById("task-list");
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";
    taskItem.setAttribute ("data-id", doc.id)
    taskItem.innerHTML = `
    <span>${doc.data().task}</span>
    <button onclick="deleteTask('${doc.id}')">Delete</button>
    `;
    taskList.appendChild(taskItem);

}

// Real-time listener for added and removed tasks 
db.collection("tasks")
    .orderBy("timestamp", "asc")
    .onSnapshot(snapshot => {
        const changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type === "added") {
                renderTasks(change.doc);
            } else if (change.type === "removed"){
                removeTask(change.doc.id);
            }
        });
    });

// Function to delete a task
function deleteTask(id) {
    db.collection("tasks").doc(id).delete();
    console.log("Task deleted.");
}

// Function to remove task from DOM
function removeTask(id){
    const taskList = document.getElementById("task-list");
    const taskItem = taskList.querySelector(`[data-id='${id}']`);
    if (taskItem) {
        taskList.removeChild(taskItem);
    }
}
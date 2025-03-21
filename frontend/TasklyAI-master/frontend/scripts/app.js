// function sendMessage(){
//     const userMessage =document.querySelector(".input-container textarea").value;
//     if(userMessage.length){
//        // alert(userMessage);
//         document.querySelector(".input-container textarea").value ="";
//         document.querySelector("#chat-content ").insertAdjacentHTML("beforeend",`
//             <div class="user">
//              <p> ${userMessage} </p>
//              </div>`);
//     }
// }
// document.querySelector(".input-container .icons .fa-arrow-up")
// .addEventListener("click",()=>sendMessage());
// const socket = io();

// // Function to send message
// function sendMessage() {
//     const chatInput = document.querySelector(".input-container textarea");
//     const userMessage = chatInput.value.trim();

//     if (userMessage.length) {
//         addMessage(userMessage, "user"); // Show user message first
//         socket.emit("chat message", userMessage); // Send message to server
//         chatInput.value = ""; // Clear input
//         chatInput.style.height = "auto"; // Reset textarea height
//     }
// }

// // Function to add message to chat
// function addMessage(msg, sender) {
//     const chatContent = document.querySelector("#chat-content");
//     chatContent.insertAdjacentHTML("beforeend", `
//         <div class="${sender}">
//             <p>${msg}</p>
//         </div>`);
//     chatContent.scrollTop = chatContent.scrollHeight; // Auto-scroll
// }

// // Listen for AI response from the server
// socket.on("ai response", (msg) => {
//     addMessage(msg, "model"); // Show AI response
// });

// // Attach event listener to send button
// document.querySelector(".input-container .icons .fa-arrow-up")
//     .addEventListener("click", sendMessage);

// // Also send message when Enter is pressed
// document.querySelector(".input-container textarea")
//     .addEventListener("keypress", function (event) {
//         if (event.key === "Enter" && !event.shiftKey) {
//             event.preventDefault();
//             sendMessage();
//         }
//     });

const socket = io();
let welcomeMessageShown = true; // Track if welcome message is visible
let orderMyTasksMessageShown = false; // Track if welcome message is visible

// // Function to send message
// function sendMessage() {
//     const chatInput = document.querySelector(".input-container textarea");
//     const userMessage = chatInput.value.trim();


//     if (userMessage.length) {
//      //   addMessage(userMessage, "user"); // Show user message first
//      if (welcomeMessageShown) {
//         document.querySelector(".welcome").style.display = "none";
//         welcomeMessageShown = false; // Set flag to false after first message
//     }
//         socket.emit("chat message", userMessage); // Send message to server
//         chatInput.value = ""; // Clear input
//         chatInput.style.height = "auto"; // Reset textarea height
//     }
// }
// Function to send message
function sendMessage_AskAnyQuestion() {
    const chatInput = document.querySelector(".input-container textarea");
    const userMessage = chatInput.value.trim();
    

    if (userMessage.length) {
     //   addMessage(userMessage, "user"); // Show user message first
     if (welcomeMessageShown) {
        document.querySelector(".welcome").style.display = "none";
        welcomeMessageShown = false; // Set flag to false after first message
    }
        socket.emit("chat message", userMessage); // Send message to server
        chatInput.value = ""; // Clear input
        chatInput.style.height = "auto"; // Reset textarea height
    }
}
// Function to send message
function sendMessage_orderMyTasks() {
    const chatInput = document.querySelector(".input-container textarea");
    const userMessage = chatInput.value.trim();
    

    if (userMessage.length) {
     //   addMessage(userMessage, "user"); // Show user message first
     if (welcomeMessageShown) {
        document.querySelector(".welcome").style.display = "none";
        welcomeMessageShown = false; // Set flag to false after first message
    }
        const timestamp = Date.now();
        const header= `order this tasks depend on recent  date is ${timestamp} the day date and write current dates for each task  and order it as a list : `;
        userMessage.value = header.value +userMessage.value;
        console.log(userMessage);
        socket.emit("chat message", userMessage); // Send message to server
        chatInput.value = ""; // Clear input
        chatInput.style.height = "auto"; // Reset textarea height
    }
}


// Function to add message to chat
function addMessage(msg, sender) {
    const chatContent = document.querySelector("#chat-content");
    chatContent.insertAdjacentHTML("beforeend", `
        <div class="${sender}">
            <p>${msg}</p>
        </div>`);
    chatContent.scrollTop = chatContent.scrollHeight; // Auto-scroll
}

// Listen for messages from the server (both user and AI)
socket.on("chat message", (msg) => {
    let sender = "user"; // Assume user message
    if (msg.startsWith("AI: ")) {
        sender = "model";
        msg = msg.substring(4); // Remove "AI: " prefix
    }
    addMessage(msg, sender); // Show message
});

// // Attach event listener to send button
// document.querySelector(".input-container .icons .fa-arrow-up")
//     .addEventListener("click", sendMessage);
// Attach event listener to send button
document.querySelector(".input-container .icons .fa-arrow-up")
    .addEventListener("click", sendMessage_orderMyTasks());
    
//after click on ask any question , the defualt message will apper then wait user to enter what he want
//after click on order my tasks , the defualt message will apper then wait user to enter what he want
// document.querySelector(".selectionList .selectionItem span .orderMyTasks")
//     .addEventListener("click", showOrderMyTaskMessage());

    document.addEventListener('click', function() {
        const element = document.querySelector(".selectionList .selectionItem span .orderMyTasks");
        if (element) {
            element.addEventListener('click', function() {
                console.log('Element clicked!');
                showOrderMyTaskMessage()
            });
        }
    });

    function showOrderMyTaskMessage(){
        if (!orderMyTasksMessageShown){
            addMessage("To order your tasks perfect , \n u should Write all your Tasks in the same message and I will Order it to you , ","model");
            showOrderMyTaskMessage =true;
        }
    }

// Also send message when Enter is pressed
// document.querySelector(".input-container textarea")
//     .addEventListener("keypress", function (event) {
//         if (event.key === "Enter" && !event.shiftKey) {
//             event.preventDefault();
//             sendMessage();
//         }
//     });
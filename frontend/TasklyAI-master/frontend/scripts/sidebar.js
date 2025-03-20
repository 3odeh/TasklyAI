document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");


    
      
    // Load sidebar content dynamically
    fetch("components/sidebar.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then(data => {
            console.log("Sidebar loaded successfully");
            document.getElementById("sidebar-container").innerHTML = data;

            let menuItems = document.querySelectorAll(".menu_item, .menu_item_logout, .help_item");
            let contentSections = document.querySelectorAll(".content-section");

            // Set default active menu item (Dashboard)
            const defaultMenuItem = document.getElementById("dashboardMenu");
            if (defaultMenuItem) {
                defaultMenuItem.classList.add("active");
                console.log("Dashboard menu item set as active");
            } else {
                console.error("Dashboard menu item not found");
            }

            // Show Dashboard content by default
            const dashboardContent = document.getElementById("dashboard-content");
            if (dashboardContent) {
                dashboardContent.style.display = "block";
                console.log("Dashboard content displayed");
            } else {
                console.error("Dashboard content element not found");
            }

            // Event listener for menu item clicks
            menuItems.forEach(item => {
                item.addEventListener("click", function () {
                    console.log(`Menu item clicked: ${this.id}`);

                    // Remove active class from all menu items
                    menuItems.forEach(menu => menu.classList.remove("active"));
                    // Add active class to the clicked menu item
                    this.classList.add("active");

                    // Hide all content sections
                    contentSections.forEach(section => {
                        section.style.display = "none";
                    });

                    // Show the corresponding content section
                    if (this.id === "dashboardMenu") {
                        const dashboardContent = document.getElementById("dashboard-content");
                        if (dashboardContent) {
                            dashboardContent.style.display = "block";
                            if (!dashboardContent.innerHTML.trim()) {
                                fetch("dashboard.html")
                                    .then(response => response.text())
                                    .then(data => { 
                                        dashboardContent.innerHTML = data;
                                        console.log("Dashboard content loaded dynamically");
                                    })
                                    .catch(error => console.error("Error loading dashboard:", error));
                            }
                        }
                    } else if (this.id === "tasksSection") {
                        const tasksContent = document.getElementById("tasks-content");
                        if (tasksContent) {
                            if (!tasksContent.innerHTML.trim()) {
                                fetch("tasks.html")
                                    .then(response => response.text())
                                    .then(data => {
                                        tasksContent.innerHTML = data;
                                        tasksContent.style.display = "block";
                                        console.log("Tasks content loaded dynamically");
                                    })
                                    .catch(error => console.error("Error loading tasks:", error));
                            } else {
                                tasksContent.style.display = "block";
                            }
                        }
                    } else if (this.id === "chatSection") {
                        const chatContent = document.getElementById("chat-content");
                        if (chatContent) {
                            chatContent.style.display = "block";
                        }
                    } else if (this.id === "settings") {
                        const settingsContent = document.getElementById("settings-content");
                        if (settingsContent) {
                            settingsContent.style.display = "block";
                        }
                    }
                });
            });
        })
        .catch(error => console.error("Error loading sidebar:", error));
});
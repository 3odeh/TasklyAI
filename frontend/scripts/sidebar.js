document.addEventListener("DOMContentLoaded", function () {
    // Load sidebar content dynamically
    fetch("../components/sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sidebar-container").innerHTML = data;

            // Select menu items and content sections
            let menuItems = document.querySelectorAll(".menu_item, .menu_item_logout, .help_item");
            let contentSections = document.querySelectorAll(".content-section");

            // Set default active menu item (Dashboard)
            const defaultMenuItem = document.getElementById("dashboardMenu");
            defaultMenuItem.classList.add("active");

            // Show Dashboard content by default
            document.getElementById("dashboard-content").style.display = "block";

            // Event listener for menu item clicks
            menuItems.forEach(item => {
                item.addEventListener("click", function () {
                    // Remove 'active' class from all items
                    menuItems.forEach(menu => menu.classList.remove("active"));
                    // Add 'active' class to the clicked item
                    this.classList.add("active");

                    // Hide all content sections
                    contentSections.forEach(section => {
                        section.style.display = "none";
                    });

                    // Show the selected content section based on menu item clicked
                    if (this.id === "dashboardMenu") {
                        document.getElementById("dashboard-content").style.display = "block";
                    } else if (this.id === "productsMenu") {
                        document.getElementById("tasks-content").style.display = "block";
                    } else if (this.id === "orders") {
                        document.getElementById("chat-content").style.display = "block";
                    } else if (this.id === "settings") {
                        document.getElementById("settings-content").style.display = "block";
                    }
                });
            });
        })
        .catch(error => console.error("Error loading sidebar:", error));
});

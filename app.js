
 // ==========================================
 // Toast Notification Function
 // ==========================================

function showToast(message) {

    const toast = document.createElement("div");

    toast.textContent = message;

    toast.style.position = "fixed";
    toast.style.bottom = "30px";
    toast.style.right = "30px";
    toast.style.backgroundColor = "#071952";
    toast.style.color = "white";
    toast.style.padding = "15px 20px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
    toast.style.zIndex = "2000";
    toast.style.fontWeight = "bold";

    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(function () {
        toast.remove();
    }, 3000);
}


// ==========================================
// Smooth Scrolling for Book Buttons
// ==========================================

const bookButtons = document.querySelectorAll('a[href="#booking"]');

bookButtons.forEach(function (button) {

    button.addEventListener("click", function (event) {

        const bookingSection = document.querySelector("#booking");

        if (bookingSection) {

            event.preventDefault();

            bookingSection.scrollIntoView({
                behavior: "smooth"
            });

            showToast("Opening the ticket booking form...");
        }

    });

});


// ==========================================
// Activity 5 - DOM Manipulation
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const demo = document.getElementById("demo");

    if (demo) {

        demo.textContent =
            "IPL 2026 is an exciting T20 cricket tournament featuring " +
            "top teams and players. Fans can watch thrilling matches " +
            "and book tickets to experience the action live at the stadium.";

    }


    // ==========================================
    // Booking Form Submission
    // ==========================================

    const bookingForm = document.querySelector(".booking-container form");

    if (bookingForm) {

        bookingForm.addEventListener("submit", function (event) {

            // Prevent actual form submission
            event.preventDefault();

            showToast("Form details validated! Booking is a demo only.");

        });

    }

});


/* =====================================
   ACTIVITY 7 - LIVE BOOKING SUMMARY
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    // Form controls
    const matchSelect = document.getElementById("match");
    const categorySelect = document.getElementById("category");
    const ticketInput = document.getElementById("tickets");

    // Summary card elements
    const summaryMatch = document.getElementById("summaryMatch");
    const summaryCategory = document.getElementById("summaryCategory");
    const summaryQuantity = document.getElementById("summaryQuantity");
    const summaryPrice = document.getElementById("summaryPrice");
    const summaryTotal = document.getElementById("summaryTotal");

    // Stop if this page has no summary card (e.g. booking.html)
    if (!matchSelect || !categorySelect || !ticketInput || !summaryMatch) {
        return;
    }

    // Prices per match and stand (same as the schedule table)
    const ticketPrices = {
        "CSK vs MI":   { General: 800, Premium: 1500, VIP: 3000 },
        "RCB vs KKR":  { General: 900, Premium: 1800, VIP: 3500 },
        "MI vs KKR":   { General: 700, Premium: 1400, VIP: 2800 },
        "SRH vs CSK":  { General: 750, Premium: 1600, VIP: 3200 }
    };

    function updateBookingSummary() {

        const match = matchSelect.value;
        const category = categorySelect.value;

        // Keep quantity between 1 and 10
        let quantity = parseInt(ticketInput.value) || 0;
        quantity = Math.min(Math.max(quantity, 0), 10);

        const price =
            (ticketPrices[match] && ticketPrices[match][category]) || 0;

        summaryMatch.textContent = match || "Not selected";
        summaryCategory.textContent = category || "Not selected";
        summaryQuantity.textContent = quantity;
        summaryPrice.textContent = price.toLocaleString("en-IN");
        summaryTotal.textContent = (price * quantity).toLocaleString("en-IN");
    }

    // Change events -> update summary + toast
    matchSelect.addEventListener("change", function () {
        updateBookingSummary();
        showToast("Match selected: " + (matchSelect.value || "none"));
    });

    categorySelect.addEventListener("change", function () {
        updateBookingSummary();
        showToast("Stand category updated!");
    });

    ticketInput.addEventListener("change", function () {
        if (ticketInput.value > 10) ticketInput.value = 10;
        if (ticketInput.value < 1) ticketInput.value = 1;
        updateBookingSummary();
        showToast("Ticket quantity updated!");
    });

    // Live update while typing (no toast, so no spam)
    ticketInput.addEventListener("input", updateBookingSummary);

    // Initial state
    updateBookingSummary();
});

/* =====================================
   ACTIVITY 8 - RESPONSIVE LAYOUT + INTERACTION
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ----- Hamburger menu -----
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", function () {
            mainNav.classList.toggle("open");
        });

        // Close the menu after tapping a link
        mainNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                mainNav.classList.remove("open");
            });
        });
    }

    // ----- Filter match cards by team -----
    const teamFilter = document.getElementById("teamFilter");
    const matchCards = document.querySelectorAll(".match-card");

    if (teamFilter) {

        teamFilter.addEventListener("change", function () {

            const selectedTeam = teamFilter.value;

            matchCards.forEach(function (card) {

                const teams = card.dataset.teams.split(" ");

                if (selectedTeam === "all" || teams.includes(selectedTeam)) {
                    card.classList.remove("hidden");
                } else {
                    card.classList.add("hidden");
                }

            });

            showToast("Showing matches for: " + teamFilter.options[teamFilter.selectedIndex].text);
        });
    }

    // ----- Grid / List view toggle -----
    const matchGrid = document.getElementById("matchGrid");
    const gridViewBtn = document.getElementById("gridViewBtn");
    const listViewBtn = document.getElementById("listViewBtn");

    if (matchGrid && gridViewBtn && listViewBtn) {

        gridViewBtn.addEventListener("click", function () {
            matchGrid.classList.remove("list-view");
            gridViewBtn.classList.add("active");
            listViewBtn.classList.remove("active");
            showToast("Grid view enabled");
        });

        listViewBtn.addEventListener("click", function () {
            matchGrid.classList.add("list-view");
            listViewBtn.classList.add("active");
            gridViewBtn.classList.remove("active");
            showToast("List view enabled");
        });
    }

});

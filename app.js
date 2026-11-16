
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

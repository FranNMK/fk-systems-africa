/* public/js/main.js - Scroll Reveal IntersectionObserver */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Select all elements with the 'reveal' class
    const revealElements = document.querySelectorAll(".reveal");

    // 2. Define the observer configuration
    const observerOptions = {
      root: null, // Uses the browser viewport
      rootMargin: "0px", // No extra margins
      threshold: 0.15 // Triggers when 15% of the element is visible
    };

    // 3. Create the observer callback function
    const revealCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add the 'active' class to trigger the CSS transition
          entry.target.classList.add("active");
          
          // Stop observing if you only want the animation to happen once
          observer.unobserve(entry.target);
        }
      });
    };

    // 4. Initialize the observer and attach it to elements
    const observer = new IntersectionObserver(revealCallback, observerOptions);
    
    revealElements.forEach(element => {
      observer.observe(element);
    });
});
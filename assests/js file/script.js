const hamburger = document.querySelector('.toggle-btn');
const toggler = document.querySelector('.icon');
const sidebar = document.querySelector("#sidebar");

if (hamburger && toggler && sidebar) { // Check if elements exist
    hamburger.addEventListener("click", function() {
        sidebar.classList.toggle("expand");
        toggler.classList.toggle("bxs-chevrons-right icon");
        toggler.classList.toggle("bxs-chevrons-left icon");
    });
}


// Add your JavaScript code here



function toggleSidebar() {

    const sidebar = document.getElementById('sidebar');

    sidebar.classList.toggle('collapsed');

}
document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1,
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Optional: Add background color
                borderColor: 'rgba(75, 192, 192, 1)', // Optional: Add border color
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});


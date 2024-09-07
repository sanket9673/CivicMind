// const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');

// sideLinks.forEach(item => {
//     const li = item.parentElement;
//     item.addEventListener('click', () => {
//         sideLinks.forEach(i => {
//             i.parentElement.classList.remove('active');
//         })
//         li.classList.add('active');
//     })
// });

// const menuBar = document.querySelector('.content nav .bx.bx-menu');
// const sideBar = document.querySelector('.sidebar');

// menuBar.addEventListener('click', () => {
//     sideBar.classList.toggle('close');
// });

// const searchBtn = document.querySelector('.content nav form .form-input button');
// const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
// const searchForm = document.querySelector('.content nav form');

// searchBtn.addEventListener('click', function (e) {
//     if (window.innerWidth < 576) {
//         e.preventDefault;
//         searchForm.classList.toggle('show');
//         if (searchForm.classList.contains('show')) {
//             searchBtnIcon.classList.replace('bx-search', 'bx-x');
//         } else {
//             searchBtnIcon.classList.replace('bx-x', 'bx-search');
//         }
//     }
// });

// window.addEventListener('resize', () => {
//     if (window.innerWidth < 768) {
//         sideBar.classList.add('close');
//     } else {
//         sideBar.classList.remove('close');
//     }
//     if (window.innerWidth > 576) {
//         searchBtnIcon.classList.replace('bx-x', 'bx-search');
//         searchForm.classList.remove('show');
//     }
// });

// const toggler = document.getElementById('theme-toggle');

// toggler.addEventListener('change', function () {
//     if (this.checked) {
//         document.body.classList.add('dark');
//     } else {
//         document.body.classList.remove('dark');
//     }
// });


// Sidebar link functionality
const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');
const sections = document.querySelectorAll('.content-section');

sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior

        // Remove active class from all sidebar items
        sideLinks.forEach(i => {
            i.parentElement.classList.remove('active');
        });

        // Hide all content sections
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // Add active class to the clicked sidebar item
        li.classList.add('active');

        // Show the relevant content section
        const contentId = item.getAttribute('data-content');
        document.getElementById(`${contentId}-content`).style.display = 'block';
    });
});

// Menu bar toggle functionality
const menuBar = document.querySelector('.content nav .bx.bx-menu');
const sideBar = document.querySelector('.sidebar');

menuBar.addEventListener('click', () => {
    sideBar.classList.toggle('close');
});

// Search button functionality
const searchBtn = document.querySelector('.content nav form .form-input button');
const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
const searchForm = document.querySelector('.content nav form');

searchBtn.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault();
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchBtnIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchBtnIcon.classList.replace('bx-x', 'bx-search');
        }
    }
});

// Adjustments on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        sideBar.classList.add('close');
    } else {
        sideBar.classList.remove('close');
    }
    if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
});

// Theme toggle functionality
const toggler = document.getElementById('theme-toggle');

toggler.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});

function fetchBestsellersBooks() {
    let apiKey = "JCtAmX6pDbeHpQE997WDMstTMzKET9Gq";
    let url = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${apiKey}`;
    // https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=JCtAmX6pDbeHpQE997WDMstTMzKET9Gq
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            updateCarousel(data.results.books);
            // if (data.results && data.results.books) {
            //  updateCarousel(data.results.books);
            // }
        })
        .catch((error) => console.error("Error:", error));
}
function updateCarousel(books) {
    console.log(books);
    let carouselContainer = $("#carouselExample .carousel-inner");
    carouselContainer.empty();
    books.forEach((book, index) => {
        console.log(book)
        let isActive;
        if (index === 0) {
            isActive = "active";
        } else {
            isActive = "";
        }
        let carouselItem = $(`
            <div class="carousel-item ${isActive}">
			<div class="d-flex">
                <div><img src="${book.book_image}" class="d-block" alt="${book.title}" /></div>
                <div>
                    <h5>${book.title}</h5>
                    <p>${book.description}</p>
                </div>
            </div>
			</div>
        `);
        carouselContainer.append(carouselItem);
    });
}
$(document).ready(function () {
    fetchBestsellersBooks();
});
// var mySwiper = new Swiper(".swiper-container", {
//  direction: "vertical",
//  loop: true,
//  pagination: ".swiper-pagination",
//  grabCursor: true,
//  speed: 1000,
//  paginationClickable: true,
//  parallax: true,
//  autoplay: false,
//  effect: "slide",
//  mousewheelControl: 1
//   });
// $("#book-search-form").submit(function (e) {
//  e.preventDefault();
//  let searchTermValue = $("#search-term").val().trim();
//  if (!searchTermValue) {
//      console.log("No search term provided");
//      return;
//  }
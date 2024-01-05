$(document).ready(function () {
	function fetchBookData(searchTerm) {
		let queryURL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
			searchTerm
		)}&key=AIzaSyBG54r1IMAcrbAdHjU8BR_otxstaWVMF-8`;

		return fetch(queryURL)
			.then((response) => response.json())
			.catch((error) => console.error("Error:", error));
	}

	function createBookCard(item) {
		if (!item.volumeInfo) return null;

		//note calling api to get needed data
		let title = item.volumeInfo.title || "No title available";
		let author = item.volumeInfo.authors
			? item.volumeInfo.authors.join(", ")
			: "Unknown author(s)";
		let rating = item.volumeInfo.averageRating
			? item.volumeInfo.averageRating
			: "No rating available";
		let releaseDate = item.volumeInfo.publishedDate
			? item.volumeInfo.publishedDate
			: "No published date available";
		let pageCount = item.volumeInfo.pageCount
			? item.volumeInfo.pageCount
			: "No page count available";
		let publisher = item.volumeInfo.publisher
			? item.volumeInfo.publisher
			: "No publisher available";
		let category = item.volumeInfo.categories
			? item.volumeInfo.categories
			: "No category available";
		let description = item.volumeInfo.description
			? item.volumeInfo.description
			: "No description available";
		let thumbnail = item.volumeInfo.imageLinks
			? item.volumeInfo.imageLinks.smallThumbnail
			: "path_to_default_image.jpg";

		//note Create card for each book
		let card = $("<div>")
			.addClass("card d-flex flex-column border border")
			.css({
				"border-radius": "8%",
				"background-color": "#FFFAF4",
				"margin-top": "40px",
				"margin-bottom": "40px",
				"min-height": "450px",
				display: "flex",
				"flex-direction": "column",
				"justify-content": "space-between",
			});
		let imgElement = $("<img>")
			.addClass("card-img-top")
			.attr("src", thumbnail)
			.attr("alt", title)
			.css({ "max-height": "350px", "object-fit": "contain" });
		let cardBody = $("<div>").addClass("card-body");
		let titleElement = $("<h5>").addClass("card-title text-center").text(title);
		let modalTriggerButton = $("<button>")
			.addClass("btn btn-primary d-block mx-auto ")
			.attr("data-bs-toggle", "modal")
			.attr("data-bs-target", "#bookModal")
			.css({
				"margin-top": "20px",
				"background-color": "#AFC8AD",
				"border-color": "#AFC8AD",
			})
			.text("More Details")
			.click(function () {
				$("#bookModalLabel").html(title);
				$("#bookModal #bookAuthor").html("<strong>Author</strong>: " + author);
				$("#bookModal #pageCount").html(
					"<strong>Page Count</strong>: " + pageCount
				);
				$("#bookModal #publisher").html(
					"<strong>Publisher</strong>: " + publisher
				);
				$("#bookModal #category").html(
					"<strong>Category</strong>: " + category
				);
				$("#bookModal #releaseDate").html(
					"<strong>Release Date</strong>: " + releaseDate
				);
				$("#bookModal #bookDescription").html(
					"<strong>Description</strong>: " + description
				);
				$("#bookModal #bookRating").html("<strong>Rating</strong>: " + rating);
				$("#bookModal #bookImage").attr("src", thumbnail);
			});

		cardBody.append(titleElement, imgElement, modalTriggerButton);
		card.append(cardBody);

		return $("<div>").addClass("col-md-4 p-3").append(card);
	}

	//note adding boostrap row to display books in rows of 3
	function appendBookRow(bookCards, container) {
		let currentRow = $("<div>").addClass("row");
		bookCards.forEach((card, index) => {
			currentRow.append(card);

			if ((index + 1) % 3 === 0) {
				container.append(currentRow);
				currentRow = $("<div>").addClass("row");
			}
		});

		if (currentRow.children().length > 0) {
			container.append(currentRow);
		}
	}

	//note displaying clickable to display previously searched data again
	function displaySearchHistory(searchHistory) {
		let searchListContainer = $('<div class="search-history-container"></div>');

		searchHistory.forEach(function (searchTerm) {
			let listItem = $('<button class="btn btn-primary m-1"></button>').text(
				searchTerm
			);

			listItem.click(function () {
				handleSearch(searchTerm);
			});

			searchListContainer.append(listItem);
		});

		$("#book-results").html(searchListContainer);
	}

	function handleSearch(searchTerm) {
		fetchBookData(searchTerm).then((data) => {
			if (data && data.items) {
				$("#search-term").val("");
				$("#book-results").empty();

				const bookCards = data.items
					.map(createBookCard)
					.filter((card) => card !== null);
				appendBookRow(bookCards, $("#book-results"));
			} else {
				console.log("No books found for the search term");
			}
		});
	}
	//note localstorage functionality
	let searchHistory =
		JSON.parse(localStorage.getItem("bookSearchHistory")) || [];
	displaySearchHistory(searchHistory);

	$("#book-search-form").submit(function (event) {
		event.preventDefault();

		let inputValue = $("#search-term").val().trim();
		if (inputValue) {
			searchHistory.push(inputValue);
			if (searchHistory.length > 5) {
				searchHistory.shift();
			}
			localStorage.setItem("bookSearchHistory", JSON.stringify(searchHistory));
			displaySearchHistory(searchHistory);

			handleSearch(inputValue);
		}
	});
});

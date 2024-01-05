$("#book-search-form").submit(function (e) {
	e.preventDefault();

	let searchTermValue = $("#search-term").val().trim();
	if (!searchTermValue) {
		console.log("No search term provided");
		return;
	}

	let queryURL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
		searchTermValue
	)}&key=AIzaSyBG54r1IMAcrbAdHjU8BR_otxstaWVMF-8`;

	fetch(queryURL)
		.then((response) => response.json())
		.then((data) => {
			if (data.items) {
				$("#search-term").val("");
				$("#book-results").empty();

				let currentRow = $("<div>").addClass("row");
				data.items.forEach((item, index) => {
					if (item.volumeInfo) {
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

						let column = $("<div>").addClass("col-md-4 p-5");
						let card = $("<div>")
							.addClass("card d-flex flex-column border border")
							.css({
								"border-radius": "15%",
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
						let titleElement = $("<h5>")
							.addClass("card-title text-center")
							.text(title);
						let modalTriggerButton = $("<button>")
							.addClass("btn btn-primary d-block mx-auto ")
							.attr("data-bs-toggle", "modal")
							.attr("data-bs-target", "#bookModal")
							.css("margin-top", "20px")
							.text("More Details")
							.click(function () {
								$("#bookModalLabel").html(title);
								$("#bookModal #bookAuthor").html(
									"<strong>Author</strong>: " + author
								);
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
								$("#bookModal #bookRating").html(
									"<strong>Rating</strong>: " + rating
								);
								$("#bookModal #bookImage").attr("src", thumbnail);
							});

						cardBody.append(titleElement, imgElement, modalTriggerButton);

						card.append(cardBody);
						column.append(card);

						if (index % 3 === 0 && index !== 0) {
							currentRow = $("<div>").addClass("row");
							$("#book-results").append(currentRow);
						}
						currentRow.append(column);
					}
				});
			} else {
				console.log("No books found for the search term");
			}
		})
		.catch((error) => console.error("Error:", error));
});

$(document).ready(function () {
	function displaySearchHistory(searchHistory) {
		let searchListItem = $(
			'<ul class="list-group list-group-horizontal"></ul>'
		);
		searchHistory.forEach(function (searchTerm) {
			searchListItem.append(
				$('<li class="list-group-item"></li>').text(searchTerm)
			);
		});

		$("#book-results").html(searchListItem);
	}
	let searchHistory =
		JSON.parse(localStorage.getItem("bookSearchHistory")) || [];
	displaySearchHistory(searchHistory);

	$("#book-search-form").submit(function (event) {
		event.preventDefault();

		let inputValue = $("#search-term").val();
		searchHistory.push(inputValue);
		if (searchHistory.length > 5) {
			searchHistory.shift();
		}
		localStorage.setItem("bookSearchHistory", JSON.stringify(searchHistory));
		displaySearchHistory(searchHistory);
		$("#search-term").val("");
	});
});

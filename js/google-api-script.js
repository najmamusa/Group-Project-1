$("#book-search-form").submit(function (e) {
	e.preventDefault();

	let searchTermValue = $("#search-term").val().trim();
	if (!searchTermValue) {
		console.log("No search term provided");
		return;
	}

	let queryURL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
		searchTermValue
	)}&key=AIzaSyBOi-evldG0DPPR_6ytMDMrUo6egMqyykc`;

	fetch(queryURL)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			if (data.items) {
				$("#search-term").val("");
				$("#book-results").empty();
				data.items.forEach((item) => {
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
							: "No page count available";
						let category = item.volumeInfo.categories
							? item.volumeInfo.categories
							: "No page count available";
						// let description =
						// 	item.searchInfo && item.searchInfo.textSnippet
						// 		? item.searchInfo.textSnippet
						// 		: "No description available";
						let description =
							item.volumeInfo.description && item.volumeInfo.description
								? item.volumeInfo.description
								: "No description available";
						let thumbnail = item.volumeInfo.imageLinks
							? item.volumeInfo.imageLinks.smallThumbnail
							: "path_to_default_image.jpg";

						let column = $("<div>").addClass("col-md-4");
						let card = $("<div>").addClass("card").css("border", "none");
						let imgElement = $("<img>")
							.addClass("card-img-top")
							.attr("src", thumbnail)
							.attr("alt", title)
							.css({ "max-height": "350px", "object-fit": "contain" });
						let cardBody = $("<div>").addClass("card-body");
						let titleElement = $("<h5>").addClass("card-title").text(title);
						let modalTriggerButton = $("<button>")
							.addClass("btn btn-primary")
							.attr("data-bs-toggle", "modal")
							.attr("data-bs-target", "#bookModal")
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
						$("#book-results").append(column);
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

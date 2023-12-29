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
			console.log(data);
			if (data.items) {
				$("#book-results").empty();
				data.items.forEach((item) => {
					if (item.volumeInfo) {
						let title = item.volumeInfo.title || "No title available";
						let description =
							item.searchInfo && item.searchInfo.textSnippet
								? item.searchInfo.textSnippet
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
						let descriptionElement = $("<p>")
							.addClass("card-text")
							.text(description);
						let linkElement = $("<a>")
							.attr("href", item.volumeInfo.infoLink)
							.addClass("btn btn-primary")
							.text("Learn More");

						cardBody.append(titleElement);
						cardBody.append(imgElement);
						cardBody.append(descriptionElement);
						cardBody.append(linkElement);

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

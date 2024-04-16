let addToy = true;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((data) => {
      const toyCollection = document.getElementById("toy-collection");
      data.forEach((toy) => {
        // Create card for each toy
        const card = toyCard(toy);
        // Append card to toy collection
        toyCollection.appendChild(card);

        // Add event listener to the "Like" button and "Delete" button for each toy
        handleToyActions(
          toy.id,
          card.querySelector(".like-btn"),
          card.querySelector(".delete-btn")
        );
      });
    })
    .catch((error) => console.error("Error fetching toys:", error));
});

// Function to create and append elements for each toy
function toyCard(toy) {
  const card = document.createElement("div");
  card.classList.add("card");

  const name = document.createElement("h2");
  name.textContent = toy.name;

  const image = document.createElement("img");
  image.src = toy.image;
  image.classList.add("toy-avatar");

  const likes = document.createElement("p");
  likes.textContent = `${toy.likes} Likes`;

  const likeBtn = document.createElement("button");
  likeBtn.classList.add("like-btn");
  likeBtn.id = toy.id;
  likeBtn.textContent = "Like ❤️";

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "Delete 🗑️";

  // Append child elements to the card
  card.appendChild(name);
  card.appendChild(image);
  card.appendChild(likes);
  card.appendChild(likeBtn);
  card.appendChild(deleteBtn); // Append delete button

  // Add event listener to delete button
  deleteBtn.addEventListener("click", () => {
    // Send DELETE request to remove the toy
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        // Remove the card from the DOM if successful
        if (response.ok) {
          card.remove(); // Remove the card from the DOM
        } else {
          throw new Error("Failed to delete toy");
        }
      })
      .catch((error) => console.error("Error deleting toy:", error));
  });

  return card;
}

// Increase a Toy's Likes
function handleToyActions(toyId, likeButton, _deleteButton) {
  likeButton.addEventListener("click", () => {
    // Calculate new number of likes
    const toyLikes = parseInt(
      likeButton.previousElementSibling.textContent.split(" ")[0]
    );
    const newNumberOfLikes = toyLikes + 1;

    // Send PATCH request to update likes count
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        likes: newNumberOfLikes,
      }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        // Update toy card in the DOM
        likeButton.previousElementSibling.textContent = `${updatedToy.likes} Likes`;
      })
      .catch((error) => console.error("Error updating likes:", error));
  });
}

const cardHolder = document.querySelector('.cardholder');
const createButton = document.querySelector('#create-button');

createButton.addEventListener('click', displayTitleList);

function displayTitleList() {
  cardHolder.innerHTML = '';

  fetch('http://localhost:3000/courses')
    .then(response => response.json())
    .then(data => {
      data.forEach(course => {
        const card = createCard(course);
        cardHolder.appendChild(card);
      });
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

function createCard(course) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('data-id', course.id);

  const cardImg = document.createElement('img');
  cardImg.classList.add('card-img-top');
  cardImg.src = course.image;
  card.appendChild(cardImg);

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = course.title;

  const cardText = document.createElement('p');
  cardText.classList.add('card-text');
  cardText.textContent = course.description;

  const addButton = document.createElement('button');
  addButton.classList.add('btn', 'btn-success');
  addButton.textContent = 'Add';
  addButton.addEventListener('click', function () {
    addButton.remove(); // Remove the "Add" button
  });

  const editButton = document.createElement('button');
  editButton.classList.add('btn', 'btn-primary');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', function () {
    showCardEditBox(course); // Pass the course object to the showCardEditBox function
  });

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', function () {
    deleteCard(course.id); // Pass the card ID to the deleteCard function
  });

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  cardBody.appendChild(addButton);
  cardBody.appendChild(editButton);
  cardBody.appendChild(deleteButton);

  card.appendChild(cardBody);

  return card;
}

function showCardEditBox(course) {
  const cardId = course.id;
  const cardTitle = course.title;
  const cardDescription = course.description;
  const cardImage = course.image;

  Swal.fire({
    title: 'Edit Card',
    html:
      '<input id="edit-title" class="swal2-input" placeholder="Title" value="' +
      cardTitle +
      '">' +
      '<input id="edit-image" class="swal2-input" placeholder="Image URL" value="' +
      cardImage +
      '">' +
      '<textarea id="edit-description" class="swal2-input" placeholder="Description">' +
      cardDescription +
      '</textarea>',
    focusConfirm: false,
    preConfirm: () => {
      const editedTitle = document.getElementById('edit-title').value;
      const editedImage = document.getElementById('edit-image').value;
      const editedDescription = document.getElementById('edit-description').value;

      if (validateEditInput(editedTitle, editedDescription)) {
        // Update the card content
        const updatedCard = {
          id: cardId,
          title: editedTitle,
          image: editedImage,
          description: editedDescription
        };

        updateCardInDatabase(updatedCard)
          .then(() => {
            // Update the UI with the edited card content
            updateCardUI(cardId, editedTitle, editedImage, editedDescription);
          })
          .catch(error => {
            console.log('Error:', error);
          });
      } else {
        Swal.showValidationMessage('Please fill in all the fields');
      }
    }
  });
}

function updateCardUI(cardId, editedTitle, editedImage, editedDescription) {
  const cardElement = document.querySelector(`[data-id="${cardId}"]`);
  if (cardElement) {
    const cardTitleElement = cardElement.querySelector('.card-title');
    const cardImageElement = cardElement.querySelector('.card-img-top');
    const cardTextElement = cardElement.querySelector('.card-text');

    if (cardTitleElement) {
      cardTitleElement.textContent = editedTitle;
    }

    if (cardImageElement) {
      cardImageElement.src = editedImage;
    }

    if (cardTextElement) {
      cardTextElement.textContent = editedDescription;
    }
  }
}

function updateCardInDatabase(updatedCard) {
  return fetch(`http://localhost:3000/courses/${updatedCard.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedCard)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update card in the database');
      }
    });
}

function validateEditInput(title, description) {
  return title.trim() !== '' && description.trim() !== '';
}

function deleteCard(cardId) {
  const confirmed = confirm('Are you sure you want to delete this card?');
  if (confirmed) {
    removeCardFromDatabase(cardId)
      .then(() => {
        removeCardUI(cardId);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }
}

function removeCardFromDatabase(cardId) {
  return fetch(`http://localhost:3000/courses/${cardId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete card from the database');
      }
    });
}

function removeCardUI(cardId) {
  const cardElement = document.querySelector(`[data-id="${cardId}"]`);
  if (cardElement) {
    cardElement.remove();
  }
}

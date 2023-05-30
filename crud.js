const cardHolder = document.querySelector('.cardholder');
const createButton = document.querySelector('#create-button');

createButton.addEventListener('click', displayTitleList);

function displayTitleList() {
  cardHolder.innerHTML = '';

  fetch('db.json')
    .then(response => response.json())
    .then(data => {
      data.courses.forEach(course => {
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
    showUserEditBox(id); // Pass the course object to the showCardEditBox function
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

/*-----*/
function loadTable(TraineeName = '') {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", `http://localhost:3000/Trainee?TraineeName_like=${TraineeName}`);
  xhttp.send();

  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          console.log(this.responseText);
          var trHTML = "";
          const objects = JSON.parse(this.responseText);
          for (let object of objects) {
              trHTML += "<tr>";
              trHTML += "<td>" + object["id"] + "</td>";
              trHTML += "<td>" + object["TraineeName"] + "</td>";
              trHTML += "<td>" + object["DOB"] + "</td>";
              trHTML += "<td>" + object["Gender"] + "</td>";
              trHTML += "<td>" + object["Qualification"] + "</td>";
              trHTML += "<td>" + object["TrainingRequired"] + "</td>";
              trHTML +=
                  '<td><img width="50px" src="' +
                  object["Image"] +
                  '" class="Image"></td>';
              trHTML +=
                  '<td><button type="button" class="btn btn-secondary ms-2" onclick="showUserEditBox(' +
                  object["id"] +
                  ')"><i class="fa-sharp fa-solid fa-user-pen"></i></button>';
              trHTML +=
                  '<button type="button" class="btn  btn-danger ms-2" onclick="userDelete(' +
                  object["id"] +
                  ')"><i class="fa-sharp fa-solid fa-trash"></i></button></td>';
              trHTML += "</tr>";
          }
          document.getElementById("mytable").innerHTML = trHTML;
      }
  };
}

loadTable();
// searching
function search() {
  const TraineeName = document.getElementById("searchvalue").value;
  loadTable(TraineeName);
}

function showUserCreateBox() {
  Swal.fire({
      title: "Add Trainee Details ",
      html: '<input id="id" type="hidden">' +
          '<input id="TraineeName" class="swal2-input" placeholder="TraineeName">' +
          '<input id="DOB" class="swal2-input" placeholder="DOB">' +
          '<input id="Gender" class="swal2-input" placeholder="Gender">' +
          '<input id="Qualification" class="swal2-input" placeholder="Qualification">' +
          '<input id="TrainingRequired" class="swal2-input" placeholder="TrainingRequired">' +
          '<input  id="image" type="file" class="swal2-input">',
      preConfirm: () => {
          userCreate();
      },
  });
}

function userCreate() {
  const TraineeName = document.getElementById("TraineeName").value;
  const DOB = document.getElementById("DOB").value;
  const Gender = document.getElementById("Gender").value;
  const Qualification = document.getElementById("Qualification").value;
  const 	TrainingRequired = document.getElementById("TrainingRequired").value;
  const imageInput = document.getElementById("image");
  const filename = "assets/images/" + imageInput.files[0].name;

  if (validate() == true) {
      const xhttp = new XMLHttpRequest();
      xhttp.open("POST", "http://localhost:3000/Trainee/");
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(
          JSON.stringify({
              TraineeName: TraineeName,
              DOB: DOB,
              Gender: Gender,
              Qualification: Qualification,
              TrainingRequired: TrainingRequired,
              Image: filename,

          })
      );
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              loadTable();
          }
      };
  }
}

function showUserEditBox(id) {
  console.log(id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", `http://localhost:3000/courses/${id}`);
  xhttp.send();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          const objects = JSON.parse(this.responseText);

          console.log(objects);
          Swal.fire({
            title: 'Edit Card',
            html:
              '<input id="edit-title" class="swal2-input" placeholder="Title" value="' +
              cardTitle +
              '">' +
              '<textarea id="edit-description" class="swal2-input" placeholder="Description">' +
              cardDescription +
              '</textarea>',
            focusConfirm: false,
            preConfirm: () => {
              const editedTitle = document.getElementById('edit-title').value;
              const editedDescription = document.getElementById('edit-description').value;
              preConfirm: () => {
                  userEdit(id);
                  xhttp.onreadystatechange = function() {
                      if (this.readyState == 4 && this.status == 200) {
                          const objects = JSON.parse(this.responseText);

                          loadTable();
                      }
                  };
              },
          });
      }
  };
}

function userEdit(id) {
  const TraineeName = document.getElementById("").value;
  const DOB = document.getElementById("DOB").value;
  const Gender = document.getElementById("Gender").value;
  const Qualification = document.getElementById("Qualification").value;
  const TrainingRequired = document.getElementById("TrainingRequired").value;
  const imageInput = document.getElementById("image");
  const filename = "assets/images/" + imageInput.files[0].name;
  if (validate_edit() == true) {
      const xhttp = new XMLHttpRequest();
      xhttp.open("PUT", `http://localhost:3000/Trainee/${id}`);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(
          JSON.stringify({

              TraineeName: TraineeName,
              DOB: DOB,
              Gender: Gender,
              Qualification: Qualification,
              TrainingRequired: TrainingRequired,
              Image: filename,

          })

      );
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              loadTable();
          }
      };
  }
}


function userDelete(id) {
  console.log(id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", `http://localhost:3000/Trainee/${id}`);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '<i class="fa fa-thumbs-up"></i> Delete!',
      confirmButtonAriaLabel: 'Thumbs up, Delete!',
      cancelButtonText: '<i class="fa fa-thumbs-down"></i>',
      cancelButtonAriaLabel: 'Thumbs down'
  }).then((result) => {
      if (result.value) {
          xhttp.send(
              JSON.stringify({
                  id: id,
              })
          );
          xhttp.onreadystatechange = function() {
              if (this.readyState == 4) {
                  swal.fire({
                      title: "Deleted Successfully",
                      icon: "success",
                      confirmButtonText: "OK"
                  })
                  loadTable();
              }
          };
      }
  });
}

function validate() {
  const TraineeName = document.getElementById("TraineeName").value;
  const DOB = document.getElementById("DOB").value;
  const Gender = document.getElementById("Gender").value;
  const Qualification = document.getElementById("Qualification").value;
  const TrainingRequired = document.getElementById("TrainingRequired").value;
  


  if (TraineeName == "" || DOB == "" || Gender == "" || Qualification == "" || TrainingRequired == "") {
      Swal.fire({
          title: "Fields should not be empty",
          showConfirmButton: true,
          icon: "error"
      })
      return false;
  }

  else {

    
      return true;
     
  }
}

function validate_edit() {
  const RestaurantName = document.getElementById("TraineeName").value;
  const RestaurantType = document.getElementById("DOB").value;
  const Address = document.getElementById("Gender").value;
  const ContactNo = document.getElementById("Qualification").value;
  const EMailId = document.getElementById("TrainingRequired").value;
 


  if (TraineeName == "" || DOB == "" || Gender == "" || Qualification == "" || TrainingRequired == "") {
      Swal.fire({
          title: "Fields should not be empty",
          showConfirmButton: true,
          icon: "error"
      })
      return false;
  }

  else {
      Swal.fire({
          title: "Successfully Edited",
          icon: "success",
          showConfirmButton: true


      })

      return true;

  }
  
  
}
 
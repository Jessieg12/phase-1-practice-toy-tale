let addToy = false;

document.addEventListener("DOMContentLoaded", (e) => {

  const getToys = 'http://localhost:3000/toys'
  const toyCollection = document.getElementById("toy-collection")
  const addToyInfo = document.querySelector(".add-toy-form")

  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", (e) => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch(getToys)
  .then((resp) => resp.json())
  .then((toys) => toys.forEach((e) => renderToys(e)))

  const renderToys = (toy) => {
    const toyCard = document.createElement('div')
    toyCard.className = 'card'
    const toyName = document.createElement('h2')
    toyName.innerText = toy.name
    const toyImg = document.createElement('img')
    toyImg.src = toy.image
    toyImg.className = 'toy-avatar'
    const toyLikes = document.createElement('p')
    toyLikes.id = toy.id
    toyLikes.innerHTML = `${toy.likes} Likes`
    const likeBtn = document.createElement('button')
    likeBtn.className = 'like-btn'
    likeBtn.innerText = 'Like ❤️'
    likeBtn.id = toy.id



    likeBtn.addEventListener('click', (e)=> {
      fetch(`http://localhost:3000/toys/${e.target.id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          likes: parseInt(e.target.parentElement.children[2].textContent.split(' ')[0], 10) +1
        })
      })
      .then((resp) => resp.json())
      .then(newlikes => {
        const p = document.getElementById(newlikes.id)
        p.innerText = `${newlikes.likes} Likes`
      })
    })

    toyCard.append(toyName, toyImg, toyLikes, likeBtn)
    toyCollection.append(toyCard)
  }

  addToyInfo.addEventListener('submit', (e)=> {
    e.preventDefault()
    const newToyName = e.target.name.value
    const newToyImg = e.target.image.value

    fetch(getToys, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: newToyName,
      image: newToyImg,
      likes: 0, 
    })
  })
  .then((resp) => resp.json())
  .then((newtoy) => renderToys(newtoy))
  })



});

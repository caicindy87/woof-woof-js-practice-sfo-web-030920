let dogBar = "";
let baseURL = "";
let filter = "";

document.addEventListener("DOMContentLoaded", () => {
  dogBar = document.querySelector("#dog-bar");
  baseURL = "http://localhost:3000/pups";
  filter = document.querySelector("#good-dog-filter");
  listenToFilter();
  fetchDogs();
  listenToGoodBadBtn();
  listenToDogSpans();
});

function listenToFilter() {
  filter.addEventListener("click", function (event) {
    if (filter.textContent.includes("ON")) {
      filter.textContent = "Filter good dogs: OFF";
      fetchDogs();
    } else {
      filter.textContent = "Filter good dogs: ON";
      fetchDogs();
    }
  });
}

function fetchDogs() {
  fetch(baseURL)
    .then((resp) => resp.json())
    .then((dogs) => {
      dogBar.innerHTML = "";
      dogs.forEach((dog) => {
        if (filter.textContent.includes("ON")) {
          if (dog.isGoodDog === true) {
            renderSingleDog(dog);
          }
        } else {
          renderSingleDog(dog);
        }
      });
    });
}

function fetchSpecificDog(id) {
  fetch(`${baseURL}/${id}`)
    .then((resp) => resp.json())
    .then((dog) => renderDogInfo(dog));
}

// Add dog names to the bar
function renderSingleDog(dog) {
  const dogSpan = document.createElement("span");
  dogSpan.textContent = dog.name;
  dogSpan.className = "dog-span";
  dogSpan.dataset.id = dog.id;
  dogBar.append(dogSpan);
}

function listenToDogSpans() {
  dogBar.addEventListener("click", function (event) {
    const specificDogSpan = event.target;
    if (specificDogSpan.className === "dog-span") {
      fetchSpecificDog(specificDogSpan.dataset.id);
    }
  });
}

const isGoodDogBtn = document.createElement("button");

function renderDogInfo(dog) {
  const dogInfoContainer = document.querySelector("#dog-info");
  dogInfoContainer.innerHTML = "";
  const dogImg = document.createElement("img");
  const dogName = document.createElement("h2");

  dogImg.src = dog.image;
  dogName.textContent = dog.name;
  if (dog.isGoodDog === true) {
    isGoodDogBtn.textContent = "Good Dog!";
  } else {
    isGoodDogBtn.textContent = "Bad Dog!";
  }
  isGoodDogBtn.dataset.buttonId = dog.id;

  dogInfoContainer.append(dogImg);
  dogInfoContainer.append(dogName);
  dogInfoContainer.append(isGoodDogBtn);
}

function listenToGoodBadBtn() {
  isGoodDogBtn.addEventListener("click", function (event) {
    const dogBtnId = event.target.dataset.buttonId;
    // Call fetchDogs before and after click to render change to dog bar
    // First fetchDogs() will refresh dog bar so it shows most updated bar
    fetchDogs();

    if (isGoodDogBtn.textContent === "Bad Dog!") {
      isGoodDogBtn.textContent = "Good Dog!";
      patchPup(dogBtnId, true);
    } else {
      isGoodDogBtn.textContent = "Bad Dog!";
      patchPup(dogBtnId, false);
    }
    // Second fetchDogs() will capture change
    fetchDogs();
  });
}

function patchPup(id, booleanValue) {
  const patchObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ isGoodDog: booleanValue }),
  };
  fetch(`${baseURL}/${id}`, patchObj)
    .then((resp) => resp.json())
    .then((dog) => renderDogInfo(dog));
}

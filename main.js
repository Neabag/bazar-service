var bannerData, productsData, categoriesData, cartResponse;
var prevSlide, nextSlide, curSlide;
var slideIndex = 1;

function httpRequest(method, url, body) {
  return new Promise((resolve, reject) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // document.getElementById("demo").innerHTML = this.responseText;
        // console.log(JSON.parse(this.responseText));
        resolve(JSON.parse(this.responseText));
      }
    };
    xhttp.open(method, url, true);
    if (method === "POST") {
      xhttp.send(body);
    } else {
      xhttp.send();
    }
  });
}

//Getting BannerImages and adding to carousel
httpRequest("GET", "http://localhost:3000/banners", {}).then(
  function (data) {
    bannerData = data;
    console.log(bannerData);
    let carousel = document.getElementById("carousel");
    let buttons = document.getElementById("slideButtons");
    for (let i = 0; i < bannerData.length; i++) {
      let child = document.createElement("div");
      child.innerHTML = `<img src=${bannerData[i].bannerImageUrl} style="width:100%">`;
      child.classList = "bannerSlides fade";
      let dot = document.createElement("span");
      dot.setAttribute("onclick", `curSlide(${i + 1})`);
      dot.classList = "dot";
      carousel.appendChild(child);
      buttons.appendChild(dot);
    }
    //setting Images and dot buttons
    var slides = document.getElementsByClassName("bannerSlides");
    var dots = document.getElementsByClassName("dot");
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
      // slides[i].style.transform = "translate(" + i * 100 + "%," + (-i * 100) + "%)";
    }
    dots[0].className += " active";
    // let autoplay = setInterval(() => {
    //     nextSlide()
    // }, 4000);
    showSlides(slideIndex);
    let clearAutoplay = function () {
      if (autoplay) {
        clearInterval(autoplay);
        autoplay = setInterval(() => {
          nextSlide();
        }, 4000);
      }
    };
    nextSlide = function () {
      showSlides((slideIndex += 1));
      // clearAutoplay();
    };
    prevSlide = function () {
      showSlides((slideIndex -= 1));
      // clearAutoplay();
    };
    curSlide = function (index) {
      slideIndex = index;
      showSlides(slideIndex);
      // clearAutoplay();
    };

    function showSlides(index) {
      if (index > slides.length) {
        slideIndex = 1;
      }
      if (index < 1) {
        slideIndex = slides.length;
      }
      for (let i = 0; i < slides.length; i++) {
        // if (i < slideIndex) {
        //     slides[i].style.transform = "translate(" + (slides.length - slideIndex + i) * 100 + "%," + (-i * 100) + "%)";
        // } else {
        //     slides[i].style.transform = "translate(" + (i - slideIndex) * 100 + "%," + (-i * 100) + "%)";
        // }
        slides[i].style.display = "none";
      }
      for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }
      slides[slideIndex - 1].style.display = "block";
      dots[slideIndex - 1].className += " active";
    }
    // carousel.onscroll=function(){
    //     console.log("scrolled in x/ty")
    // }
  },
  function (err) {
    console.log(err);
  }
);

httpRequest("POST", "http://localhost:3000/addToCart", {}).then(
  function (data) {
    cartResponse = data;
    console.log(data);
  },
  function (err) {
    console.log(err);
  }
);
httpRequest("GET", "http://localhost:3000/products", {}).then(
  function (data) {
    productsData = data;
    console.log(productsData);
  },
  function (err) {
    console.log(err);
  }
);

//fetching categories from server on dom load
httpRequest("GET", "http://localhost:3000/categories", {}).then(
  function (data) {
    categoriesData = data;
    console.log(categoriesData);
    displayCategories(categoriesData);
  },
  function (err) {
    console.log(err);
  }
);

function displayCategories(data) {
  console.log(data);
  var categories = document.getElementById("categories");
  for (let i = 0; i < data.length; i++) {
    var element = document.createElement("div");
    if (data[i].enabled) {
      if (i % 2 === 0) {
        element.innerHTML = `<img src=${data[i].imageUrl} class='leftImg'>
                <div class="rightText"> 
                <div class="categoriesName">${data[i].name}</div>
                <p class="categoriesDesc">${data[i].description}</p>
                <button class ="categoriesBtn">Explore ${data[i].name}</button>
                <div>`;
      } else {
        element.innerHTML = `<img src=${data[i].imageUrl} class='rightImg'>
                <div class="leftText">
                <div class="categoriesName">${data[i].name}</div>
                <p class="categoriesDesc">${data[i].description}</p>
                <button class ="categoriesBtn">Explore ${data[i].name}</button>
                <div>`;
      }
      element.classList = "categoriesCard";
      categories.appendChild(element);
    }
  }
}

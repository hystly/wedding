console.log("app.js loaded");

document.documentElement.style.setProperty(
    "--wish-wall-height",
    `${JS_CONFIG.WISH_WALL_HEIGHT}px`
);

document.documentElement.style.setProperty(
    "--photo-wall-height",
    `${JS_CONFIG.PHOTO_WALL_HEIGHT}px`
);

document.documentElement.style.setProperty(
    "--slide-img-max-height",
    `${JS_CONFIG.SLIDE_IMG_MAX_HEIGHT}px`
);

document.documentElement.style.setProperty(
    "--uploader-btm-height",
    `${JS_CONFIG.UPLOADER_BTM_HEIGHT}px`
);

document.documentElement.style.setProperty(
    "--photo-nav-butt",
    `${JS_CONFIG.PHOTO_NAV_BUTT}px`
);


document
  .getElementById("englishBtn")
  .addEventListener(
  "click",
  () => {

      localStorage.setItem(
        "language",
        "en"
      );

      applyLanguage();

  });

document
  .getElementById("chineseBtn")
  .addEventListener(
  "click",
  () => {

      localStorage.setItem(
        "language",
        "zh"
      );

      applyLanguage();

  });

document
  .getElementById("sendWish")
  .addEventListener("click", function () {

    window.location.href =
      "./submit-wishes.html";

});

document
.getElementById(
    "saveUsername"
)
.addEventListener(
"click",
saveUsername
);

document
  .getElementById("photoButton")
  .addEventListener(
    "click",
    () => {

      window.location.href =
      "./submit-photo.html";

});

document
  .getElementById("langToggle")
  .addEventListener(
    "click",
    switchLanguage
  );

// Wish constants
let wishesData = [];
let currentWishIndex = 0;
let wallStarted = false;

// Photo constants
let photosData = [];
let currentPhotoIndex = 0;
let slideshowStarted = false;
let slideshowTimer = null;

let occupiedAreas = [];

/* Language Selection */
let selectedLanguage = "en";

window.addEventListener(
  "load",
  () => {
  checkUsername();
  applyLanguage();
  }
);

window.addEventListener(
  "load",
  applyLanguage
);

window.addEventListener(
    "popstate",
    (event) => {

        const modal =
            document.getElementById(
                "topPhotoModal"
            );

        if (
            modal &&
            modal.classList.contains("show")
        ) {

            closeTopPhoto();

            return;
        }

    }
);

window.addEventListener(
  "load",
  () => {

      const modal =
        document.getElementById(
          "topPhotoModal"
        );

      if(modal){

          modal.addEventListener(
            "click",
            closeTopPhoto
          );

      }

  }
);


function checkUsername(){

  const username =
    localStorage.getItem(
      "username"
    );

  const language =
    localStorage.getItem(
      "language"
    ) || "en";

  if(username){

      let greeting =
        language === "zh"
        ? `欢迎您，${username} 😊`
        : `Welcome, ${username} 😊`;

      document
        .getElementById(
          "welcomeUser"
        )
        .textContent =
        greeting;

      document
        .getElementById(
          "usernameModal"
        )
        .style.display =
        "none";

      return;
  }
}

async function saveUsername(){

    const username =
      document
      .getElementById(
        "usernameInput"
      )
      .value
      .trim();

    if(!username){
        alert(
          "Please enter a username"
        );
        return;
    }

    if (username.length > JS_CONFIG.MAX_NAME_LENGTH) {
        alert(
          `Username cannot exceed ${JS_CONFIG.MAX_NAME_LENGTH} characters`
        );
        return;
    }

    if (username !== "Hong Shiong")
    {
      const { error } =
        await supabaseClient
        .from("users")
        .insert([
          {
            username
          }
        ]);

      if(error){

          alert(
            "Username already taken"
          );

          return;
      }

      localStorage.setItem(
        "username",
        username
      );
    }
    

    const language =
      localStorage.getItem("language")
      || "en";

    document
      .getElementById(
        "welcomeUser"
      )
      .textContent = `${t("welcome")}，${username} 😊`;

    document.body.style.overflow =
      "auto";

    document
      .getElementById(
        "usernameModal"
      )
      .style.display =
      "none";
}

function getLanguage() {

    return (
      localStorage.getItem("language")
      || "en"
    );

}

function t(key) {

    const lang =
      getLanguage();

    return LANG[lang][key];

}

function setText(id, value){

    const el =
      document.getElementById(id);

    if(el){
        el.textContent = value;
    }

}

function setPlaceholder(id, value){

    const el =
      document.getElementById(id);

    if(el){
        el.placeholder = value;
    }

}
function applyLanguage() {

    const lang = getLanguage();

    const englishBtn =
      document.getElementById(
        "englishBtn"
      );

    const chineseBtn =
      document.getElementById(
        "chineseBtn"
      );

    if(englishBtn && chineseBtn){

        englishBtn.classList.remove(
          "active"
        );

        chineseBtn.classList.remove(
          "active"
        );

        if(lang === "en"){
            englishBtn.classList.add(
              "active"
            );
        }else{
            chineseBtn.classList.add(
              "active"
            );
        }
    }

    const langToggle =
      document.getElementById(
        "langToggle"
      );

    if(langToggle){

        langToggle.textContent =
          lang === "en"
          ? "中文"
          : "EN";

    }

    setText("sendWish",t("sendWish"));
    setText("photoButton",t("uploadPhoto"));
    setText("blessingsLabel",t("blessings"));
    setText("memoriesLabel",t("memories"));
    setText("wishTitle",t("wishesWall"));
    setText("photoTitle",t("guestMemories"));
    setText("submitWishTitle",t("weddingWishes"));
    setPlaceholder("blessingMsg",t("blessingMsg"));
    setText("submitWish",t("submitWish"));
    setText("backHome",t("backHome"));
    setText("submitPhotoTitle",t("submitPhotoTitle"));
    setText("submitPhoto",t("submitPhoto"));
    setText("tabWish",t("tabWish"));
    setText("tabPhoto",t("tabPhoto"));
    setText("getMarried",t("getMarried"));
    setText("date",t("date"));
    setText("hs",t("hs"));
    setText("ly",t("ly"));


    const username =
      localStorage.getItem(
        "username"
      );

    const welcomeUser =
      document.getElementById(
        "welcomeUser"
      );

    if(
      username &&
      welcomeUser
    ){
        welcomeUser.textContent =
          `${t("welcome")}，${username} 😊`;
    }

    if(wishesData.length){
      showMostLovedWish(wishesData);
    }

    if(photosData.length){
        showMostLikedPhoto(photosData);
    }

    if(photosData.length){
        showPhoto();
    }
}


loadWishes();

supabaseClient
  .channel('wishes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'wishes'
    },
    () => {
      loadWishes();
    }
  )
  .subscribe();

loadPhotos();

supabaseClient
  .channel('photos')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'photos'
    },
    () => {
      loadPhotos();
    }
  )
  .subscribe();

async function loadWishes() {

  const { data, error } =
    await supabaseClient
      .from("wishes")
      .select("*")
      .order("created_at", {
        ascending: false
      });

  if (error) {
    console.error(error);
    return;
  }

    showMostLovedWish(data);

    wishesData = data;

    updateStats();

    if (!wallStarted) {
        wallStarted = true;
        startWall();
    }
}

function overlaps(
    top,
    height
){

    const spacing = 15;

    return occupiedAreas.some(area =>

        top <
            area.bottom + spacing &&

        top + height >
            area.top - spacing

    );
}

function findFreePosition(
    cardHeight
){

    const wall =
        document.querySelector(
            ".wish-wall"
        );

    const wallHeight =
        wall.clientHeight;

    let tries = 0;

    while(tries < 50){

        const top =
        20 +
        Math.random() *
        (
            wallHeight -
            cardHeight -
            40
        );

        if(
            !overlaps(
                top,
                cardHeight
            )
        ){
            return top;
        }

        tries++;
    }

    return null;
}

function getNextWish() {

    const wish =
        wishesData[currentWishIndex];

    currentWishIndex++;

    if (
        currentWishIndex >=
        wishesData.length
    ) {
        currentWishIndex = 0;
    }

    return wish;
}


function startWall() {

    launchWish(0);

    setTimeout(() => launchWish(1), 1000);

    setTimeout(() => launchWish(2), 2000);

    setTimeout(() => launchWish(3), 3000);

}

function launchWish(lane) {

    if (!wishesData.length) return;

    const wish =
      getNextWish();

    const likedWishes =
      JSON.parse(
        localStorage.getItem(
          "likedWishes"
        ) || "[]"
      );

    const alreadyLiked =
      likedWishes.includes(
        wish.id
      );

    const wishWall =
    document.querySelector(
        ".wish-wall"
    );

    const card =
      document.createElement(
        "div"
      );

    card.className =
      "floating-wish";

    card.innerHTML = `
      <strong>
        ${wish.name}
      </strong>

      <br><br>

      ${wish.message}

      <br><br>

      <button
        class="like-button"
        ${alreadyLiked ? "disabled" : ""}
        onclick="likeWish(${wish.id})">

        ${
          alreadyLiked
          ? `❤️ ${wish.likes || 0} ${t("likes")}`
          : `♡ ${wish.likes || 0} ${t("likes")}`
        }

      </button>
    `;

    card.style.visibility = "hidden";

    wishWall.appendChild(card);

    const cardHeight =
        card.offsetHeight;

    const top =
        findFreePosition(
            cardHeight
        );

    if(top === null){

        card.remove();

        setTimeout(
            () => launchWish(lane),
            1000
        );

        return;
    }

    occupiedAreas.push({
        element: card,
        top,
        bottom:
          top + cardHeight
    });

    card.style.top =
        `${top}px`;

    card.style.visibility =
        "visible";

    card.addEventListener(
        "animationend",
        () => {

            occupiedAreas =
                occupiedAreas.filter(
                    area =>
                        area.element !== card
                );

            card.remove();
        }
    );


    setTimeout(() => {

        launchWish(lane);

    }, JS_CONFIG.WISH_INTERVAL);
}

function showMostLovedWish(data) {

    if (!data.length) return;

    const mostLoved =
        [...data].sort(
            (a, b) =>
                (b.likes || 0) -
                (a.likes || 0)
        )[0];

    const topWish =
        document.getElementById(
            "mostLovedWish"
        );

    topWish.innerHTML = `
        <h3>
            ${t("mostLovedWish")}
        </h3>

        <div class="top-wish-message">

            "${mostLoved.message}"

        </div>

        <strong>

            - ${mostLoved.name} -

        </strong>

        <br><br>

        ❤️ ${mostLoved.likes || 0}
        ${t("likes")}

    `;
}

async function likeWish(id) {

     console.log("LIKE CLICKED", id);

    const likedWishes =
    JSON.parse(
      localStorage.getItem(
        "likedWishes"
      ) || "[]"
    );

    const { data, error } =
        await supabaseClient
        .from("wishes")
        .select("likes")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    await supabaseClient
        .from("wishes")
        .update({
        likes: (data.likes || 0) + 1
        })
        .eq("id", id);

    likedWishes.push(id);

    localStorage.setItem(
        "likedWishes",
        JSON.stringify(likedWishes)
    );

    const button =
    document.querySelector(
        `button[onclick="likeWish(${id})"]`
    );

    if (button) {
    button.disabled = true;
    button.innerHTML = `❤️ ${t("likes")} • ${(data.likes || 0) + 1}`;
    }

}

// Photo section

async function loadPhotos() {

    const { data, error } =
      await supabaseClient
      .from("photos")
      .select("*")
      .order(
        "created_at",
        { ascending: false }
      );

    if (error) {
        console.error(error);
        return;
    }

    photosData = data;

    updateStats();

    showMostLikedPhoto(data);

    if (
      !slideshowStarted &&
      data.length
    ) {

        slideshowStarted = true;

        showPhoto();

    }
}

function showMostLikedPhoto(data) {

    if (!data.length) return;

    const mostLiked =
      [...data].sort(
        (a, b) =>
          (b.likes || 0) -
          (a.likes || 0)
      )[0];

    document.getElementById(
      "mostLovedPhoto"
    ).innerHTML = `

      <h3>
        ${t("mostLovedPhoto")}
      </h3>

      <img
        src="${mostLiked.image_url}"
        alt="Most Loved Photo"
        onclick="openTopPhoto('${mostLiked.image_url}')"
        style="cursor:pointer">

      <p>
        📸 ${t("uploadedBy")}
        <strong>
          ${mostLiked.uploader_name || "Guest"}
        </strong>
      </p>

      <p>
        ❤️ ${mostLiked.likes || 0} ${t("likes")}
      </p>

    `;
}

function showPhoto() {

    if (!photosData.length) {
          return;
      }

    const photo =
      photosData[currentPhotoIndex];

    const likedPhotos =
      JSON.parse(
        localStorage.getItem(
          "likedPhotos"
        ) || "[]"
      );

    const alreadyLiked =
      likedPhotos.includes(photo.id);

    document
      .getElementById(
        "photoSlideshow"
      )
      .innerHTML = `

        <div class="slide-photo">

          <img
            src="${photo.image_url}"
            onerror="showPhoto()">

          <p class="photo-uploader">
            ${t("uploadedBy")}
            <strong>
              ${photo.uploader_name || "Guest"}
            </strong>
          </p>

          <div class="photo-controls">

          <button
            class="nav-button"
            onclick="previousPhoto()">

            ❮

          </button>

          <button
            class="like-button"
            ${alreadyLiked ? "disabled" : ""}
            onclick="likePhoto(${photo.id})">

             ${
                alreadyLiked
                  ? `❤️ ${t("likes")} • ${photo.likes || 0}`
                  : `♡ ${photo.likes || 0}`
              }

          </button>

          <button
            class="nav-button"
            onclick="nextPhoto()">

            ❯

          </button>

          </div>

        </div>

      `;

    clearTimeout(
      slideshowTimer
    );

    slideshowTimer =
      setTimeout(
        nextPhoto,
        JS_CONFIG.SLIDESHOW_INTERVAL
      );
}

function openTopPhoto(src){

    document.getElementById(
        "topPhotoPreview"
    ).src = src;

    document.getElementById(
        "topPhotoModal"
    ).classList.add(
        "show"
    );

    history.pushState(
        {
            modal: true
        },
        "",
        "#photo"
    );
}

function closeTopPhoto(){

    document
      .getElementById(
        "topPhotoModal"
      )
      .classList.remove(
        "show"
      );

}


function nextPhoto() {

    currentPhotoIndex++;

    if (
      currentPhotoIndex >=
      photosData.length
    ) {
        currentPhotoIndex = 0;
    }

    showPhoto();
}

function previousPhoto() {

    currentPhotoIndex--;

    if (
      currentPhotoIndex < 0
    ) {
        currentPhotoIndex =
          photosData.length - 1;
    }

    showPhoto();
}

async function likePhoto(id) {

    const likedPhotos =
      JSON.parse(
        localStorage.getItem(
          "likedPhotos"
        ) || "[]"
      );

    if (
      likedPhotos.includes(id)
    ) {
      return;
    }

    const { data } =
      await supabaseClient
      .from("photos")
      .select("likes")
      .eq("id", id)
      .single();

    await supabaseClient
      .from("photos")
      .update({
        likes:
          (data.likes || 0) + 1
      })
      .eq("id", id);

    likedPhotos.push(id);

    localStorage.setItem(
      "likedPhotos",
      JSON.stringify(likedPhotos)
    );

    const button =
      document.querySelector(
        `button[onclick="likePhoto(${id})"]`
      );

    if (button) {

        button.disabled = true;

        button.innerHTML =
          `❤️ ${t("likes")} • ${(data.likes || 0) + 1}`;
    }

    // loadPhotos();
}


// Statistics board

function updateStats() {

    const wishCount =
      wishesData.length;

    const photoCount =
      photosData.length;

    const wishLikes =
      wishesData.reduce(
        (sum, wish) =>
          sum + (wish.likes || 0),
        0
      );

    const photoLikes =
      photosData.reduce(
        (sum, photo) =>
          sum + (photo.likes || 0),
        0
      );

    document.getElementById(
      "wishCount"
    ).textContent =
      `💌 ${wishCount}`;

    document.getElementById(
      "photoCount"
    ).textContent =
      `📸 ${photoCount}`;
}

/* Back to homepage */

window.addEventListener(
  "load",
  () => {

      const params =
        new URLSearchParams(
          window.location.search
        );

      const target =
        params.get("scroll");

      if (!target) return;

      setTimeout(() => {

          document
            .getElementById(target)
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

      }, 1000);

  }
);

/* Double Happiness Animation */

const container =
    document.getElementById(
        "doubleHappinessContainer"
    );

function createDoubleHappiness() {

    const item =
        document.createElement("div");

    item.className =
        "double-happiness";

    if (Math.random() > 0.5) {

        item.textContent = "囍";

        item.style.color =
            "rgba(184,138,68,.3)";

        item.style.fontSize = "34px";

    } else {

        item.textContent = "♡";

        item.style.color =
            "rgba(184,138,68,.3)";

        item.style.fontSize = "30px";
    }

    item.style.left =
        Math.random() *
        window.innerWidth +
        "px";

    item.style.animationDuration =
        (10 + Math.random() * 10)
        + "s";

    document.body.appendChild(item);

    setTimeout(() => {
        item.remove();
    }, 20000);

}


function isOverBlockedArea(x, y) {
    const blocked = document.querySelectorAll(
        '#stats, .wish-wall, .top-wish, #photos'
    );

    for (const el of blocked) {
        const rect = el.getBoundingClientRect();

        const pageTop =
            rect.top + window.scrollY;

        const pageBottom =
            rect.bottom + window.scrollY;

        const pageLeft =
            rect.left;

        const pageRight =
            rect.right;

        if (
            x >= pageLeft &&
            x <= pageRight &&
            y >= pageTop &&
            y <= pageBottom
        ) {
            return true;
        }
    }

    return false;
}

setInterval(createDoubleHappiness, 800);


/* Language Switching */
function switchLanguage() {

    const current =
      getLanguage();

    const next =
      current === "en"
      ? "zh"
      : "en";

    localStorage.setItem(
      "language",
      next
    );

    applyLanguage();

}
console.log("app.js loaded");

document
  .getElementById("wishButton")
  .addEventListener("click", function () {

    window.location.href =
      "./submit-wishes.html";

});

document
  .getElementById("photoButton")
  .addEventListener(
    "click",
    () => {

      window.location.href =
      "./submit-photo.html";

});

// Wish constants
let wishesData = [];
let currentWishIndex = 0;
let wallStarted = false;

// Photo constants
let photosData = [];
let currentPhotoIndex = 0;
let slideshowStarted = false;
let slideshowTimer = null;

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

    for (let lane = 0; lane < JS_CONFIG.LANE_COUNT; lane++) {

        setTimeout(() => {

            launchWish(lane);

        }, lane * 3000);

    }

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
      likedWishes.includes(wish.id);

    const laneEl =
      document.getElementById(
        `lane${lane}`
      );

    laneEl.innerHTML = `
      <div class="floating-wish">

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
            ? `❤️ Liked • ${wish.likes || 0}`
            : `♡ ${wish.likes || 0}`
        }

        </button>

      </div>
    `;

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
            "topWish"
        );

    topWish.innerHTML = `
        <h3>
            ⭐ MOST LOVED WISH
        </h3>

        <div class="top-wish-message">

            "${mostLoved.message}"

        </div>

        <strong>

            - ${mostLoved.name} -

        </strong>

        <br><br>

        ❤️ ${mostLoved.likes || 0}

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
    button.innerHTML = `❤️ Liked • ${(data.likes || 0) + 1}`;
    }

    // alert(
    // "❤️ Thank you! Your like has been recorded."
    // );

    // loadWishes();

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
      "topPhoto"
    ).innerHTML = `

      <h3>
        ⭐ MOST LOVED PHOTO
      </h3>

      <img
        src="${mostLiked.image_url}"
        alt="Most Loved Photo">

      <p>
        📸 Uploaded by
        <strong>
          ${mostLiked.uploader_name || "Guest"}
        </strong>
      </p>

      <p>
        ❤️ ${mostLiked.likes || 0} Likes
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
            Uploaded by
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
                  ? `❤️ Liked • ${photo.likes || 0}`
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
          `❤️ Liked • ${(data.likes || 0) + 1}`;
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

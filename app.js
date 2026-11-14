console.log("app.js loaded");

document
  .getElementById("wishButton")
  .addEventListener("click", function () {

    window.location.href =
      "./submit-wishes.html";

});

loadWishes();

supabaseClient
  .channel('wishes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'wishes'
    },
    () => {
      loadWishes();
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

  const wishWall =
    document.getElementById("wishWall");

  wishWall.innerHTML = "";

  data.forEach((wish, index) => {

    const likedWishes =
    JSON.parse(
        localStorage.getItem(
        "likedWishes"
        ) || "[]"
    );

    const alreadyLiked = likedWishes.includes(wish.id);
    const lane = index % 5;
    const top = 30 + lane * 150;
    const leftOffset = index * 400;
    const duration = 40;

    wishWall.innerHTML += `
    <div
        class="floating-wish"
        style="
        top:${top}px;
        left:-${leftOffset}px;
        animation-duration:${duration}s;
    ">

        <strong>${wish.name}</strong>

        <br><br>

        ${wish.message}

        <br><br>

        <button
        class="like-button"
        ${alreadyLiked ? "disabled" : ""}
        onclick="likeWish(${wish.id})">

        ❤️ ${wish.likes || 0}

        ${alreadyLiked ? "You liked" : ""}

        </button>

    </div>
    `;
  });

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

    const likedWishes =
    JSON.parse(
      localStorage.getItem(
        "likedWishes"
      ) || "[]"
    );

    const alreadyLiked = likedWishes.includes(id);

    if (likedWishes.includes(id)) {

        alert(
        "You have already liked this wish ❤️"
        );

        return;
    }

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

    loadWishes();

}


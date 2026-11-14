console.log("app.js loaded");

const { createClient } = supabase;

const supabaseClient = createClient(
  "https://pmhkpooixevbljjwgpga.supabase.co",
  "sb_publishable_LHeI9dqWn2qSkIXHDIlQJQ_LbZfMF0a"
);

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

  const wishWall =
    document.getElementById("wishWall");

  wishWall.innerHTML = "";

  data.forEach((wish, index) => {

    const top = 30 + (index % 5) * 100;

    const duration = 20 + Math.random() * 20;

    wishWall.innerHTML += `
      <div
        class="floating-wish"
        style="
          top:${top}px;
          animation-duration:${duration}s;
          animation-delay:-${index * 3}s;
        ">

        <strong>${wish.name}</strong>

        <br><br>

        ${wish.message}

      </div>
    `;
  });

}
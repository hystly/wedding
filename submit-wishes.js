const supabaseUrl =
  "https://pmhkpooixevbljjwgpga.supabase.co";

const supabaseKey =
  "sb_publishable_LHeI9dqWn2qSkIXHDIlQJQ_LbZfMF0a";

const supabaseClient =
  supabase.createClient(
    supabaseUrl,
    supabaseKey
  );

document
  .getElementById("submitWish")
  .addEventListener("click", submitWish);

async function submitWish() {

  const name =
    document.getElementById("name").value;

  const message =
    document.getElementById("message").value;

  if (!name || !message) {
    alert("Please fill in all fields.");
    return;
  }

  const { error } =
    await supabaseClient
      .from("wishes")
      .insert([
        {
          name: name,
          message: message
        }
      ]);

  if (error) {

    console.error(error);

    alert(error.message);

    return;
}

  alert(
    "Thank you for your blessing ❤️"
  );

  window.location.href =
    "./index.html";
}
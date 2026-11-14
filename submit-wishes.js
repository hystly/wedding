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

  if (name.length > 20) {
    alert("Name cannot exceed 20 characters.");
    return;
    }

    if (message.length > 50) {
        alert("Wish cannot exceed 50 characters.");
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
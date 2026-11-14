document
  .getElementById("submitWish")
  .addEventListener("click", submitWish);

document
  .getElementById("name")
  .maxLength = JS_CONFIG.MAX_NAME_LENGTH;

document
  .getElementById("message")
  .maxLength = JS_CONFIG.MAX_MESSAGE_LENGTH;

async function submitWish() {

  const name = document.getElementById("name").value;

  const message = document.getElementById("message").value;

  if (!name || !message) {
        alert("Please fill in all fields.");
        return;
    }

  if (name.length > JS_CONFIG.MAX_NAME_LENGTH) {
        alert(`Name cannot exceed ${JS_CONFIG.MAX_NAME_LENGTH} characters.`);
        return;
    }

  if (message.length > JS_CONFIG.MAX_MESSAGE_LENGTH) {
        alert(`Wish cannot exceed ${JS_CONFIG.MAX_MESSAGE_LENGTH} characters.`);
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
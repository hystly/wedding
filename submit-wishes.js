window.addEventListener(
  "load",
  applyLanguage
);

document
  .getElementById("submitWish")
  .addEventListener("click", submitWish);

document
  .getElementById("backHome")
  .addEventListener(
    "click",
    () => {
      window.location.href =
        "./index.html?scroll=wishes";
    }
  );


document
  .getElementById("blessingMsg")
  .maxLength = JS_CONFIG.MAX_MESSAGE_LENGTH;

async function submitWish() {

  const name = localStorage.getItem("username");

  const message = document.getElementById("blessingMsg").value.trim();

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
document
  .getElementById("submitPhoto")
  .addEventListener(
    "click",
    uploadPhoto
  );

  async function uploadPhoto() {

    const file =
      document
      .getElementById("photo")
      .files[0];

    const name =
      document
      .getElementById("name")
      .value;

    if (!file) {
        alert("Please select a photo");
        return;
    }

    const extension =
        file.name.split(".").pop();

    const filename =
      `${Date.now()}.${extension}`;

    const {
        data: uploadData,
        error: uploadError
    } =
    await supabaseClient
        .storage
        .from(PHOTO_BUCKET)
        .upload(
            filename,
            file
        );

    console.log(uploadData);
    console.log(uploadError);

    if (uploadError) {
        console.error(uploadError);
        alert(uploadError.message);
        return;
    }

    const { data } =
        supabaseClient
        .storage
        .from(PHOTO_BUCKET)
        .getPublicUrl(filename);

    console.log(data.publicUrl);

    const {
      error: insertError
    } =
    await supabaseClient
      .from("photos")
      .insert([
        {
          uploader_name: name,
          image_url: data.publicUrl,
          likes: 0
        }
      ]);

    console.log(insertError);

    if (insertError) {
        alert(insertError.message);
        return;
    }

    alert("📸 Upload Success!");

}
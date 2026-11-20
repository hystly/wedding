const loginContainer =
document.getElementById("loginContainer");

const adminContainer =
document.getElementById("adminContainer");

const tableSorts = {
    users: "id",
    wishes: "id",
    photos: "id"
};

document
.getElementById("resetLikes")
?.addEventListener("click", () => {

    if(
        !confirm(
            "Clear local likes cache?"
        )
    ){
        return;
    }

    localStorage.removeItem(
        "likedWishes"
    );

    localStorage.removeItem(
        "likedPhotos"
    );

    alert(
        "Likes cache cleared!"
    );

});

document
.getElementById("resetUsername")
?.addEventListener("click", () => {

    if(
        !confirm(
            "Clear saved username?"
        )
    ){
        return;
    }

    localStorage.removeItem(
        "username"
    );

    alert(
        "Username cleared!"
    );

});

window.addEventListener(
    "load",
    () => {

        const loggedIn =
        sessionStorage.getItem(
            "adminLoggedIn"
        );

        if(loggedIn === "true"){
            showAdmin();
        }
    }
);

window.addEventListener(
    "popstate",
    () => {

        const modal =
        document.getElementById(
            "photoModal"
        );

        if(
            modal.style.display ===
            "flex"
        ){
            closePhoto();
        }

    }
);

async function checkPassword(){

    const password =
    document
    .getElementById("passwordInput")
    .value
    .trim();

    const { data , error } =
    await supabaseClient
        .from("admin_passwords")
        .select("*")
        .single();

    if(error){
        alert("Password table error");
        return;
    }

    if(password === data.password){

        sessionStorage.setItem(
            "adminLoggedIn",
            "true"
        );

        showAdmin();

    }else{

        alert("Wrong Password");

    }
}

async function showAdmin(){

    loginContainer.style.display =
    "none";

    adminContainer.style.display =
    "block";

    await loadAllTables();
}

async function loadAllTables(){

    const users =
    await loadTable(
        "users",
        "usersTable",
        "usersSummary"
    );

    const wishes =
    await loadTable(
        "wishes",
        "wishesTable",
        "wishesSummary"
    );

    const photos =
    await loadTable(
        "photos",
        "photosTable",
        "photosSummary"
    );

    document.getElementById(
        "stats"
    ).innerHTML = `
        👤 Users: ${users}
        <br><br>
        💌 Wishes: ${wishes}
        <br><br>
        📸 Photos: ${photos}
    `;
}

async function loadTable(
    tableName,
    tableDivId,
    summaryId
){

    const { data , error } =
    await supabaseClient
        .from(tableName)
        .select("*");

    if(data){
        applySort(data, tableName);
    }

    if(error){

        document.getElementById(
            tableDivId
        ).innerHTML = error.message;

        return 0;
    }

    document.getElementById(
        summaryId
    ).textContent =
    `${tableName} (${data.length})`;

    const tableData =
    data.map(row => ({
        ...row,
        _table: tableName
    }));

    document.getElementById(
        tableDivId
    ).innerHTML =
    createTable(tableData);

    return data.length;
}

function createTable(data){

    if(!data || data.length === 0){
        return "No Data";
    }

    const columns =
    Object.keys(data[0]);

    let html =
    `
    <div class="table-wrapper">
    <table>
    <tr>
    `;

    html += "<th>Select</th>";

    columns.forEach(col => {

        if( col === "name" ||
            col === "username" ||
            col === "uploader_name"
        ){

            let icon = "↕";
            const sortMode =
            tableSorts[data[0]._table];

            if(sortMode === "asc"){
                icon = "▲";
            }

            if(sortMode === "desc"){
                icon = "▼";
            }

            html += `
            <th>
                ${col}
                <span
                    class="sort-btn"
                    onclick="toggleSort('${data[0]._table}')"
                >
                    ${icon}
                </span>
            </th>
            `;

        }else{

            html += `<th>${col}</th>`;

        }

    });

    html += "</tr>";

    data.forEach(row => {

        html += "<tr>";

        html += `
        <td>
            <input
                type="checkbox"
                class="rowCheck"
                value="${row.id}"
                data-table="${row._table}"
            >
        </td>
        `;

        columns.forEach(col => {

            if(
                col === "image_url" &&
                row[col]
            ){

                html += `
                <td>
                    <button
                        onclick="openPhoto('${row[col]}')"
                    >
                        View Photo
                    </button>
                </td>
                `;

            }else{

                html += `
                <td>${row[col]}</td>
                `;

            }

        });

        html += "</tr>";

    });

    html += `
    </table>
    </div>
    `;

    return html;
}

async function deleteRow(
    id,
    tableName
){

    const confirmDelete =
    confirm(
        `Delete record ${id}?`
    );

    if(!confirmDelete){
        return;
    }

    const { error } =
    await supabaseClient
        .from(tableName)
        .delete()
        .eq("id", id);

    if(error){

        alert(
            "Delete failed: " +
            error.message
        );

        return;
    }

    alert("Deleted");

    loadAllTables();
}

async function deleteSelected(){

    const checkedRows =
    document.querySelectorAll(
        ".rowCheck:checked"
    );

    if(checkedRows.length === 0){

        alert("No rows selected");

        return;
    }

    if(
        !confirm(
            `Delete ${checkedRows.length} selected records?`
        )
    ){
        return;
    }

    for(const row of checkedRows){

        const id =
        row.value;

        const tableName =
        row.dataset.table;

        const { error } =
        await supabaseClient
            .from(tableName)
            .delete()
            .eq("id", id);

        if(error){

            console.error(error);

        }

    }

    alert(
        `${checkedRows.length} records deleted`
    );

    loadAllTables();
}

function applySort(data, tableName){

    const sortMode =
        tableSorts[tableName];

    let sortField;

    if(tableName === "users"){
        sortField = "username";
    }
    else if(tableName === "wishes"){
        sortField = "name";
    }
    else if(tableName === "photos"){
        sortField = "uploader_name";
    }

    if(sortMode === "asc"){

        data.sort((a,b)=>
            String(a[sortField] || "")
            .localeCompare(
                String(b[sortField] || ""),
                "zh-Hans"
            )
        );

    }
    else if(sortMode === "desc"){

        data.sort((a,b)=>
            String(b[sortField] || "")
            .localeCompare(
                String(a[sortField] || ""),
                "zh-Hans"
            )
        );

    }
    else{

        data.sort((a,b)=>a.id-b.id);

    }

}


function toggleSort(tableName){

    const current =
        tableSorts[tableName];

    if(current === "id"){

        tableSorts[tableName] = "asc";

    }
    else if(current === "asc"){

        tableSorts[tableName] = "desc";

    }
    else{

        tableSorts[tableName] = "id";

    }

    loadAllTables();

}

function openPhoto(url){

    const modal =
    document.getElementById(
        "photoModal"
    );

    document.getElementById(
        "modalImage"
    ).src = url;

    modal.style.display =
    "flex";

    history.pushState(
        { photoOpen:true },
        ""
    );

}

function closePhoto(){

    document.getElementById(
        "photoModal"
    ).style.display =
    "none";

}

document.addEventListener(
    "click",
    e => {

        if(
            e.target.id === "closePhoto"
        ){
            closePhoto();
        }

    }
);


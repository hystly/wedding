const loginContainer =
document.getElementById("loginContainer");

const adminContainer =
document.getElementById("adminContainer");

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
        html += `<th>${col}</th>`;
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

            html += `
                <td>${row[col]}</td>
            `;

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

// Page Loader functions 
var myTimer;

function loaderFunc() {
    myTimer = setTimeout(showPage, 3000);
}

function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("myDiv").style.display = "block";
}

// Global Diclarations Variables to reduce back to back calling of API 
let repoList = [];
let currentPage = 0;

// Get User Details
function GetUserDetails(username) {
    fetch(`https://api.github.com/users/${username}`)
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("username").innerHTML = data.name;
            document.getElementById("bio").innerHTML = data.bio;
            document.getElementById("location").innerHTML = `<i class="fa-solid fa-location-dot fa-sm"></i> ${data.location}`;
            document.getElementById(
                "twitter"
            ).innerHTML = `http://twitter.com/${data.twitter_username}`;
            document.getElementById("git-url").innerHTML = data.html_url;
            document.getElementById("avatar").src = data.avatar_url; 
                })
        .catch((error) => console.error("Error fetching repositories:", error));
}

//Repository details
function GetRepoDetails(username) {
    fetch(`https://api.github.com/users/${username}/repos`)
        .then((response) => response.json())
        .then(async (data) => {
            repoList = [];
            data.forEach((repo) => {
                repoList.push({
                    repoName: repo.name,
                    description: repo.description,
                    language_url: repo.languages_url,
                });
            });
            await RenderReops(repoList, 0, 10);
        })
        .catch((error) => console.error("Error fetching repositories:", error));
}

// Renter repository details
async function RenderReops(repoList, pageStart, pageEnd) {
    let divs = "";
    for (let i = pageStart; i < pageEnd; i++) {
        let getLanguages = await GetLanguages(repoList[i].language_url);
        divs =
            divs +
            ` <div class="g-col-6 mb-3">
                        <div class="border border-dark p-2 m-2">
                            <h1 class="fs-4">${repoList[i].repoName}</h1>
                            <h2 class="fs-6">${repoList[i].description} here</h2>` +
            getLanguages +
            `</div></div>`;
    }
    document.getElementById("repo").innerHTML = divs;
    await RenderBottomNavigator(repoList.length);
}

// Templete to get the language from git API
async function GetLanguages(languages_url) {
    let langTemp = "";
    await fetch(languages_url, {
            mode: "cors"
        })
        .then((response) => response.json())
        .then((languages) => {
            var langList = Object.keys(languages);
            langList.forEach((lang) => {
                langTemp =
                    langTemp +
                    `<button class="btn btn-primary btn-sm">${lang}</button> `;
            });
            return langTemp;

        }).catch((error) => console.error("Error fetching languages:", error));
    if (langTemp) {
        return langTemp;
    } else {
        return `<button class="btn btn-primary btn-sm">None</button> `;
    }
}


// Search users based on input field
function SearchUser() {
    const username = document.getElementById("searchUsername").value;
    GetUserDetails(username);
    GetRepoDetails(username);
}


GetUserDetails("johnpapa");
GetRepoDetails("johnpapa");

// To display next repos
async function NextRepos() {
    if (currentPage > repoList.length) {
        currentPage = repoList.length - 10; 

    } else {
        currentPage = currentPage + 10;
        if (currentPage <= repoList.length - 10) {             
            await RenderReops(repoList, currentPage, currentPage + 10);
        }
    }
}

// To display previous repos
async function PreviousRepos() {
    if (currentPage <= 0) {
        currentPage = 0;
    } else {
        currentPage = currentPage - 10;
        if (currentPage >= 0) { 
            await RenderReops(repoList, currentPage, currentPage + 10);
        } else {
            
            currentPage = 0;
            await RenderReops(repoList, currentPage, currentPage + 10);
        }
    }
}

// To display current repo 
async function CustomRepos(start) {
    currentPage = start;
    await RenderReops(repoList, start, start + 10);
}

// Render bottom navigator
function RenderBottomNavigator(len) {
    let totalNumbers = Math.floor(len / 10);
    let divs = "";
    for (let i = 1; i <= totalNumbers; i++) {
        divs =
            divs +
            `<div><button onclick="CustomRepos(${i})" class="btn btn-outline-primary border border-dark-subtle">${i}</button></div>`;
    }
    let prevNav = `<div><button onclick="PreviousRepos()" class="btn btn-outline-primary border border-dark-subtle"><i
                                class="fa-solid fa-backward fa-sm" style="color: #74C0FC;"></i></button></div>`;
    let nextNav = `<div><button onclick="NextRepos()" class="btn btn-outline-primary border border-dark-subtle"><i
                                class="fa-solid fa-forward fa-sm" style="color: #74C0FC;"></i></button></div>`;
    document.getElementById("pages").innerHTML = prevNav + divs + nextNav;
}
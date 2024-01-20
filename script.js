//loaders
document.onreadystatechange = function () {
    var state = document.readyState
    if (state == 'interactive') {
        document.getElementById('contents').style.visibility = "hidden";
    } else if (state == 'complete') {
        setTimeout(function () {
            document.getElementById('interactive');
            document.getElementById('load').style.visibility = "hidden";
            document.getElementById('contents').style.visibility = "visible";
        }, 1000);
    }
}
  
  // Get User Details
  function GetUserDetails(username) {
      fetch(`https://api.github.com/users/${username}`)
          .then(response => response.json())
          .then(data => {
            console.log('data',data);
              document.getElementById('username').innerHTML=data.name;
              document.getElementById('bio').innerHTML = data.bio;
              document.getElementById('location').innerHTML = data.location;
              document.getElementById('twitter').innerHTML = `http://twitter.com/${data.twitter_username}`;
              document.getElementById('git-url').innerHTML = data.html_url;
              document.getElementById('avatar').src = data.avatar_url; //add it at the last because you may need to adject style
          })
          .catch(error => console.error('Error fetching repositories:', error));
  }

  //Repository details

  function GetRepoDetails(username){
    fetch(`https://api.github.com/users/${username}/repos`)
    .then(response => response.json())
    .then(data =>{
        let repoList = []
        let divs = ""
       
        data.forEach(repo => {

              repoList.push({
                "repoName":repo.name,
                "description":repo.description,
                "language_url": repo.languages_url
             })
        });
            for (let i = 0; i<2; i++) {
               divs = divs + `  
             <div class="g-col-6 mb-3">
                    <div class="border border-dark p-2 m-2">
                        <h1 class="fs-4">${repoList[i].repoName}</h1>
                        <h2 class="fs-6">${repoList[i].description} here</h2>
                        <button class="btn btn-primary btn-sm">hello</button>
                        ${GetLanguages(repoList[i].languages_url)}
                    </div>
                </div>`
               
            }

         document.getElementById('repo').innerHTML = divs;
       
    }).catch(error => console.error('Error fetching repositories:', error));
  
}

function GetLanguages(languages_url) {
    if(languages_url){
        console.log("null");
    }else{

  
        fetch(languages_url)
        .then(response => response.json())
        .then(languages =>{
             var langList = Object.keys(languages);
             langList.forEach(lang =>{
                console.log('lang:',lang);
              })

        } )
        .catch(error => console.error('Error fetching languages:', error));
       }
}

//search

function SearchUser(){
       const username = document.getElementById('searchUsername').value;
        GetUserDetails(username);
        GetRepoDetails(username);
}


  

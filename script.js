  
 GetUserDetails("johnpapa");
 GetRepoDetails("johnpapa");
  
  // Get User Details
  function GetUserDetails(username) {
      fetch(`https://api.github.com/users/${username}`)
          .then(response => response.json())
          .then(data => {
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

            //  repoList.push({
            //     "repoName":repo.name,
            //     "description":repo.description,
            //     "language": repo.language
            //  })

             divs = divs + `  
             <div class="g-col-6 mb-3">
                    <div class="border border-dark p-2 m-2">
                        <h1 class="fs-4">${repo.name}</h1>
                        <h2 class="fs-6">${repo.description} here</h2>
                        <button class="btn btn-primary btn-sm">${repo.language}</button>
                    </div>
                </div>`
        });
         document.getElementById('repo').innerHTML = divs;
        // console.log(repoList);
       
    }).catch(error => console.error('Error fetching repositories:', error));
  
}
  
const addRepoBtn = document.getElementById("add-repo-btn");
const openModal = document.getElementById("repo-modal");
const closeBtn = document.getElementById("exit-btn");
const submitBtn = document.getElementById("submit-repo-btn");
const inputUser = document.getElementById("username");
const inputRepo = document.getElementById("reponame");
const inputDesc = document.getElementById("repodesc");
const resetBtn = document.getElementById("sync-btn");


addRepoBtn.addEventListener('click', () => {
    openModal.showModal();
})


closeBtn.addEventListener('click', () => {
    openModal.close();
})

submitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    console.log(inputDesc.value);
    if (inputRepo.value != "") {
        
        let newProjectData = {repoUser: inputUser.value, repoName: inputRepo.value, repoDesc: inputDesc.value};
        getProjectProgress(newProjectData, true);
        localStorage.setItem("username", inputUser.value);
        openModal.close();
        inputRepo.value = "";
        inputDesc.value = "";
    }
})

resetBtn.addEventListener('click', () => {
    resetBtn.disabled = true;
    resetBtn.innerText = "Syncing..."
   
    setTimeout(async () => {
        document.getElementById('board-container').innerHTML = "";
        const savedList = JSON.parse(localStorage.getItem("savedRepos"));
        for (const projectFolder of savedList) {
            await getProjectProgress(projectFolder, false);
        };
        resetBtn.disabled = false;
        resetBtn.innerText = "Refresh Data";
    }, 7000);

})



async function getProjectProgress(projectFolder, isNew) {
    const repoName = projectFolder.repoName;
    const repoDesc = projectFolder.repoDesc;
    const repoUser = projectFolder.repoUser;

	const githubIssuesUrl = `https://api.github.com/repos/${repoUser}/${repoName}/issues?state=all`;
    let currentList = JSON.parse(localStorage.getItem("savedRepos"));
    try {
		const response = await fetch(githubIssuesUrl, {cache: "no-store"});
		const data = await response.json();
        if (data.message === "Not Found") {
            alert("Repository not found!");
            return;
        }
        
        if(isNew === true) {
            currentList.push(projectFolder);
            localStorage.setItem("savedRepos", JSON.stringify(currentList));
            console.log(currentList);
        }
		console.log(data);

		const openIssue = data.filter( issue => issue.state === "open");
		console.log(openIssue);

		const totalIssues = data.length;
		const completedIssues = data.filter(issue => issue.state === "closed").length;

        let progressPercentage;
		
		
        if (totalIssues === 0) {
            progressPercentage = 0;
        } else {
            progressPercentage =  Math.floor((completedIssues / totalIssues) * 100);
        }
        console.log(progressPercentage);

        const newCard = document.createElement("article");
        newCard.classList.add("project-card");

        const newTitle = document.createElement("h2");
        newTitle.innerText = repoName;
        console.log(newTitle);
        const dashboardWall = document.getElementById('board-container');
        newCard.appendChild(newTitle);

        const newDesc = document.createElement("p");
        newDesc.innerText = "Description: " + repoDesc ; 
        newCard.appendChild(newDesc);

        const newProgressBar = document.createElement("div");
        newProgressBar.classList.add("custom-progress-track");

        const newProgressFill = document.createElement("div");
        newProgressFill.classList.add("custom-progress-fill");
        newProgressFill.style.width = progressPercentage + "%";
        newProgressBar.appendChild(newProgressFill);
        newCard.appendChild(newProgressBar);

        const newProgressText = document.createElement("span");
        newProgressText.innerText = progressPercentage + '%'
        newProgressBar.append(newProgressText);


        const removeBtn = document.createElement("button");
        removeBtn.innerText = "X";
        removeBtn.classList.add("remove-card-btn");
        removeBtn.addEventListener ('click', () => {
            console.log("Delete button clicked for " + repoName);
            newCard.remove();
            let updatedList =  currentList.filter(project => project.repoName !== repoName );
            localStorage.setItem("savedRepos", JSON.stringify(updatedList));
        })
        newCard.appendChild(removeBtn);
        
        
        dashboardWall.appendChild(newCard);


	} catch (error) {
		console.error(error);
	}
}



let myProjects = localStorage.getItem("savedRepos");

if (myProjects === null) {
    localStorage.setItem("savedRepos", "[]");
}

if (myProjects != null) {
    const savedList = JSON.parse(localStorage.getItem("savedRepos"));
    console.log(savedList);
    savedList.forEach((projectFolder) => {
        getProjectProgress(projectFolder, false);
    });
}

let savedUser = localStorage.getItem("username");

if (savedUser != null) {
    inputUser.value = savedUser;
}
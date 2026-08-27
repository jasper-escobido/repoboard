const addRepoBtn = document.getElementById("add-repo-btn");
const openModal = document.getElementById("repo-modal");
const closeBtn = document.getElementById("exit-btn");
const submitBtn = document.getElementById("submit-repo-btn");
const inputRepo = document.getElementById("reponame");
const inputDesc = document.getElementById("repodesc");


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
        let currentList = JSON.parse(localStorage.getItem("savedRepos"));
        let newProjectData = {repoName: inputRepo.value, repoDesc: inputDesc.value};
        currentList.push(newProjectData);
        getProjectProgress(newProjectData);
        localStorage.setItem("savedRepos", JSON.stringify(currentList));
        console.log(currentList);
        openModal.close();
        inputRepo.value = "";
    }
})



async function getProjectProgress(projectFolder) {
    const repoName = projectFolder.repoName;
    const repoDesc = projectFolder.repoDesc;
	const githubIssuesUrl = `https://api.github.com/repos/jasper-escobido/${repoName}/issues?state=all`;
    
    try {
		const response = await fetch(githubIssuesUrl);
		const data = await response.json();
        if (data.message === "Not Found") {
            alert("Repository not found!");
            return;
        }

		console.log(data);

		const openIssue = data.filter( issue => issue.state === "open");
		console.log(openIssue);

		const totalIssues = data.length;
		const completedIssues = data.filter(issue => issue.state === "closed").length;
		const progressPercentage = Math.floor((completedIssues / totalIssues) * 100);
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

        const newProgressBar = document.createElement("progress");
        newProgressBar.max = 100;
        newProgressBar.value = progressPercentage;
        newProgressBar.id = "rps-bar"
        newCard.appendChild(newProgressBar);
        
        
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
        getProjectProgress(projectFolder);
    });
}
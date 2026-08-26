
const addRepoBtn = document.getElementById("add-repo-btn");
const openModal = document.getElementById("repo-modal");
const closeBtn = document.getElementById("exit-btn");
const submitBtn = document.getElementById("submit-repo-btn");
const inputRepo = document.getElementById("reponame");

console.log(addRepoBtn);
console.log(openModal);
console.log(closeBtn);

addRepoBtn.addEventListener('click', () => {
    openModal.showModal();
})


closeBtn.addEventListener('click', () => {
    openModal.close();
})

submitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    if (inputRepo.value != "") {
        getProjectProgress(inputRepo.value);
        openModal.close();
        inputRepo.value = "";
    }
    console.log(inputRepo.value);
})



async function getProjectProgress(repoName) {
	const githubIssuesUrl = `https://api.github.com/repos/jasper-escobido/${repoName}/issues?state=all`;
    
    try {
		const response = await fetch(githubIssuesUrl);
		const data = await response.json();
		console.log(data);

		const openIssue = data.filter( issue => issue.state === "open");
		console.log(openIssue);

		const totalIssues = data.length;
		const completedIssues = data.filter(issue => issue.state === "closed").length;
		const progressPercentage = Math.floor((completedIssues / totalIssues) * 100);
		console.log(progressPercentage);

		const progressBar = document.getElementById('rps-bar');
		progressBar.value = progressPercentage;
		console.log(progressBar);


	} catch (error) {
		console.error(error);
	}
}


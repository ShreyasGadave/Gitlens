// node example - save as github-get.js
import { Octokit } from "octokit";

const token = process.env.GITHUB_TOKEN; // set your PAT in env
const octokit = new Octokit({ auth: token });

async function getUserAndRepos(username:string) {
  // 1) Get user info
  const { data: user } = await octokit.request('GET /users/{username}', {
    username
  });
  console.log("User:", {
    login: user.login,
    id: user.id,
    name: user.name,
    bio: user.bio,
    location: user.location,
    followers: user.followers,
    following: user.following,
    public_repos: user.public_repos,
    created_at: user.created_at,
  });

  // 2) Get all public repos for that user (paginated)
  // octokit.paginate will fetch all pages for us
  const repos = await octokit.paginate(
    "GET /users/{username}/repos",
    { username, per_page: 100 }
  );

  console.log(`Found ${repos.length} repos. Example fields:`);
  console.log(repos.slice(0,3).map(r => ({
    id: r.id,
    name: r.name,
    full_name: r.full_name,
    private: r.private,
    html_url: r.html_url,
    description: r.description,
    language: r.language,
    stargazers_count: r.stargazers_count,
    forks_count: r.forks_count,
    created_at: r.created_at,
    updated_at: r.updated_at
  })));
}

// To fetch repo by numeric id:
async function getRepoById(repoId:string) {
  const { data: repo } = await octokit.request('GET /repositories/{repository_id}', {
    repository_id: repoId
  });
  console.log("Repo by id:", {
    id: repo.id,
    full_name: repo.full_name,
    private: repo.private,
    html_url: repo.html_url,
    description: repo.description
  });
}

// Example usage:
const args = process.argv.slice(2);
const username = args[0] || "octocat"; // default
getUserAndRepos(username).catch(console.error);
// Or getRepoById(1296269).catch(console.error);

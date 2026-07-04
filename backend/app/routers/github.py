import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class GitHubRepo(BaseModel):
    name: str
    description: str | None
    html_url: str
    language: str | None
    stargazers_count: int
    forks_count: int


class GitHubActivityResponse(BaseModel):
    username: str
    public_repos: int
    public_gists: int
    followers: int
    following: int
    recent_repos: list[GitHubRepo]


@router.get("/github/activity", response_model=GitHubActivityResponse)
async def get_github_activity():
    async with httpx.AsyncClient(timeout=10.0) as client:
        user_resp = await client.get(
            "https://api.github.com/users/illia-morozov",
            headers={"Accept": "application/vnd.github.v3+json"},
        )
        if user_resp.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail=f"GitHub API returned {user_resp.status_code}",
            )
        user_data = user_resp.json()

        repos_resp = await client.get(
            "https://api.github.com/users/illia-morozov/repos",
            params={"sort": "pushed", "per_page": 6, "type": "owner"},
            headers={"Accept": "application/vnd.github.v3+json"},
        )
        recent_repos = []
        if repos_resp.status_code == 200:
            for repo in repos_resp.json():
                recent_repos.append(
                    GitHubRepo(
                        name=repo["name"],
                        description=repo.get("description"),
                        html_url=repo["html_url"],
                        language=repo.get("language"),
                        stargazers_count=repo.get("stargazers_count", 0),
                        forks_count=repo.get("forks_count", 0),
                    )
                )

    return GitHubActivityResponse(
        username=user_data.get("login", "illia-morozov"),
        public_repos=user_data.get("public_repos", 0),
        public_gists=user_data.get("public_gists", 0),
        followers=user_data.get("followers", 0),
        following=user_data.get("following", 0),
        recent_repos=recent_repos,
    )

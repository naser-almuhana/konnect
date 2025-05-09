export const loginDefaultValues = {
  username: "john",
  password: "123456789",
}
export const signupDefaultValues = {
  email: "",
  username: "",
  password: "",
}

export const PER_PAGE = Number(process.env.PER_PAGE) || 5

export const GITHUB_REPO_URL = "https://github.com/naser-almuhana/konnect"

export const LINKIFY_USERNAME_REGEX = /(@[a-zA-Z0-9_-]+)/
export const LINKIFY_HASHTAG_REGEX = /(#[a-zA-Z0-9]+)/

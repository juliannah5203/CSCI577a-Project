import Cookies from "js-cookie";

let cachedUser = null;

function getUser() {
  try {
    if (cachedUser) return cachedUser;

    const raw = Cookies.get("mindcareUser");
    if (!raw) return null;

    const user = JSON.parse(raw);
    cachedUser = user;
    return user;
  } catch (err) {
    console.error("Failed to parse mindcareUser cookie", err);
    return null;
  }
}

export default getUser;

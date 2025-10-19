document.getElementById("calculate").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const result = document.getElementById("result");

  if (!username) {
    result.textContent = "Please enter a username.";
    return;
  }

  result.textContent = "Fetching data...";

  try {
    const apiUrl = `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=`;

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addParentData: false,
        directUrls: [`https://www.instagram.com/${username}`],
        enhanceUserSearchWithFacebookPage: false,
        isUserReelFeedURL: false,
        isUserTaggedFeedURL: false,
        resultsLimit: 5
      })
    });

    const data = await res.json();
    const profile = data[0];

    if (!profile || !profile.followersCount) {
      result.textContent = "Profile not found, private, or no data available.";
      return;
    }

    const followers = profile.followersCount;
    const posts = profile.latestPosts || [];

    if (posts.length === 0) {
      result.textContent = "No recent posts found.";
      return;
    }

    const avgLikes = posts.reduce((sum, p) => sum + (p.likesCount || 0), 0) / posts.length;
    const avgComments = posts.reduce((sum, p) => sum + (p.commentsCount || 0), 0) / posts.length;
    const engagement = ((avgLikes + avgComments) / followers) * 100;

    result.innerHTML = `
      <h2>@${username}</h2>
      <p>Followers: ${followers.toLocaleString()}</p>
      <p>Average Likes: ${avgLikes.toFixed(0)}</p>
      <p>Average Comments: ${avgComments.toFixed(1)}</p>
      <h3>Engagement Rate: ${engagement.toFixed(2)}%</h3>
    `;
  } catch (err) {
    console.error(err);
    result.textContent = err;
  }
});

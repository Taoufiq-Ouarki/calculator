document.getElementById("calculate").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const result = document.getElementById("result");

  if (!username) return result.textContent = "Please enter a username.";

  result.textContent = "Fetching data...";

  try {
    // Example using a free API (replace with your own endpoint)
    const res = await fetch(`https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync?token=`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username], resultsLimit: 10 })
    });

    const data = await res.json();
    const profile = data.items[0];

    const followers = profile.followersCount;
    const posts = profile.latestPosts;
    const avgLikes = posts.reduce((sum, p) => sum + p.likesCount, 0) / posts.length;
    const avgComments = posts.reduce((sum, p) => sum + p.commentsCount, 0) / posts.length;

    const engagement = ((avgLikes + avgComments) / followers) * 100;

    result.innerHTML = `
      <p><b>@${username}</b></p>
      <p>Followers: ${followers.toLocaleString()}</p>
      <p>Average Likes: ${avgLikes.toFixed(0)}</p>
      <p>Average Comments: ${avgComments.toFixed(1)}</p>
      <h2>Engagement Rate: ${engagement.toFixed(2)}%</h2>
    `;
  } catch (e) {
    result.textContent = "Error fetching data. Try another username.";
  }
});

const API_URL = 'https://mentormee-n9gso8uej-baqirs-projects-78b9e2a1.vercel.app/api'; // Backend URL

// Function to show toast notifications
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  // Apply basic styling
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.padding = '10px 20px';
  toast.style.background = type === 'success' ? '#4CAF50' : '#FF5733';
  toast.style.color = '#fff';
  toast.style.borderRadius = '5px';
  toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  toast.style.zIndex = '1000';

  document.body.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Function to create a new post
async function createPost(content, imageUrl) {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': currentUser.token, // Include JWT token for authentication
      },
      body: JSON.stringify({ content, imageUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create post.');
    }

    renderPosts(); // Refresh the posts feed
    showToast('Post created successfully!', 'success');
  } catch (error) {
    showToast(error.message || 'An error occurred. Please try again.', 'error');
  }
}

// Function to like a post
async function likePost(postId) {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': currentUser.token, // Include JWT token for authentication
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to like post.');
    }

    renderPosts(); // Refresh the posts feed
    showToast('Post liked successfully!', 'success');
  } catch (error) {
    showToast(error.message || 'An error occurred. Please try again.', 'error');
  }
}

// Function to add a comment to a post
async function addComment(postId, commentText) {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser) {
        showToast('You need to be logged in to comment.', 'error');
        return;
      }
  
      if (!commentText.trim()) {
        showToast('Comment cannot be empty!', 'error');
        return;
      }
  
      const response = await fetch(`${API_URL}/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': currentUser.token, // Include JWT token for authentication
        },
        body: JSON.stringify({ text: commentText }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add comment.');
      }
  
      const responseData = await response.json(); // Updated post with new comment
  
      // Add the new comment dynamically without refreshing
      // Function to update the comment section dynamically
function updateCommentSection(postId, comments) {
    const commentSection = document.getElementById(`commentSection-${postId}`);
  
    if (commentSection) {
      commentSection.innerHTML = ''; // Clear previous comments
      comments.forEach((comment) => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `<strong>${comment.user.name}:</strong> ${comment.text}`;
        commentSection.appendChild(commentElement);
      });
    }
  }
      updateCommentSection(postId, responseData.comments);
  
      showToast('Comment added successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'An error occurred. Please try again.', 'error');
    }
  }
  

// Function to render posts
async function renderPosts() {
    try {
      const response = await fetch(`${API_URL}/posts`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts.');
      }
  
      const posts = await response.json();
      const postsContainer = document.getElementById('posts');
      if (postsContainer) {
        postsContainer.innerHTML = '';
        posts.forEach((post) => {
          const postElement = document.createElement('div');
          postElement.className = 'post';
  
          // Add post content
          const postContent = document.createElement('p');
          postContent.className = 'text-gray-800';
          postContent.textContent = post.content;
          postElement.appendChild(postContent);
  
          // Add post image (if available)
          if (post.imageUrl) {
            const postImage = document.createElement('img');
            postImage.src = post.imageUrl;
            postImage.alt = 'Post Image';
            postImage.className = 'post-image';
            postElement.appendChild(postImage);
          }
  
          // Add post actions (like and comment buttons)
          const postActions = document.createElement('div');
          postActions.className = 'post-actions';
  
          const likeButton = document.createElement('button');
          likeButton.className = 'like-button';
          likeButton.dataset.postId = post._id;
          likeButton.innerHTML = `<span>👍</span> ${post.likes.length} Likes`;
          likeButton.addEventListener('click', () => likePost(post._id));
          postActions.appendChild(likeButton);
  
          const commentButton = document.createElement('button');
          commentButton.className = 'comment-button';
          commentButton.dataset.postId = post._id;
          commentButton.innerHTML = `<span>💬</span> ${post.comments.length} Comments`;
          postActions.appendChild(commentButton);
  
          postElement.appendChild(postActions);
  
          // Add comment section (if comments exist)
          const commentSection = document.createElement('div');
          commentSection.id = `commentSection-${post._id}`;
          commentSection.className = 'comment-section';
  
          post.comments.forEach((comment) => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `<strong>${comment.user.name}:</strong> ${comment.text}`;
            commentSection.appendChild(commentElement);
          });
  
          postElement.appendChild(commentSection);
  
          // Add input field for comments
          const commentInputContainer = document.createElement('div');
          commentInputContainer.className = 'comment-input-container';
  
          const commentInput = document.createElement('input');
          commentInput.className = 'comment-input';
          commentInput.type = 'text';
          commentInput.placeholder = 'Write a comment...';
          commentInput.dataset.postId = post._id;
  
          const commentSubmit = document.createElement('button');
          commentSubmit.className = 'comment-submit';
          commentSubmit.textContent = 'Post';
          commentSubmit.addEventListener('click', () => {
            const commentText = commentInput.value;
            if (commentText.trim()) {
              addComment(post._id, commentText);
              commentInput.value = ''; // Clear input after submission
            }
          });
  
          commentInputContainer.appendChild(commentInput);
          commentInputContainer.appendChild(commentSubmit);
  
          postElement.appendChild(commentInputContainer);
  
          postsContainer.appendChild(postElement);
        });
      }
    } catch (error) {
      showToast('Failed to load posts. Please try again later.', 'error');
    }
  }
    

// Export functions for use in other files
export { createPost, likePost, addComment, renderPosts };

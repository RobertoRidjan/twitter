let session = new Session();
session_id = session.getSession();

if(session_id !== "") {

    async function populateUserData() {
        let user = new User();
        user = await user.get(session_id);

        document.querySelector('#username').innerText = user['username'];
        document.querySelector('#email').innerText = user['email'];

        document.querySelector("#editUsername").value = user['username'];
        document.querySelector("#editEmail").value = user['email'];
    }

    populateUserData();

} else {
    window.location.href = "/";
}

document.querySelector("#logout").addEventListener('click', e => {
    e.preventDefault();

    session.destroySession();
    window.location.href = '/';
})


document.querySelector("#editAccount").addEventListener('click', e => {
    document.querySelector('.signupModalTwitter').style.display = 'block';
})

document.querySelector("#closeModalTwitter").addEventListener('click', e => {
    document.querySelector('.signupModalTwitter').style.display = 'none';
})

document.querySelector('#editFormTwitter').addEventListener('submit', e => {
    e.preventDefault();

    let user = new User();
    user.username = document.querySelector('#editUsername').value;
    user.email = document.querySelector('#editEmail').value;
    user.edit();
});

document.querySelector('#deleteProfile').addEventListener('click', e => {
    e.preventDefault();

    let text = 'Da li si siguran da zelis obrisat profil?';

    if(confirm(text) == true) {
        let user = new User();
        user.delete();
    }
});

document.querySelector("#postForm").addEventListener('submit', e => {
    e.preventDefault();

    async function createPost() {
        let content = document.querySelector('#tweetInputText').value;
        document.querySelector('#tweetInputText').value = '';
        let post = new Post(); 
        post.post_content = content; 
        post = await post.create();

        let current_user = new User();
        current_user = await current_user.get(session_id);

        let html = document.querySelector('#allPostWrapper').innerHTML;

        let delete_post_html = '';

        if(session_id === post.user_id) {
            delete_post_html = '<button class="removeTweet" onclick="removeMyPost(this)"><i class="fa-solid fa-trash"></i></button>';
        }

        document.querySelector('#allPostWrapper').innerHTML = `<div class="singleTweet" data-post_id="${post.id}">
                                                                    <p>Autor: ${current_user.username}</p>
                                                    
                                                                    <div class="tweetContent">${post.content}</div>
                                                                
                                                                    <div class="tweetActions">
                                                                        <div class="tweetActionsContent">
                                                                            <button onclick="likePost(this)" class="likeTweet"><span>${post.likes}</span><i class="fa-regular fa-heart"></i></button>
                                                                            <button class="commentTweet" onclick="commentPost(this)"><i class="fa-regular fa-comment"></i></button>
                                                                            ${delete_post_html}
                                                                        </div>
                                                                    </div>
                                                                
                                                                    <div class="postComment">
                                                                        <form>
                                                                            <input placeholder="Tweet your reply" type="text">
                                                                            <button onclick="commentPostSubmit(event)">Reply</button>
                                                                        </form>
                                                                    </div> 
                                                                </div>` + html;
    }

    createPost();
});

async function getAllPosts() {
    let all_posts = new Post();
    all_posts = await all_posts.getAllPosts();

    all_posts.forEach(post => {
        async function getPostUser() {

            let user = new User();
            user = await user.get(post.user_id);


            let comments  = new Comment();
            comments = await comments.get(post.id);

            let comments_html = '';
            if(comments.length > 0) {
                comments.forEach(comment => {
                    comments_html += `<div class="singlComment">${comment.content}</div>`;
                });
            }

            
            let html = document.querySelector('#allPostWrapper').innerHTML;

            let delete_post_html = '';

            if(session_id === post.user_id) {
                delete_post_html = '<button class="removeTweet" onclick="removeMyPost(this)"><i class="fa-solid fa-trash"></i></button>';
            }

            document.querySelector('#allPostWrapper').innerHTML = `<div class="singleTweet" data-post_id="${post.id}">
                                                                    <p>Autor: ${user.username}</p>
                                                    
                                                                    <div class="tweetContent">${post.content}</div>
                                                                
                                                                    <div class="tweetActions">
                                                                        <div class="tweetActionsContent">
                                                                            <button onclick="likePost(this)" class="likeTweet"><span>${post.likes}</span><i class="fa-regular fa-heart"></i></button>
                                                                            <button class="commentTweet" onclick="commentPost(this)"><i class="fa-regular fa-comment"></i></button>
                                                                            ${delete_post_html}
                                                                        </div>
                                                                    </div>
                                                                
                                                                    <div class="postComment">
                                                                        <form>
                                                                            <input placeholder="Tweet your reply" type="text">
                                                                            <button onclick="commentPostSubmit(event)">Reply</button>
                                                                        </form>
                                                                        ${comments_html}
                                                                    </div> 
                                                                </div>` + html;
        }

        getPostUser();
    });
}

getAllPosts();

const commentPostSubmit = e => {
    e.preventDefault();

    let btn = e.target;
    btn.setAttribute('disabled', 'true');

    let main_post_el = btn.closest('.singleTweet');
    let post_id = main_post_el.getAttribute('data-post_id');

    let comment_value = main_post_el.querySelector('input').value;

    main_post_el.querySelector('input').value = '';

    main_post_el.querySelector('.postComment').innerHTML += `<div class="singlComment">${comment_value}</div>`;

    let comment = new Comment();
    comment.content = comment_value;
    comment.user_id = session_id;
    comment.post_id = post_id;
    comment.create();
}

const removeMyPost = btn => {
    let post_id = btn.closest('.singleTweet').getAttribute('data-post_id');

    btn.closest('.singleTweet').remove();

    let post = new Post();
    post.delete(post_id);
}

const likePost = btn => {
    let main_post_el = btn.closest('.singleTweet');
    let post_id = btn.closest('.singleTweet').getAttribute('data-post_id');
    let number_of_likes = parseInt(btn.querySelector('span').innerText);

    btn.querySelector('span').innerText = number_of_likes + 1;
    btn.setAttribute('disabled', 'true');

    let post = new Post();
    post.like(post_id, number_of_likes + 1);
}

const commentPost = btn => {
    let main_post_el = btn.closest('.singleTweet')
    let post_id = main_post_el.getAttribute('data-post_id');

    main_post_el.querySelector('.postComment').style.display = 'block';
}
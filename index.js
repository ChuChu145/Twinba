import { tweetsData } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


tweetsData.forEach(function(tweet){
    tweet.replies.forEach(function(reply) {
        if (!reply.uuid) {
            reply.uuid = uuidv4(); 
        }
    });
});

document.addEventListener('click', function (e) {
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like);
    } else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet);
    } else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply);
    } else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick();
    } else if (e.target.id === 'reply-btn') {
        handleReplyBtnClick(e); 
    } else if (e.target.dataset.erase) {
        handleEraseClick(e.target.dataset.erase);
    } else if (e.target.dataset.delet) {
        handleDeleteClick(e.target.dataset.delet);
    }
});

function handleLikeClick(tweetId) {
    const targetTweetObj = tweetsData.find( function (tweet){
        return tweet.uuid === tweetId});

    if (targetTweetObj) {
        if (targetTweetObj.isLiked) {
            targetTweetObj.likes--;
        } else {
            targetTweetObj.likes++;
        }
        targetTweetObj.isLiked = !targetTweetObj.isLiked;
        render();
    }
}

function handleRetweetClick(tweetId) {
    const targetTweetObj = tweetsData.find(function(tweet){
        return tweet.uuid === tweetId});

    if (targetTweetObj) {
        if (targetTweetObj.isRetweeted) {
            targetTweetObj.retweets--;
        } else {
            targetTweetObj.retweets++;
        }
        targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
        render();
    }
}

function handleReplyClick(replyId) {
    const replySection = document.getElementById(`replies-${replyId}`);
    if (replySection) {
        replySection.classList.toggle('hidden');
    }
}

function handleTweetBtnClick() {
    const tweetInput = document.getElementById('tweet-input');

    if (tweetInput.value) {
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
        });
        render();
        tweetInput.value = '';
    }
}

function handleReplyBtnClick(e) {
    const tweetId = e.target.dataset.comment;
    const replyInput = document.getElementById(`reply-input-${tweetId}`);
    const targetTweetObj = tweetsData.find(tweet => tweet.uuid === tweetId);

    if (replyInput && replyInput.value && targetTweetObj) {
        targetTweetObj.replies.unshift({
            handle: `@scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyInput.value,
            uuid: uuidv4(), 
        });
        render();
        replyInput.value = ''; 
    }
}

function handleEraseClick(tweetId) {
    const isConfirmed = confirm("Are you sure you want to delete this tweet?");
    
    const tweetIndex = tweetsData.findIndex(function (tweet){
        return tweet.uuid === tweetId});
        
    if (tweetIndex !== -1 && isConfirmed) {
        tweetsData.splice(tweetIndex, 1);
        render();
    }
}

function handleDeleteClick(replyId) {
    const isConfirmed = confirm("Are you sure you want to delete this reply?");
    
    if (isConfirmed) {
        tweetsData.forEach(tweet => {
            const replyIndex = tweet.replies.find(function(reply){
                return reply.uuid === replyId});
            if (replyIndex !== -1) {
                tweet.replies.splice(replyIndex, 1);
            }
        });
        render();
    }
}

function getFeedHtml() {
    let feedHtml = ``;

    tweetsData.forEach(tweet => {
        let likeIconClass = tweet.isLiked ? 'liked' : '';
        let retweetIconClass = tweet.isRetweeted ? 'retweeted' : '';

        let repliesHtml = '';
        if (tweet.replies.length > 0) {
            tweet.replies.forEach(reply => {
                repliesHtml += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-trash-can"
                                data-delet="${reply.uuid}"></i>
                            </span>
                        </div>
                    </div>
                </div>`;
            });
        }
        
        repliesHtml += `
        <div class="tweet-reply-input">
            <textarea placeholder="Reply to tweet" id="reply-input-${tweet.uuid}"></textarea>
            <button id="reply-btn" data-comment="${tweet.uuid}">Reply</button>
        </div>`;

        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                            ${tweet.retweets}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-trash-can" data-erase="${tweet.uuid}"></i>
                        </span>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
            </div>   
        </div>`;
    });
    return feedHtml;
}

function render() {
    document.getElementById('feed').innerHTML = getFeedHtml();
}

render();

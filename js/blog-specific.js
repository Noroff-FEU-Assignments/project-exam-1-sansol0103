// Get queryString

const pageTitle = document.querySelector("title");

const queryString = document.location.search;

const params = new URLSearchParams(queryString);

const postId = params.get('id');

async function getPost() {
    const response = await fetch('https://www.bawkposts.no/wp-json/wp/v2/posts/' + postId + '?_embed');

    const post = await response.json();

    return post;
}

function createHTML(post) {
    const container = document.querySelector('.blog-post');

    const title = document.createElement('h1');
    title.innerText = post.title.rendered;
    container.append(title);

    if (post._embedded['wp:featuredmedia']) {
        const image = document.createElement('img');
        image.src = post._embedded['wp:featuredmedia'][0].source_url;
        image.alt = post._embedded['wp:featuredmedia'][0].alt_text;
        image.classList.add('image');
        container.append(image);
        
        image.addEventListener('click', () => {
            const modalContainer = document.createElement('div');
            modalContainer.classList.add('modal-container');

            const modalImage = document.createElement('img');
            modalImage.src = post._embedded['wp:featuredmedia'][0].source_url;
            modalImage.alt = post._embedded['wp:featuredmedia'][0].alt_text;
            modalImage.classList.add('modal-image');
            modalContainer.append(modalImage);

            document.body.append(modalContainer);

            modalContainer.addEventListener('click', () => {
                modalContainer.remove();
            })
        });
    } else {
        const noImage = document.createElement('p');
        noImage.innerText = 'No image available';
        container.append(noImage);
    }

    const content = document.createElement('div');
    content.innerHTML = post.content.rendered;
    content.classList.add('content');
    container.append(content);

    const date = document.createElement('p');
    date.innerText = "Date posted: " + post.date;
    container.append(date);

    pageTitle.innerText += post.title.rendered;
}

async function main() {
    const post = await getPost();
    createHTML(post);
}

main();
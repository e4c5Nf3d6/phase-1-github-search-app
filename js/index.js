// Definitions
const form = document.querySelector('#github-form')

// Callbacks
function getUsers(e) {
    fetch(`https://api.github.com/search/users?q=${e.target.search.value}`, {
        headers: {
            "accept": "application/vnd.github.v3+json"
        }
    })
    .then(res => res.json())
    .then(data => {
        let userHeaderLi = document.createElement('li')
        let userHeader = document.createElement('h2')
        userHeader.className = 'headers'
        userHeader.textContent = 'Users'
        userHeaderLi.appendChild(userHeader)
        document.querySelector('#user-list').appendChild(userHeader)

        for (const user of data.items) {
            createListItem(user)
        }
    })
}

function getRepos(e) {
    fetch(`https://api.github.com/search/repositories?q=${e.target.search.value}`, {
        headers: {
            "accept": "application/vnd.github.v3+json"
        }
    })
    .then(res => res.json())
    .then(data => {
        let repoHeaderLi = document.createElement('li')
        let repoHeader = document.createElement('h2')
        repoHeader.className = 'headers'
        repoHeader.textContent = 'Repos'
        repoHeaderLi.appendChild(repoHeader)
        document.querySelector('#repos-list').appendChild(repoHeader)

        for (const repo of data.items) {
            createRepoItem(repo)
        }
    })  
}

function searchGitHub(e) {
    e.preventDefault()

    document.querySelector('#repos-list').innerHTML = ''
    document.querySelector('#user-list').innerHTML = ''

    console.log(e)

    if (e.submitter.name === 'users') {
        getUsers(e)
    } else if (e.submitter.name === 'repos') {
        getRepos(e)
    } else {
        getUsers(e)
        getRepos(e)
    }
    
    form.reset()
}

function createListItem(user) {
    const userList = document.querySelector('#user-list')

    let li = document.createElement('li')
    li.className = 'card'

    let div = document.createElement('div')
    div.title = 'Click to view repos'
    div.className = 'clickable'

    let name = document.createElement('h2')
    name.textContent = user.login
    div.appendChild(name)

    let avatar = document.createElement('img')
    avatar.src = user.avatar_url
    div.appendChild(avatar)

    // Get repos Event Listener

    div.addEventListener('click', () => {
        fetch(`https://api.github.com/users/${user.login}/repos`, {
            headers: {
                "accept": "application/vnd.github.v3+json"
            }  
        })
        .then(res => res.json())
        .then(data => {
            const repoDiv = document.createElement('div')
            repoDiv.className = 'sub-div'
            const repoList = document.createElement('ul')
            repoList.className = 'repos'
            const h3 = document.createElement('h3')
            h3.textContent = "Repos"
            data.forEach(repo => {
                const repoName = repo.name
                const repoLink = repo.html_url
                const repoLi = document.createElement('li')
                const repoA = document.createElement('a')
                repoA.href = repoLink
                repoA.textContent = repoName
                repoA.target = '_blank'
                repoLi.appendChild(repoA)
                repoList.appendChild(repoLi)
            })
            repoDiv.appendChild(h3)
            repoDiv.appendChild(repoList)
            li.appendChild(repoDiv)
        })
    }, {once: true})

    li.appendChild(div)

    let p = document.createElement('p')

    let link = document.createElement('a')
    link.href = user.html_url
    link.textContent = `Github Page`
    link.target = '_blank'

    p.appendChild(link)

    li.appendChild(p)

    userList.appendChild(li)
}

function createRepoItem(repo) {
    const reposList = document.querySelector('#repos-list')

    let li = document.createElement('li')
    li.className = 'card'

    let a = document.createElement('a')
    a.href = repo.html_url
    a.textContent = `${repo.name}`
    a.target = '_blank'
    a.className = 'repo-link'
    li.appendChild(a)

    let language = document.createElement('h4')
    language.textContent = `Language: ${repo.language}`
    li.appendChild(language)

    let description = document.createElement('p')
    description.textContent = repo.description
    li.appendChild(description)
    
    let topics = repo.topics
    if (topics.length > 0) {
        let topicsDiv = document.createElement('div')
        topicsDiv.className = 'sub-div'

        let h3 = document.createElement('h3')
        h3.textContent = 'Topics'
        topicsDiv.appendChild(h3)

        let topicsList = document.createElement('ul')
        for (const topic of topics) {
            let topicLi = document.createElement('li')
            topicLi.textContent = topic
            topicsList.appendChild(topicLi)
        }

        topicsDiv.appendChild(topicsList)
        li.appendChild(topicsDiv)
    }

    reposList.appendChild(li)
}

// Event Listeners
form.addEventListener('submit', searchGitHub)
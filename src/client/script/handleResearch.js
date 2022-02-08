document.getElementById('search-button')
    .addEventListener('click', (event) => {
        event.preventDefault();
        
        const location = document.getElementById('location').value;
        const activity = document.getElementById('activity').value;
        const mandatory = document.getElementById('activity').value;
        const excluded = document.getElementById('excluded').value;
        const pages = document.getElementById('pages').value;

        fetch('http://localhost:4800/doct/', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                location,
                activity,
                mandatory,
                excluded,
                pages,
            })
        })
        .then(res => console.log(res))
        .catch(err => console.log(err));
})